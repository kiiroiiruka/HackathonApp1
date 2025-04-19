import React, { useState,useCallback  } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Platform,ScrollView, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { useMeInfoStore } from '@/store/meData';
import { meDataUpdateByStudentId} from '@/firebase/update/meDataUpdate';//自分のデータの変更をバクエンド側に反映させる。
import { studentIdAtom } from '@/atom/studentIdAtom';
import { useAtom } from 'jotai';
import SubHeader from '@/components/ui/header/SubScreenHeader'
import { isBackendFunctionActiveAtom } from '@/atom/setting/backendFunctionBoot';
import { errorFlagAtom } from '@/atom/flag/errorFlag';

const SettingScreen: React.FC = () => {
  const router = useRouter();
  const { userInfo } = useMeInfoStore();
  const [location, setLocation] = useState(userInfo.location || '');
  const [freeUntil, setFreeUntil] = useState(userInfo.time || '');
  const [message, setMessage] = useState(userInfo.message || '');
  const [meDId,setMeId]=useAtom(studentIdAtom)
  const [backend,]=useAtom(isBackendFunctionActiveAtom)
  const [,errorFlag]=useAtom(errorFlagAtom)
  const { updateLocation, updateTime, updateMessage } = useMeInfoStore();
  
  const change = async () => {
    if (backend) {
      const flag = await meDataUpdateByStudentId(meDId, location, message, freeUntil);
  
      if (flag === false) {
        errorFlag(false);
      } else {
        // 🟢 保存成功時に zustand 側も更新
        updateLocation(location);
        updateMessage(message);
        updateTime(freeUntil);
  
        if (Platform.OS === 'web') {
          window.alert('編集内容を保存しました');
        } else {
          Alert.alert('編集内容を保存しました');
        }
      }
    }
  };
  

  // 活動状態トグル処理
  const toggleActiveStatus = () => {
    if (freeUntil === '活動中') {
      setFreeUntil('');
    } else {
      setFreeUntil('活動中');
    }
  };

  // 入力ハンドラー
  const handleFreeUntilChange = (newTime: string) => {
    setFreeUntil(newTime);
  };

  return (
    <View style={{flex:1, backgroundColor:"white"}}>
      <SubHeader title="今の状態を登録しよう" onBack={() => router.back()} />
    
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80} // 必要に応じて調整
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* ↓中身はそのままでOK */}
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
            onChangeText={(text) => setLocation(text)}
          />
    
          <TextInput
            style={styles.input}
            placeholder="一言メッセージ（例: カフェいきたい）"
            value={message}
            onChangeText={(text) => setMessage(text)}
          />
    
          {freeUntil !== '活動中' && (
            <TextInput
              style={styles.input}
              placeholder="何時まで暇？（例: 18:00）"
              value={freeUntil}
              onChangeText={handleFreeUntilChange}
            />
          )}
    
          <TouchableOpacity
            style={[
              styles.roundButton,
              { backgroundColor: freeUntil === '活動中' ? '#FF6347' : 'rgb(49, 199, 149)' },
            ]}
            onPress={toggleActiveStatus}
            activeOpacity={0.8}
          >
            <Text style={styles.roundButtonText}>
              {freeUntil === '活動中' ? '活動中解除' : '活動中にする'}
            </Text>
          </TouchableOpacity>
    
          <TouchableOpacity
            onPress={change}
            style={styles.saveButton}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>変更内容を保存する</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  roundButton: {
    width: 180,
    height: 180,
    borderRadius: 90, // 完全な円！
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center', // 中央配置
    marginVertical: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    
  },
  
  roundButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  saveButton: {
    backgroundColor: '#2196F3', // 鮮やかなブルー
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Android の影
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#f2f2f2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  container: {
    backgroundColor: 'white',
    padding:10, 
    
  },
  backButton: {
    zIndex: 10,
    padding: 10,
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
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default SettingScreen;
