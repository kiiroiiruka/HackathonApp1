import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useMeInfoStore } from '@/store/meData';
import { useRouter } from 'expo-router';
import SubHeader from '@/components/ui/header/SubScreenHeader';
import { updateFriendsWithNewStudentId } from '@/firebase/update/studentNumberUpdate';
import { useAtom } from 'jotai';
import { studentIdAtom } from '@/atom/studentIdAtom';
import { mailAddressAtom } from '@/atom/mailAddressAtom';
import { updateUsernameByEmail } from '@/firebase/update/meNameChange';

const ProfileScreen = () => {
  const router = useRouter();
  const { userInfo, setUserInfo } = useMeInfoStore();
  const [, setStudentId] = useAtom(studentIdAtom);
  const [mail] = useAtom(mailAddressAtom);

  const uid = userInfo.uid || '';
  const lastDoubleHyphenIndex = uid.lastIndexOf('--');

  const [editableUidPart, setEditableUidPart] = useState(() =>
    lastDoubleHyphenIndex !== -1 ? uid.slice(0, lastDoubleHyphenIndex) : uid
  );

  const fixedUidPart =
    lastDoubleHyphenIndex !== -1 ? uid.slice(lastDoubleHyphenIndex) : '';

  const [username, setUsername] = useState(userInfo.username);

  const handleSave = async () => {
    if (!editableUidPart || !username) {
      Alert.alert('エラー', 'すべての項目を入力してください');
      return;
    }

    const newUid = `${editableUidPart}${fixedUidPart}`;

    setUserInfo({ ...userInfo, uid: newUid, username });
    setStudentId(newUid);

    const updateResult = await updateFriendsWithNewStudentId(newUid);
    await updateUsernameByEmail(mail, username);

    if (updateResult) {
      Alert.alert('保存完了', '個人情報を更新しました');
    } else {
      Alert.alert('エラー', 'Firebaseの更新に失敗しました');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <SubHeader title="個人情報設定" onBack={() => router.back()} />

      <View style={styles.content}>
        <Text style={styles.label}>学籍番号</Text>
        <Text style={styles.subLabel}>（末尾は自動的に付与されます）</Text>
        <View style={styles.uidRow}>
          <TextInput
            value={editableUidPart}
            onChangeText={setEditableUidPart}
            style={[styles.input, { flex: 1 }]}
            placeholder="UIDの編集可能部分"
            placeholderTextColor="#999"
          />
          {fixedUidPart !== '' && (
            <Text style={styles.fixedText}>{fixedUidPart}</Text>
          )}
        </View>

        <Text style={styles.label}>ユーザー名</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          placeholder="ユーザー名を入力"
          placeholderTextColor="#999"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>編集内容を保存する</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  content: {
    padding: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 24,
    color: '#333',
  },
  subLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    elevation: 1,
  },
  uidRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fixedText: {
    fontSize: 16,
    color: '#888',
    fontStyle: 'italic',
    marginLeft: 8,
  },
  saveButton: {
    marginTop: 40,
    backgroundColor: '#2196f3',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#2196f3',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
