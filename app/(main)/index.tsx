import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

import StateInCurrentFriend from "@/components/ui/card/StateInCurrentFriend";
import { useFriendUserStore } from "@/store/friendData";
import Header from "@/components/ui/header/Header";
import SelectTab from "@/components/ui/selectionUi/SelectTab";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // ← アイコン追加！
import { fetchFriendsFromStudentIdArray } from "@/firebase/get/friendInfoAcquisition";
import { useFocusEffect } from "expo-router"; //expo-routerを活用している場合はこっちをimportすればOK
import { useCallback } from "react";
import { useAtom } from "jotai";
import { useMeInfoStore } from "@/store/meData";
import { mailAddressAtom } from "@/atom/mailAddressAtom";
import { ActivityIndicator } from "react-native";
import { errorFlagAtom } from "@/atom/flag/errorFlag";
import * as Location from "expo-location"; // expo-locationをインポート
import { updateLocation } from "@/firebase/fetch/fetchLocation"; // 位置情報をFirebaseに送信する関数をインポート
import { myLocationAtom } from "@/atom/locationAtom"; // 位置情報を管理するatomをインポート
const MainScreen: React.FC = () => {
  const users = useFriendUserStore((state) => state.users);
  const userInfo = useMeInfoStore((state) => state.userInfo);
  // 🔽 ここで選択状態を管理（デフォルトは「友達」）
  const [selectedTab, setSelectedTab] = useState<string>("友達");
  const [myLocation, setmyLocation] = useAtom(myLocationAtom);
  const [mail] = useAtom(mailAddressAtom);
  const [loading, setLoading] = useState(false);
  const [, errorFlag] = useAtom(errorFlagAtom);
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // エラーメッセージの状態管理

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        if (mail) {
          const flag = await fetchFriendsFromStudentIdArray(mail);
          if (flag === false) errorFlag(false);
        }

        // 位置情報の取得
        const getLocation = async () => {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== "granted") {
            setErrorMsg("位置情報のアクセスが許可されていません");
            return;
          }
          const currentLocation = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest});
          console.log("gpsのねで",currentLocation.coords);
          const cor=currentLocation.coords
          setmyLocation({accuracy:cor.accuracy ??0,latitude:cor.latitude,longitude:cor.longitude});
          updateLocation(userInfo.key,currentLocation);
        };

        await getLocation(); // 位置情報取得関数を呼び出し
      };
      fetchData(); // 非同期関数を即時呼び出し
      return () => {
        // クリーンアップ処理があればここに書く
      };
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="暇レーダー">
        <View style={{ margin: "auto", flexDirection: "row" }}>
          {/* 🔽 選択肢を SelectTab に渡す */}

          <SelectTab
            options={["友達", "暇な奴だけ"]}
            selected={selectedTab}
            setSelected={setSelectedTab}
          />
          <TouchableOpacity
            onPress={async () => {
              setLoading(true); // ローディング開始

              //ーーー↓自分が友達に設定しているuserの情報をフロントにセット↓ーーー
              const flag = await fetchFriendsFromStudentIdArray(mail); // データ取得
              if (flag === false) errorFlag(false); //通信エラー
              console.log(users);
              //ーーー↑自分が友達に設定しているuserの情報をフロントにセット↑ーーー
              setTimeout(() => setLoading(false), 1000); // 1秒後に解除
            }}
            disabled={loading}
            style={[
              styles.reloadButton,
              loading && styles.reloadButtonDisabled, // ロード中なら薄く
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#888" size="small" />
            ) : (
              <Text style={styles.reloadText}>リロードする</Text>
            )}
          </TouchableOpacity>
        </View>
      </Header>
      {/* 🔽 選択状態に応じて表示を切り替えることもできる（任意） */}
      <FlatList
        data={
          selectedTab === "暇な奴だけ"
            ? users.filter((u) => !u.time.includes("活動中"))
            : users
        }
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <StateInCurrentFriend
            username={item.username}
            location={item.location}
            message={item.message}
            time={item.time}
            studentId={item.uid}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              条件に当てはまるユーザーが存在しません
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />

      {/*}
      <View style={{ padding: 5 }}>
        {errorMsg ? (
          <Text style={{ color: "red" }}>{errorMsg}</Text>
        ) : location ? (
          <Text>
            現在地: 緯度 {myLocation.latitude}, 経度 {myLocation.longitude}
          </Text>
        ) : (
          <Text>位置情報を取得中...</Text>
        )}
      </View>
      */}
      {/* 🔽 フッターボタン配置 */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.settingsButtonSmall}
          onPress={() => router.push("./(setting)")}
        >
          <Ionicons
            name="settings-outline"
            size={16}
            color="#fff"
            style={{ marginRight: 6 }}
          />
          <Text style={styles.settingsButtonTextSmall}>暇情報設定</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsButtonSmall}
          onPress={() => router.push("./(openchat)")}
        >
          <Ionicons
            name="chatbubble-outline"
            size={16}
            color="#fff"
            style={{ marginRight: 6 }}
          />
          <Text style={styles.settingsButtonTextSmall}>全体チャット</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsButtonSmall}
          onPress={() => router.push("./(addFriend)")}
        >
          <Ionicons
            name="person-add-outline"
            size={16}
            color="#fff"
            style={{ marginRight: 6 }}
          />
          <Text style={styles.settingsButtonTextSmall}>友達追加</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
  },
  reloadButton: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginLeft: 10,
    marginBottom: 10,
  },
  reloadButtonDisabled: {
    opacity: 0.5,
  },
  reloadText: {
    fontSize: 14,
    color: "#333",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  settingsButtonSmall: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 6,

    paddingHorizontal: 12,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },

  settingsButtonTextSmall: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 14,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  chatButton: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
    alignItems: "center",
  },
  chatButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default MainScreen;
