import { atom } from 'jotai';
import { LinkGetResponse } from 'src/lib/actions/link';

export const selectedFolderAtom = atom<
  LinkGetResponse['folders'][number] | undefined
>();
export const selectedLinkAtom = atom<
  LinkGetResponse['links'][number] | undefined
>();
