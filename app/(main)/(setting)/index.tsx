import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useMeInfoStore } from '@/store/meData';

const SettingScreen: React.FC = () => {
  const router = useRouter();
  const { userInfo } = useMeInfoStore(); // Zustand から userInfo を取得
  const [location, setLocation] = useState(userInfo.location || ''); // 初期値は Zustand の値
  const [freeUntil, setFreeUntil] = useState(userInfo.time || '');  // 初期値は Zustand の値
  const [message, setMessage] = useState(userInfo.message || '');   // 初期値は Zustand の値
  const [isFree, setIsFree] = useState(userInfo.time === '' ? true : false); // 初期状態は「暇」

  // Zustand actions
  const { updateLocation, updateTime, updateMessage } = useMeInfoStore();

  // timeが変更されたときにisFreeの状態を更新
  useEffect(() => {
    if (userInfo.time === '') {
      setIsFree(true);
    } else {
      setIsFree(false);
    }
  }, [userInfo.time]);

  // 状態を保存する関数（活動状態も含めて保存）
  const handleSave = () => {
    const timeToSet = isFree ? freeUntil : '活動中';

    // Zustand へ location, message, time を更新
    updateLocation(location);
    updateMessage(message);
    updateTime(timeToSet);

    Alert.alert('情報が保存されました', `場所: ${location}\nメッセージ: ${message}\n時間: ${timeToSet}`);
  };

  // 活動中解除ボタン
  const handleSetIdle = () => {
    // time を空白に設定
    updateTime('');
    setIsFree(true); // 「暇」に切り替え
    Alert.alert('状態が「暇」に変更されました');
  };

  // 暇状態を活動中に変更するボタン
  const handleSetActive = () => {
    // time を「活動中」に設定
    updateTime('活動中');
    setIsFree(false); // 「活動中」に切り替え
    Alert.alert('状態が「活動中」に変更されました');
  };

  return (
    <View style={styles.container}>
      {/* ← 戻るボタン */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← 戻る</Text>
      </TouchableOpacity>

      <Text style={styles.title}>今の状態を登録しよう</Text>

      {/* 状態に応じたメッセージ表示 */}
      <Text
        style={[
          styles.statusText,
          isFree ? styles.freeStatus : styles.busyStatus,
        ]}
      >
        {isFree ? '暇です' : '活動中です'}
      </Text>

      {/* 保存ボタン */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
      >
        <Text style={styles.buttonText}>一言メッセージと現在地を保存する</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="今の場所（例: 渋谷）"
        value={location}
        onChangeText={setLocation} // 入力変更時に状態更新
      />

      {/* 暇な時だけ表示 */}
      <TextInput
        style={styles.input}
        placeholder="一言メッセージ（例: カフェいきたい）"
        value={message}
        onChangeText={setMessage} // 入力変更時に状態更新
      />

      <TextInput
        style={[
          styles.input,
          !isFree && styles.disabledInput,
        ]}
        placeholder="何時まで暇？（例: 18:00）"
        value={isFree ? freeUntil : '活動中'}
        onChangeText={setFreeUntil} // 入力変更時に状態更新
        keyboardType="numeric"
        editable={isFree}
        placeholderTextColor={isFree ? 'gray' : '#aaa'}
      />

      <View style={{flexDirection:"row"}}>
        <Text style={styles.title}>ユーザー情報</Text>
        <Text>UID: {userInfo.uid}</Text>
        <Text>ユーザー名: {userInfo.username}</Text>
        <Text>場所: {userInfo.location}</Text>
        <Text>メッセージ: {userInfo.message}</Text>
        <Text>時間: {userInfo.time}</Text>
      </View>

      {/* 動的なボタン表示 */}
      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: isFree ? '#FF6347' : '#1E90FF' }]} // 色変更
        onPress={isFree ? handleSetActive : handleSetIdle}
      >
        <Text style={styles.buttonText}>
          {isFree ? '暇状態を活動中に変更' : '活動中解除'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  disabledInput: {
    backgroundColor: '#f2f2f2',
    color: '#aaa',
  },
  container: {
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  title: {
    fontSize: 22,
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
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  freeStatus: {
    color: 'green', // 暇な時は緑色
  },
  busyStatus: {
    color: 'red', // 活動中の時は赤色
  },
  saveButton: {
    width: 200,
    height: 50,
    borderRadius: 25, // 角丸にする
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: '#FF6347', // グラデーション効果
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4, // Android用のシャドウ
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default SettingScreen;
