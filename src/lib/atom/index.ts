import { atom } from 'jotai';
import { LinkGetResponse } from 'src/lib/actions/link';

export type Folder = LinkGetResponse['folders'][number];

export type Link = LinkGetResponse['links'][number];

export const selectedFolderAtom = atom<
  LinkGetResponse['folders'][number] | undefined
>();
export const selectedLinkAtom = atom<
  LinkGetResponse['links'][number] | undefined
>();
