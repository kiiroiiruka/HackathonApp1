import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useMeInfoStore } from "@/store/meData";
import { meDataUpdateByStudentId } from "@/firebase/update/meDataUpdate"; //自分のデータの変更をバクエンド側に反映させる。
import { studentIdAtom } from "@/atom/studentIdAtom";
import { useAtom } from "jotai";
import SubHeader from "@/components/ui/header/SubScreenHeader";
import { errorFlagAtom } from "@/atom/flag/errorFlag";
import { updateFriendOnlySetting } from "@/firebase/update/friendReleasePreference";
import { mailAddressAtom } from "@/atom/mailAddressAtom";
import { getFriendOnlySetting } from "@/firebase/get/getFriendOnlySetting";
const SettingScreen: React.FC = () => {
  const router = useRouter();
  const { userInfo } = useMeInfoStore();
  const [location, setLocation] = useState(userInfo.location || "");
  const [freeUntil, setFreeUntil] = useState(userInfo.time || "");
  const [message, setMessage] = useState(userInfo.message || "");
  const [meDId, setMeId] = useAtom(studentIdAtom);
  const [, errorFlag] = useAtom(errorFlagAtom);
  const [mail] = useAtom(mailAddressAtom);
  const { updateLocation, updateTime, updateMessage } = useMeInfoStore();

  const [friendOnly, setFriendOnly] = useState<boolean>(true); // ← 初期値true
  const [loadingSetting, setLoadingSetting] = useState<boolean>(true); // ローディング中

  // 初期設定の読み込み
  useFocusEffect(
    useCallback(() => {
      const fetchFriendOnly = async () => {
        if (mail) {
          const setting = await getFriendOnlySetting(mail);
          if (setting !== null) {
            setFriendOnly(setting);
          }
          setLoadingSetting(false);
        }
      };

      fetchFriendOnly();
    }, [mail]), // mail に依存
  );

  const change = async () => {
    const flag = await meDataUpdateByStudentId(
      meDId,
      location,
      message,
      freeUntil,
    );

    if (flag === false) {
      errorFlag(false);
    } else {
      updateLocation(location);
      updateMessage(message);
      updateTime(freeUntil);
      Alert.alert("編集内容を保存しました");
    }
  };

  const toggleActiveStatus = () => {
    setFreeUntil(freeUntil === "活動中" ? "" : "活動中");
  };

  const handleFreeUntilChange = (newTime: string) => {
    setFreeUntil(newTime);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <SubHeader title="今の状態を登録しよう" onBack={() => router.back()} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text
            style={[
              styles.statusText,
              freeUntil === "活動中" ? styles.busyStatus : styles.freeStatus,
            ]}
          >
            {freeUntil === "活動中" ? "活動中です" : "暇です"}
          </Text>
          <Text style={{ margin: "auto", color: "red" }}>
            ※全て10文字以内で入力してください
          </Text>

          <TextInput
            style={styles.input}
            placeholder="今の場所（例: 渋谷）"
            value={location}
            onChangeText={(text) => setLocation(text)}
            maxLength={10}
            placeholderTextColor="#969696"
          />
          <TextInput
            style={styles.input}
            placeholder="一言メッセージ（例: カフェいきたい）"
            value={message}
            onChangeText={(text) => setMessage(text)}
            maxLength={10}
            placeholderTextColor="#969696"  
          />
          {freeUntil !== "活動中" && (
            <TextInput
              style={styles.input}
              placeholder="何時まで暇？（例: 18:00）"
              value={freeUntil}
              onChangeText={handleFreeUntilChange}
              maxLength={10}
              placeholderTextColor="#969696"
            />
          )}

          <TouchableOpacity
            style={[
              styles.roundButton,
              {
                backgroundColor:
                  freeUntil === "活動中" ? "#FF6347" : "rgb(49, 199, 149)",
              },
            ]}
            onPress={toggleActiveStatus}
            activeOpacity={0.8}
          >
            <Text style={styles.roundButtonText}>
              {freeUntil === "活動中" ? "活動中解除" : "活動中にする"}
            </Text>
          </TouchableOpacity>
          <Text style={{ margin: "auto", color: "red", textAlign: "center" }}>
            {
              "※活動中のステータスに設定すると、友達以外のユーザーには「学籍番号」と「ユーザーネーム」以外の情報が表示されなくなります。また、「チャットルームへ移動」ボタンも非表示になります。"
            }
          </Text>
          {/* 👇 追加: 公開設定の切替ボタン */}
          {!loadingSetting && (
            <View style={styles.toggleContainer}>
              {/* 「友達のみ」ボタン */}
              <TouchableOpacity
                onPress={async () => {
                  if (!friendOnly) {
                    const success = await updateFriendOnlySetting(mail, true); // ← friendOnlyをtrueに
                    if (success) setFriendOnly(true);
                  }
                }}
                style={[
                  styles.toggleButton,
                  friendOnly && styles.toggleButtonActive,
                ]} // friendOnlyがtrueのとき選択中の見た目
              >
                <Text
                  style={[
                    styles.toggleButtonText,
                    friendOnly && styles.toggleButtonTextActive,
                  ]}
                >
                  全体公開
                </Text>
              </TouchableOpacity>

              {/* 「全体公開」ボタン */}
              <TouchableOpacity
                onPress={async () => {
                  if (friendOnly) {
                    const success = await updateFriendOnlySetting(mail, false); // ← friendOnlyをfalseに
                    if (success) setFriendOnly(false);
                  }
                }}
                style={[
                  styles.toggleButton,
                  !friendOnly && styles.toggleButtonActive,
                ]} // friendOnlyがfalseのとき選択中の見た目
              >
                <Text
                  style={[
                    styles.toggleButtonText,
                    !friendOnly && styles.toggleButtonTextActive,
                  ]}
                >
                  友達のみ
                </Text>
              </TouchableOpacity>
            </View>
          )}

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
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    gap: 10, // React Native v0.71+ ならOK
  },

  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#E0E0E0",
    borderWidth: 1,
    borderColor: "#ccc",
  },

  toggleButtonActive: {
    backgroundColor: "red",
    borderColor: "red",
  },

  toggleButtonText: {
    color: "gray",
    fontWeight: "600",
    fontSize: 14,
  },

  toggleButtonTextActive: {
    color: "white",
  },
  roundButton: {
    width: 180,
    height: 180,
    borderRadius: 90, // 完全な円！
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center", // 中央配置
    marginVertical: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },

  roundButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    paddingHorizontal: 10,
  },
  saveButton: {
    backgroundColor: "#2196F3", // 鮮やかなブルー
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Android の影
    marginTop: 20,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#f2f2f2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },

  backButtonText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },
  container: {
    backgroundColor: "white",
    padding: 10,
  },
  backButton: {
    zIndex: 10,
    padding: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    height: 48,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "black",
  },
  statusText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
  },
  freeStatus: {
    color: "green",
  },
  busyStatus: {
    color: "red",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default SettingScreen;
