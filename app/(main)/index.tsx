import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity,Image } from "react-native"
import StateInCurrentFriend from "@/components/ui/card/StateInCurrentFriend" // 友達の状態を表示するコンポーネント
import { useFriendUserStore } from "@/store/friendData"
import Header from "@/components/ui/header/Header"
import SelectTab from "@/components/ui/selectionUi/SelectTab"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons" // アイコン追加！
import { fetchFriendsFromStudentIdArray } from "@/firebase/get/friendInfoAcquisition"
import { useFocusEffect } from "expo-router" //expo-routerを活用している場合はこっちをimportすればOK
import { useCallback } from "react"
import { useAtom } from "jotai"
import { useMeInfoStore } from "@/store/meData"
import { mailAddressAtom } from "@/atom/mailAddressAtom"
import { ActivityIndicator } from "react-native"
import { errorFlagAtom } from "@/atom/flag/errorFlag"
import * as Location from "expo-location" // expo-locationをインポート
import { updateLocation } from "@/firebase/fetch/fetchLocation" // 位置情報をFirebaseに送信する関数をインポート
import { myLocationAtom } from "@/atom/locationAtom" // 位置情報を管理するatomをインポート
import { canAccessUserData } from "@/firebase/get/friendFiltering" // アクセス許可情報の取得
import { getProfileImageUriByStudentId } from "@/firebase/get/getProfileImageUriByStudentId" // アイコンの取得
import { studentIdAtom } from "@/atom/studentIdAtom"
const MainScreen: React.FC = () => {
  const users = useFriendUserStore((state) => state.users)
  const userInfo = useMeInfoStore((state) => state.userInfo)
  const [selectedTab, setSelectedTab] = useState<string>("友達")
  const [myLocation, setmyLocation] = useAtom(myLocationAtom)
  const [myStudentId] = useAtom(studentIdAtom)
  const [mail] = useAtom(mailAddressAtom)
  const [loading, setLoading] = useState(false)
  const [, errorFlag] = useAtom(errorFlagAtom)
  const router = useRouter()
  const [userData, setUserData] = useState<any[]>([]) // ユーザー情報を保存する状態
  const [errorMsg, setErrorMsg] = useState<string | null>(null) // エラーメッセージの状態管理

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== "granted") {
      setErrorMsg("位置情報のアクセスが許可されていません")
      return
    }
    const currentLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest })
    const cor = currentLocation.coords
    setmyLocation({ accuracy: cor.accuracy ?? 0, latitude: cor.latitude, longitude: cor.longitude })
    updateLocation(userInfo.key, currentLocation)
  }

  const fetchData = async () => {
    // 位置情報の更新

    setUserData([]) // ←これ追加して「過去のデータをクリア」しておく！
    if (mail) {
      const flag = await fetchFriendsFromStudentIdArray(mail) // GPSとアイコン以外の情報を取得して更新
      if (flag === false) errorFlag(false)
    }
    setLoading(true) // ローディング開始

    await getLocation() // GPS情報を新しい情報に更新させる
    // ユーザー情報の更新（アイコンとアクセス許可の情報を再取得）
    const updatedUserData = await Promise.all(
      users.map(async (user) => {
        const access = await canAccessUserData(myStudentId, user.uid) // アクセス許可の確認
        const profileImageUri = await getProfileImageUriByStudentId(user.uid) // プロフィール画像URIの取得

        return {
          ...user,
          access,
          profileImageUri, // アイコン情報を追加
        }
      }),
    )

    // 更新されたユーザーデータを状態に保存
    setUserData(updatedUserData)
    setTimeout(() => setLoading(false), 1000) // 1秒後にローディング終了
  }

  useFocusEffect(
    useCallback(() => {
      fetchData()
    }, [mail, myStudentId]), // usersも依存関係に含める
  )

  return (
    <SafeAreaView style={styles.container}>
      <Header title="暇レーダー">
        <View style={{ margin: "auto", flexDirection: "row" }}>
          {/* 🔽 選択肢を SelectTab に渡す */}
          <SelectTab options={["友達", "暇な奴だけ"]} selected={selectedTab} setSelected={setSelectedTab} />
          <TouchableOpacity
            onPress={async () => fetchData()}
            disabled={loading}
            style={[styles.reloadButton, loading && styles.reloadButtonDisabled]} // ロード中なら薄く
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
        data={selectedTab === "暇な奴だけ" ? userData.filter((u) => !u.time.includes("活動中")) : userData}
        extraData={loading}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <StateInCurrentFriend
            username={item.username}
            location={item.location}
            message={item.message}
            time={item.time}
            studentId={item.uid}
            imageUri={item.profileImageUri} // アイコン情報を渡す
            canView={item.access} // アクセス許可情報を渡す
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>条件に当てはまるユーザーが存在しません</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />

      {/* フッターボタン配置 */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.settingsButtonSmall} onPress={() => router.push("./(setting)")}>
          <Image 
            source={require("../../assets/images/setting.png")} 
            style={{ width: 20, height: 20 }} // ここを数値で指定
          />
          <Text style={styles.settingsButtonTextSmall}>暇情報設定</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsButtonSmall} onPress={() => router.push("./(openchat)")}>
        <Image 
            source={require("../../assets/images/open.png")} 
            style={{ width: 20, height: 20 }} // ここを数値で指定
          />
          <Text style={styles.settingsButtonTextSmall}>オプチャ</Text>
        </TouchableOpacity >
        <TouchableOpacity style={styles.settingsButtonSmall} onPress={() => router.push("./(addFriend)")}>
        <Image 
            source={require("../../assets/images/add.png")} 
            style={{ width: 20, height: 20 }} // ここを数値で指定
          />
          <Text style={styles.settingsButtonTextSmall}>友達追加</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsButtonSmall} onPress={() => router.push("./(map)")}>
        <Image 
            source={require("../../assets/images/map.png")} 
            style={{ width: 20, height: 20 }} // ここを数値で指定
          />
          <Text style={styles.settingsButtonTextSmall}>マップ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
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
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  settingsButtonSmall: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    flex: 1,
    marginHorizontal: 2,
    justifyContent: "center",
  },

  settingsButtonTextSmall: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 12,
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
})

export default MainScreen
