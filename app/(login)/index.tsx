import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform,Alert } from 'react-native';
import { useRouter } from 'expo-router'; // expo-routerを使って遷移
import AsyncStorage from '@react-native-async-storage/async-storage'; // ローカルストレージを使う
import { signInWithEmailAndPassword, updateEmail } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig'; // ← あなたのパスに合わせてね
import { getStudentIdByEmail } from '@/firebase/get/studentNumberAcquisition';
import { studentIdAtom } from '@/atom/studentIdAtom';
import { useAtom } from 'jotai';
import { fetchFriendsFromStudentIdArray } from '@/firebase/get/friendInfoAcquisition';
import { fetchUserInfoAndSet } from '@/firebase/get/meDataset';
const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // エラーメッセージの状態
  const [id,setId]=useAtom(studentIdAtom)
  const router = useRouter(); // ページ遷移をするためにrouterを使う

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('ユーザー名とパスワードを入力してください。');
      return;
    }
  
    try {
      // Firebase Auth でログイン処理
      await signInWithEmailAndPassword(auth, email, password);
      const studentId = await getStudentIdByEmail(email);
      await fetchFriendsFromStudentIdArray(email)//自分以外の人のデータをセットする。
      await fetchUserInfoAndSet(email)//自分のデータをフロントにセットする。
      if(studentId)setId(studentId)

      // ログイン成功時の処理（保存する？確認アラート）
      if (Platform.OS === 'web') {
        const result = window.confirm('ログイン情報を保存しますか？');
        if (result) {
          localStorage.setItem('email', email);//ローカルストレージにメールアドレスを保持
          localStorage.setItem('password', password);//ローカルストレージにメールアドレスを保持
        }
        router.replace('./(main)');
      } else {
        Alert.alert(
          '確認',
          'ログイン情報を保存しますか？',
          [
            { text: 'NO', onPress: () => router.replace('./(main)') },
            {
              text: 'OK',
              onPress: async () => {
                await AsyncStorage.setItem('email',email);//ローカルストレージにメールアドレスを保持
                await AsyncStorage.setItem('password', password);//ローカルストレージにパスワードを保持
                router.replace('./(main)');
              },
            },
          ],
          { cancelable: false }
        );
      }
  
    } catch (error: any) {
      console.error('ログイン失敗:', error);
      setErrorMessage('メールアドレスまたはパスワードが正しくありません。'); // エラーメッセージを表示
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ログイン</Text>
      <TextInput
        style={styles.input}
        placeholder="メールアドレス"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="パスワード"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      {/* エラーメッセージを赤色で表示 */}
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>ログイン</Text>
      </TouchableOpacity>
      
      <View style={styles.signUpContainer}>
        <Text style={styles.text}>初めての方はこちら:</Text>
        <TouchableOpacity onPress={() => router.push('./signUp')}>
          <Text style={styles.signUpText}>サインアップ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 12,
    fontSize: 16,
    color:"gray"
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  text: {
    fontSize: 16,
    marginRight: 5,
  },
  signUpText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  errorText: {
    color: 'red', // 赤色でエラーメッセージを表示
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  }
});

export default LoginScreen;
