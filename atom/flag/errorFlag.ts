// atoms.js
import { atom } from "jotai";

// エラーフラグのatom（初期値はfalse、エラーが発生したらtrueに変更）
export const errorFlagAtom = atom(true);
