import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { createUser } from '../../firebase/add/createUser';
import { studentIdAtom } from '@/atom/studentIdAtom';
import { useAtom } from 'jotai';
import { fetchUserInfoAndSet } from '@/firebase/get/meDataset';
const SignUpScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [studentId, setStudentId] = useState(''); // ← 追加
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [id,setId]=useAtom(studentIdAtom)
  const router = useRouter();
  

  const handleSignUp = async () => {
    if (!username || !studentId || !email || !password) {
      Alert.alert('エラー', 'すべてのフィールドを入力してください。');
      return;
    }

    try {
      const result = await createUser(email, password, username,studentId); // ここで必要なら studentId も送れるように変更
      await fetchUserInfoAndSet(email)//自分のデータをフロントにセットする
      if (result.success) {
        setId(studentId)
        console.log("学籍番号をここにほじさせる",studentId)
        
        if (Platform.OS === 'web') {
          localStorage.setItem('email', email);
          localStorage.setItem('password', password);
        } else {
          await AsyncStorage.setItem('email', email);
          await AsyncStorage.setItem('password', password);
        }
        router.replace('../(main)');
      }
    } catch (error: any) {
      Alert.alert('登録エラー', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Text style={{ marginRight: 'auto' }} onPress={() => { router.replace('./'); }}>
          ログイン画面へ戻る
        </Text>
      </TouchableOpacity>

      <Text style={styles.title}>サインアップ</Text>
      <Text style={{ marginHorizontal: 'auto', color: 'red' }}>※ユーザー名は後ほど変更可能です</Text>

      <TextInput
        style={styles.input}
        placeholder="ユーザー名"
        value={username}
        onChangeText={setUsername}
      />
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
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="パスワード"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>サインアップ</Text>
      </TouchableOpacity>
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
    color: 'gray',
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
});

export default SignUpScreen;
