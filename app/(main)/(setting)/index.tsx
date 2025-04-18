import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useMeInfoStore } from '@/store/meData';
import { useNavigation } from 'expo-router';
import { meDataUpdateByStudentId} from '@/firebase/update/meDataUpdate';//自分のデータの変更をバクエンド側に反映させる。
import { studentIdAtom } from '@/atom/studentIdAtom';
import { useAtom } from 'jotai';
const SettingScreen: React.FC = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { userInfo } = useMeInfoStore();
  const [location, setLocation] = useState(userInfo.location || '');
  const [freeUntil, setFreeUntil] = useState(userInfo.time || '');
  const [message, setMessage] = useState(userInfo.message || '');
  const [meDId,setMeId]=useAtom(studentIdAtom)

  const { updateLocation, updateTime, updateMessage } = useMeInfoStore();
  
  //変更をバックエンド側に反映させる。userId: string, location:string,message:string,status:string)
  const handleSaveAndGoBack = async () => {
    await meDataUpdateByStudentId(meDId, location,message,freeUntil);//バックエンド側にデータのへんこうを反映させる。
    router.back();//前の画面に戻る。
  };


  // 活動状態トグル処理
  const toggleActiveStatus = () => {
    if (freeUntil === '活動中') {
      updateTime('');
      setFreeUntil('');
      Alert.alert('状態が「暇」に変更されました');
    } else {
      updateTime('活動中');
      setFreeUntil('活動中');
      Alert.alert('状態が「活動中」に変更されました');
    }
  };

  // 入力ハンドラー
  const handleFreeUntilChange = (newTime: string) => {
    setFreeUntil(newTime);
    updateTime(newTime);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() =>{handleSaveAndGoBack()}} style={styles.backButton}>
        <Text style={styles.backButtonText}>← 保存して戻る</Text>
      </TouchableOpacity>

      <Text style={styles.title}>今の状態を登録しよう</Text>

      {/* 状態表示 */}
      <Text
        style={[
          styles.statusText,
          freeUntil === '活動中' ? styles.busyStatus : styles.freeStatus,
        ]}
      >
        {freeUntil === '活動中' ? '活動中です' : '暇です'}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="今の場所（例: 渋谷）"
        value={location}
        onChangeText={(text) => {
          setLocation(text);
          updateLocation(text);
        }}
      />

      <TextInput
        style={styles.input}
        placeholder="一言メッセージ（例: カフェいきたい）"
        value={message}
        onChangeText={(text) => {
          setMessage(text);
          updateMessage(text);
        }}
      />

      <TextInput
        style={styles.input}
        placeholder="何時まで暇？（例: 18:00）"
        value={freeUntil}
        onChangeText={handleFreeUntilChange}
        keyboardType="default"
      />

      <View style={{ marginTop: 20,flexDirection:"row" }}>
        <Text style={styles.title}>ユーザー情報</Text>
        <Text>UID: {userInfo.uid}</Text>
        <Text>ユーザー名: {userInfo.username}</Text>
        <Text>場所: {userInfo.location}</Text>
        <Text>メッセージ: {userInfo.message}</Text>
        <Text>時間: {userInfo.time}</Text>
      </View>

      {/* 状態トグルボタン */}
      <TouchableOpacity
        style={[
          styles.saveButton,
          { backgroundColor: freeUntil === '活動中' ? '#FF6347' : '#1E90FF' },
        ]}
        onPress={toggleActiveStatus}
      >
        <Text style={styles.buttonText}>
          {freeUntil === '活動中' ? '活動中解除' : '暇状態を活動中に変更'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    
  },
  backButton: {

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
    color: 'green',
  },
  busyStatus: {
    color: 'red',
  },
  saveButton: {
    width: 200,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: '#FF6347',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default SettingScreen;
