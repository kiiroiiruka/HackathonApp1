import { atom } from 'jotai';

export const myLocationAtom = atom<{ [key: string]: number }>({
    accuracy:0,
    latitude:0,
    longitude:0,
  })