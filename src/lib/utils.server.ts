'use server';

import sharp from 'sharp';
import { put } from '@vercel/blob';
import { nanoid } from 'nanoid';
import { imageSize } from 'image-size';

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
const MAX_IMAGE_WIDTH = 1024;
const VALID_IMAGE_EXTENSIONS = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'webp',
  'svg',
  'bmp',
  'ico',
  'avif',
  'heic',
  'heif',
] as const;

function getImageExtension(
  urlPath: string,
  contentType: string | null,
): string {
  const urlExtension = urlPath.split('.').pop()?.toLowerCase();

  if (
    urlExtension &&
    VALID_IMAGE_EXTENSIONS.includes(
      urlExtension as (typeof VALID_IMAGE_EXTENSIONS)[number],
    )
  ) {
    return urlExtension;
  }

  if (contentType) {
    const mimeToExt: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
      'image/svg+xml': 'svg',
      'image/bmp': 'bmp',
      'image/x-icon': 'ico',
      'image/vnd.microsoft.icon': 'ico',
      'image/avif': 'avif',
      'image/heic': 'heic',
      'image/heif': 'heif',
    };

    const extension = mimeToExt[contentType];
    if (extension) {
      return extension;
    }
  }

  return 'jpg';
}

export async function uploadImageToVercelBlob(imageUrl: string) {
  const response = await fetch(imageUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }

  const imageBlob = await response.blob();
  const imageBuffer = Buffer.from(await imageBlob.arrayBuffer());
  const opt = await sharp(imageBuffer)
    .resize({ width: MAX_IMAGE_WIDTH, withoutEnlargement: true })
    .webp({ quality: 70 })
    .toBuffer();
  const sizeInBytes = opt.length;
  const sizeInKb = ((sizeInBytes / 1024) * 1024).toFixed(2);

  if (Number(sizeInKb) > MAX_FILE_SIZE) {
    throw new Error(
      `File size exceeds the maximum limit of 3MB. Current size: ${(imageBlob.size / (1024 * 1024)).toFixed(2)}MB`,
    );
  }

  const contentType = response.headers.get('content-type');

  const urlPath = new URL(imageUrl).pathname;
  const extension = getImageExtension(urlPath, contentType);
  const filename = `${nanoid()}.${extension}`;

  const dimensions = imageSize(imageBuffer);

  const blob = await put(filename, opt, {
    access: 'public',
    contentType: imageBlob.type || contentType || `image/${extension}`,
  });

  return {
    url: blob.url,
    width: dimensions?.width ?? 0,
    height: dimensions?.height ?? 0,
    aspectRatio: dimensions?.width
      ? parseFloat((dimensions.width / dimensions.height).toFixed(2))
      : 0,
  };
}
