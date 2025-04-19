import { atom } from 'jotai';

// バックエンド関数を起動するかどうかを管理するatom
export const isBackendFunctionActiveAtom = atom(true); // 初期状態はfalse