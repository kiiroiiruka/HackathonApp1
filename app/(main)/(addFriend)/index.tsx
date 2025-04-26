import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
} from "react-native";
import StudentList from "@/components/ui/card/AddFriendList";
import { useRouter } from "expo-router";
import { getAllStudentIds } from "@/firebase/get/allInUserStudentNumber";
import { getFriendsByStudentId } from "@/firebase/get/friendStudentNumber";
import { updateFriendsOfUser } from "@/firebase/update/meFriendChange"; // 修正された関数をインポート
import SubHeader from "@/components/ui/header/SubScreenHeader";
import { useAtom } from "jotai";
import { studentIdAtom } from "@/atom/studentIdAtom";
import { errorFlagAtom } from "@/atom/flag/errorFlag";

export default function App() {
  const router = useRouter();
  const [allStudents, setAllStudents] = useState<string[]>([]);
  const [userName, setUserName] = useState<string[]>([]);
  const [addedStudents, setAddedStudents] = useState<string[]>([]);
  const [userId, setId] = useAtom(studentIdAtom);
  const [, errorFlag] = useAtom(errorFlagAtom);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredStudents = allStudents.filter((id) =>
    id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 初回読み込みでデータ取得
  useEffect(() => {
    const fetchData = async () => {
      // すべての学籍番号を取得

      //ーーー↓全ユーザーの情報をフロントにセット↓ーーー
      const all = await getAllStudentIds();
      if (all === false)
        errorFlag(false); //falseが返ってきて通信に失敗した場合はerror
      else setAllStudents(all.filter((id) => id !== userId)); // 自分自身は除外して読み込む
      //ーーー↑全ユーザーの情報をフロントにセット↑ーーー

      //ーーー↓自分が友達に設定しているuserの情報をフロントにセット↓ーーー
      const mine = await getFriendsByStudentId(userId);
      if (mine === false)
        errorFlag(false); //falseが返ってきて通信に失敗した場合はerror
      else setAddedStudents(mine); // 追加済みの友達をセット
      //ーーー↑自分が友達に設定しているuserの情報をフロントにセット↑ーーー
    };
    fetchData();
  }, [userId]);

  // ボタン押下時の処理
  const handleFriendToggle = async (targetId: string, shouldAdd: boolean) => {
    // 友達の追加・削除を行う

    //ーーー↓自分の友達の追加削除による変更をバックに反映させる↓ーーー
    const flag = await updateFriendsOfUser(userId, targetId, shouldAdd);
    if (flag === false) errorFlag(false); //falseが返ってきて通信に失敗した場合はerror
    //ーーー↑自分の友達の追加削除による変更をバックに反映させる↑ーーー

    //ーーー↓自分が友達に設定しているuserの情報をフロントにセット↓ーーー
    const updated = await getFriendsByStudentId(userId);
    if (updated === false)
      errorFlag(false); //falseが返ってきて通信に失敗した場合はerror
    else setAddedStudents(updated); // 自分自身は除外して読み込む
    //ーーー↑自分が友達に設定しているuserの情報をフロントにセット↑ーーー
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SubHeader title="友達の追加・削除" onBack={() => router.back()} />
      <View style={{ flex: 1 }}>
        <TextInput
          style={styles.searchInput}
          placeholder="学籍番号を検索"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <StudentList
          studentIds={filteredStudents} // フィルタリングされた学籍番号リスト
          username={userName}
          alreadyAddedIds={addedStudents} // 追加された友達の学籍番号リスト
          onFriendToggle={handleFriendToggle} // 友達追加・削除の処理
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
});
