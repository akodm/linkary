import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Haikunator, { Config } from 'haikunator';
import * as Sentry from '@sentry/nextjs';
import { utcNow } from 'src/lib/date';
import { put } from '@vercel/blob';
import { nanoid } from 'nanoid';
import { imageSize } from 'image-size';

const h = new Haikunator();
const defaultOptions: Config = { delimiter: '-', tokenLength: 4 };

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateName(options: Config = defaultOptions) {
  const name = h.haikunate(options);

  return name;
}

export function sentryCaptureException(
  err: Error | unknown,
  action: string,
  extra?: Record<string, unknown>,
) {
  Sentry.captureException(err as Error, {
    tags: {
      action,
    },
    extra: {
      ...extra,
      timestamp: utcNow(),
    },
  });
}

export async function copyToClipboard(text: string) {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    if (typeof document === 'undefined') {
      return false;
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();

    const success = document.execCommand('copy');
    document.body.removeChild(textarea);

    return success;
  } catch {
    return false;
  }
}

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

const MAX_FILE_SIZE = 3 * 1024 * 1024;

export async function uploadImageToVercelBlob(imageUrl: string) {
  const response = await fetch(imageUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }

  const imageBlob = await response.blob();

  if (imageBlob.size > MAX_FILE_SIZE) {
    throw new Error(
      `File size exceeds the maximum limit of 3MB. Current size: ${(imageBlob.size / (1024 * 1024)).toFixed(2)}MB`,
    );
  }

  const contentType = response.headers.get('content-type');

  const urlPath = new URL(imageUrl).pathname;
  const extension = getImageExtension(urlPath, contentType);
  const filename = `${nanoid()}.${extension}`;

  const imageBuffer = Buffer.from(await imageBlob.arrayBuffer());
  const dimensions = imageSize(imageBuffer);

  const blob = await put(filename, imageBlob, {
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
