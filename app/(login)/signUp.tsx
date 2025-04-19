import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUser } from '../../firebase/add/createUser';
import { studentIdAtom } from '@/atom/studentIdAtom';
import { useAtom } from 'jotai';
import { fetchUserInfoAndSet } from '@/firebase/get/meDataset';
import { mailAddressAtom } from '@/atom/mailAddressAtom';
import { errorFlagAtom } from '@/atom/flag/errorFlag';
import SubHeader from '@/components/ui/header/SubScreenHeader';

const SignUpScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [id, setId] = useAtom(studentIdAtom);
  const router = useRouter();
  const [, setMail] = useAtom(mailAddressAtom);
  const [, errorFlag] = useAtom(errorFlagAtom);
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  
  //ーーー↓重複防止トークンの作成↓ーーー
  const generateTokenWithTimestamp = (gakuseki: string): string => {
    const now = new Date();
    const year = now.getFullYear();                  // 2025
    const month = String(now.getMonth() + 1).padStart(2, "0");  // 04
    const day = String(now.getDate()).padStart(2, "0");         // 20
    const hour = String(now.getHours()).padStart(2, "0");       // 15
    const minute = String(now.getMinutes()).padStart(2, "0");   // 23
    const second = String(now.getSeconds()).padStart(2, "0");   // 45
    const ms = String(now.getMilliseconds()).padStart(3, "0");  // 123
    // タイムスタンプを作成
    const timestamp = `${year}-${month}-${day}_${hour}:${minute}:${second}.${ms}`;
    // 学籍番号とタイムスタンプを結合して返す
    return `${gakuseki}--${timestamp}`;
  };
  //ーーー↑重複防止トークンの作成↑ーーー

  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!regex.test(email)) {
      setEmailError('正しい形式でメールアドレスを入力してください');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      setPasswordError('パスワードは6文字以上で入力してください');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSignUp = async () => {
    if (!username || !studentId || !email || !password) {
      Alert.alert('エラー', 'すべてのフィールドを入力してください。');
      return;
    }
    if (!validateEmail(email)) {
      return;
    }
    if (!validatePassword(password)) {
      return;
    }

    
    //ーーー↓メールアドレスを基に自分の情報をフロントにセット↓ーーー
    const flag = await fetchUserInfoAndSet(email);
    if (flag === false) errorFlag(false);
    //ーーー↑メールアドレスを基に自分の情報をフロントにセット↑ーーー
    
    //ーーー↓新しいユーザーのアカウント作成してバックに追加↓ーーー
    const studentIdAndToken = generateTokenWithTimestamp(studentId);//誰かが入力ミスしていた際に重複する可能性があるため(入力タイミングを示すトークンを後ろにつける)
    const result = await createUser(email, password, username,studentIdAndToken);
    if (result === 'email-in-use') {
      Alert.alert('エラー', 'このメールアドレスはすでに利用されています');
      return;
    }
    if (result === false) {
      errorFlag(false);
    } else {
      setMail(email);
      setId(studentIdAndToken);
  
      // Web環境での処理
      if (Platform.OS === 'web') {
        const message = 'サインアップに成功しました!今回入力したメールアドレスとパスワード情報を保存しますか？次回以降ログイン情報を入力せずに利用できます※回線に不具合がある、もしくはログアウトした場合などは再度入力が必要になります'; 
        const result = window.confirm(message);
        if (result) {
          // ユーザーがOKを選択した場合、ローカルストレージに保存
          localStorage.setItem('email', email);
          localStorage.setItem('password', password);
        }
        // メイン画面に遷移
        router.replace('/(main)');
      } else {
        // スマホ環境での処理
        Alert.alert(
          'サインアップに成功しました!',
          '今回入力したメールアドレスとパスワード情報を保存しますか？次回以降ログイン情報を入力せずに利用できます※回線に不具合がある、もしくはログアウトした場合などは再度入力が必要になります',
          [
            { text: 'NO', onPress: () => router.replace('/(main)') },
            {
              text: 'OK',
              onPress: async () => {
                // ユーザーがOKを選択した場合、AsyncStorageに保存
                await AsyncStorage.setItem('email', email);
                await AsyncStorage.setItem('password', password);
                router.replace('/(main)');
              },
            },
          ],
          { cancelable: false } // ユーザーがアラート外をタップしても閉じられないようにする
        );
      }
    }
    //ーーー↑新しいユーザーのアカウント作成してバックに追加↑ーーー
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1,backgroundColor:"white"}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header を ScrollView の外に配置 */}
      <SubHeader title="サインアップ" onBack={() => router.back()} />

      {/* ScrollView で入力フォーム部分をスクロール可能に */}
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 10 }}>
        <View style={styles.container}>
          <Text style={styles.title}>{"以下の内容を入力してください"}</Text>
          <Text style={{ marginHorizontal: 'auto', color: 'red' }}>※ユーザー名は後ほど変更可能です</Text>
          <TextInput
            style={styles.input}
            placeholder="ユーザー名"
            value={username}
            onChangeText={setUsername}
          />
          <Text style={{ marginHorizontal: 'auto', color: 'red' }}>
            {`※学籍番号の末尾に入力時刻が追加されます（入力ミスによる重複防止のため）。\n例：学籍番号「123」を入力 → 登録される学籍番号は「123--2025-04-20_15:23:45.123」となります。\n※入力した「123」の部分は後ほど変更可能です。`}</Text>
          <TextInput
            style={styles.input}
            placeholder="学籍番号"
            value={studentId}
            onChangeText={setStudentId}
          />
          <TextInput
            style={styles.input}
            placeholder="メールアドレス"
            value={email}
            onChangeText={(text) => setEmail(text)}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          <TextInput
            style={styles.input}
            placeholder="パスワード"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>サインアップ</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
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
    color: 'gray',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30, // 少し余白を追加してボタンと画面下部がくっつかないようにする
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
});

export default SignUpScreen;
