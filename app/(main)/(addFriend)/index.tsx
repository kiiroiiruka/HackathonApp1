import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import StudentList from '@/components/ui/card/AddFriendList';
import { useRouter } from 'expo-router';
import { getAllStudentIds } from '@/firebase/get/allInUserStudentNumber';
import { getFriendsByStudentId } from '@/firebase/get/friendStudentNumber';
import { updateFriendsOfUser } from '@/firebase/update/meFriendChange';  // 修正された関数をインポート

import { useAtom } from 'jotai';
import { studentIdAtom } from '@/atom/studentIdAtom';

export default function App() {
  const router = useRouter();
  const [allStudents, setAllStudents] = useState<string[]>([]);
  const [addedStudents, setAddedStudents] = useState<string[]>([]);
  const [userId, setId] = useAtom(studentIdAtom);

  // 初回読み込みでデータ取得
  useEffect(() => {
    const fetchData = async () => {
      // すべての学籍番号を取得
      const all = await getAllStudentIds();
      // 自分の友達の学籍番号を取得
      const mine = await getFriendsByStudentId(userId);
      setAllStudents(all.filter((id) => id !== userId)); // 自分自身は除外
      setAddedStudents(mine); // 追加済みの友達をセット
    };
    fetchData();
  }, [userId]);

  // ボタン押下時の処理
  const handleFriendToggle = async (targetId: string, shouldAdd: boolean) => {
    // 友達の追加・削除を行う
    await updateFriendsOfUser(userId, targetId, shouldAdd);
    // 更新された友達リストを取得して再設定
    const updated = await getFriendsByStudentId(userId);
    setAddedStudents(updated);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← 戻る</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        <StudentList
          studentIds={allStudents}   // すべての学籍番号リスト
          alreadyAddedIds={addedStudents}  // 追加された友達の学籍番号リスト
          onFriendToggle={handleFriendToggle}  // 友達追加・削除の処理
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 10,
    paddingLeft: 16,
    paddingBottom: 10,
    backgroundColor: '#f2f2f2',
  },
  backText: {
    fontSize: 16,
    color: '#007AFF',
  },
});
