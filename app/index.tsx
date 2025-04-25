import { useEffect, useState } from "react";
import { Platform, View, Text, StyleSheet } from "react-native"; // これを使ってプラットフォームを判別
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { getStudentIdByEmail } from "@/firebase/get/studentNumberAcquisition";
import { studentIdAtom } from "@/atom/studentIdAtom";
import { useAtom } from "jotai";
import { fetchFriendsFromStudentIdArray } from "@/firebase/get/friendInfoAcquisition";
import { mailAddressAtom } from "@/atom/mailAddressAtom";
import { errorFlagAtom } from "@/atom/flag/errorFlag";
import { fetchUserInfoAndSetbyEmail } from "@/firebase/fetch/meDataset";
const AuthGate = () => {
  const router = useRouter();
  const [, setStudentId] = useAtom(studentIdAtom);
  const [, setMail] = useAtom(mailAddressAtom);
  const [, errorFlag] = useAtom(errorFlagAtom);

  const [loadingMessage, setLoadingMessage] = useState<string>("ようこそ!");
  useEffect(() => {
    const checkStoredCredentials = async () => {
      try {
        let storedEmail: string | null = null;
        let storedPassword: string | null = null;

        // 1秒待機してから処理を実行
        await new Promise((resolve) => setTimeout(resolve, 500)); // 0.5秒待機

        // Webの場合は localStorage、それ以外は AsyncStorage
        if (Platform.OS === "web") {
          // Web専用
          storedEmail = localStorage.getItem("email");
          storedPassword = localStorage.getItem("password");
        } else {
          // React Native（iOS/Android）
          storedEmail = await AsyncStorage.getItem("email");
          storedPassword = await AsyncStorage.getItem("password");
          console.log(
            "ローカルストレージ内に入っているメールアドレスは",
            storedEmail,
          );
          console.log(
            "ローカルstorage内に入っているパスワードは",
            storedPassword,
          );
        }

        if (storedEmail && storedPassword) {
          //ここでメールアドレスを引数的に受け取って、返り値でそのメールアドレスに対応する学籍番号を返す関数を起動

          //ーーー↓メールアドレスの情報を基に自分の学籍番号をフロントにセット↓ーーー
          const studentId = await getStudentIdByEmail(storedEmail);
          if (studentId === false)
            errorFlag(false); //通信エラー
          else setStudentId(studentId); //データのセット
          //ーーー↑メールアドレスの情報を基に自分の学籍番号をフロントにセット↑ーーー

          //ーーー↓自分が友達に設定しているuserの情報をフロントにセット↓ーーー
          const flag = await fetchFriendsFromStudentIdArray(storedEmail); //ここでFriendでつながっている友達の情報をフロントにセットさせる
          if (flag === false) errorFlag(false); //通信エラー
          //ーーー↑自分が友達に設定しているuserの情報をフロントにセット↑ーーー

          //ーーー↓自分の位置情報の設定情報をフロントにセット↓ーーー
          const flag2 = await fetchUserInfoAndSetbyEmail(storedEmail);
          if (flag2 === false) errorFlag(false); //通信エラー
          //ーーー↑自分の位置情報の設定情報をフロントにセット↑ーーー

          setMail(storedEmail); //メールアドレスフロントにセット
          console.log("取得した学籍番号:", studentId);
          // ホームへ遷移（履歴を置き換える）
          router.replace("./(main)"); // 修正: これが適切なパスの形式か確認
        } else {
          // ログインへ遷移
          router.replace("./(login)"); // 修正: 同様にログインパスも確認
        }
      } catch (error) {
        console.error("Storage check failed", error);
        router.replace("./(login)"); // 修正: ログインに遷移
      }
    };

    // ローディングメッセージを1.5秒表示
    const timeoutId = setTimeout(() => {
      setLoadingMessage("少々お待ちください...");
    }, 1500);

    checkStoredCredentials();

    // クリーンアップ
    return () => clearTimeout(timeoutId);
  }, []); // 空の依存配列

  return (
    <View style={styles.container}>
      <Text style={styles.loadingText}>{loadingMessage}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default AuthGate;
