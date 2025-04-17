import { atom } from 'jotai';

// 自分の学籍番号を保持するatom（デフォルトは空文字）
export const studentIdAtom = atom<string>('');
