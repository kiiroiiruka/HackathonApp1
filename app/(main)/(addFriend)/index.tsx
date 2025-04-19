import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import StudentList from '@/components/ui/card/AddFriendList';
import { useRouter } from 'expo-router';
import { getAllStudentIds } from '@/firebase/get/allInUserStudentNumber';
import { getFriendsByStudentId } from '@/firebase/get/friendStudentNumber';
import { updateFriendsOfUser } from '@/firebase/update/meFriendChange';  // 修正された関数をインポート
import SubHeader from '@/components/ui/header/SubScreenHeader'
import { useAtom } from 'jotai';
import { studentIdAtom } from '@/atom/studentIdAtom';
import { isBackendFunctionActiveAtom } from '@/atom/setting/backendFunctionBoot';
import { errorFlagAtom } from '@/atom/flag/errorFlag';
export default function App() {
  const router = useRouter();
  const [allStudents, setAllStudents] = useState<string[]>([]);
  const [addedStudents, setAddedStudents] = useState<string[]>([]);
  const [userId, setId] = useAtom(studentIdAtom);
  const [backend,]=useAtom(isBackendFunctionActiveAtom)
  const [,errorFlag]=useAtom(errorFlagAtom)
  // 初回読み込みでデータ取得
  useEffect(() => {
    const fetchData = async () => {
      // すべての学籍番号を取得
      if(backend){

        //ーーー↓全ユーザーの情報をフロントにセット↓ーーー
        const all = await getAllStudentIds();
        if(all===false)errorFlag(false)//falseが返ってきて通信に失敗した場合はerror
        else setAllStudents(all.filter((id) => id !== userId)); // 自分自身は除外して読み込む
        //ーーー↑全ユーザーの情報をフロントにセット↑ーーー

        //ーーー↓自分が友達に設定しているuserの情報をフロントにセット↓ーーー
        const mine = await getFriendsByStudentId(userId);
        if(mine===false)errorFlag(false)//falseが返ってきて通信に失敗した場合はerror
        else setAddedStudents(mine); // 追加済みの友達をセット
        //ーーー↑自分が友達に設定しているuserの情報をフロントにセット↑ーーー
        
      }
    };
    fetchData();
  }, [userId]);

  // ボタン押下時の処理
  const handleFriendToggle = async (targetId: string, shouldAdd: boolean) => {
    // 友達の追加・削除を行う
    if(backend){

        //ーーー↓自分の友達の追加削除による変更をバックに反映させる↓ーーー
        const flag=await updateFriendsOfUser(userId, targetId, shouldAdd);
        if(flag===false)errorFlag(false)//falseが返ってきて通信に失敗した場合はerror
        //ーーー↑自分の友達の追加削除による変更をバックに反映させる↑ーーー

        //ーーー↓自分が友達に設定しているuserの情報をフロントにセット↓ーーー
        const updated = await getFriendsByStudentId(userId);
        if(updated===false)errorFlag(false)//falseが返ってきて通信に失敗した場合はerror
        else setAddedStudents(updated);// 自分自身は除外して読み込む
        //ーーー↑自分が友達に設定しているuserの情報をフロントにセット↑ーーー
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SubHeader title="友達の追加・削除" onBack={() => router.back()} />
      <View style={{ flex: 1}}>
        <StudentList
          studentIds={allStudents}   // すべての学籍番号リスト
          alreadyAddedIds={addedStudents}  // 追加された友達の学籍番号リスト
          onFriendToggle={handleFriendToggle}  // 友達追加・削除の処理
        />
      </View>
    </SafeAreaView>
  );
}
