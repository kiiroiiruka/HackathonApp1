import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

// ユーザー作成とFirestore保存を行う関数
export const createUser = async (email: string, password: string, username: string, studentId: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Firestoreにユーザー情報を保存
    await setDoc(doc(db, 'users', uid), {
      username: username,
      studentId: studentId, // ← 学籍番号をフィールドとして保存
      email: email,
      location: '', // 現在地の場所を示す文字列情報（最初は空）
      friends: [],  // フレンドのユーザーID一覧（最初は空の配列）
      status: '活動中', // 「どの時間帯まで暇か」を示す文字列（初期は「活動中」）
      message: '',
      profileImageUri: "", // 新しく画像URIを追加
      createdAt: serverTimestamp(), // サーバータイムスタンプ
    });

    return true; // Success
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      // If email is already in use, return a specific string
      return 'email-in-use';
    }

    console.error('ユーザー作成エラー:', error);
    return false; // Other errors
  }
};
