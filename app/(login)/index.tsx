import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router"; // expo-routerを使って遷移
import AsyncStorage from "@react-native-async-storage/async-storage"; // ローカルストレージを使う
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig"; // ← あなたのパスに合わせてね
import { getStudentIdByEmail } from "@/firebase/get/studentNumberAcquisition";
import { studentIdAtom } from "@/atom/studentIdAtom";
import { useAtom } from "jotai";
import { fetchFriendsFromStudentIdArray } from "@/firebase/get/friendInfoAcquisition";
import { fetchUserInfoAndSetbyEmail } from "@/firebase/fetch/meDataset";
import { errorFlagAtom } from "@/atom/flag/errorFlag";
import { StatusBar } from "expo-status-bar"
const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // エラーメッセージの状態
  const [id, setId] = useAtom(studentIdAtom);
  const [, errorFlag] = useAtom(errorFlagAtom);
  const router = useRouter(); // ページ遷移をするためにrouterを使う

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("メールアドレス\nまたはパスワードに間違いがあります");
      return;
    }

    try {
      // Firebase Auth でログイン処理

      //ーーー↓自分が友達に設定しているuserの情報をフロントにセット↓ーーー
      const flag = await fetchFriendsFromStudentIdArray(email); //自分以外の人のデータをセットする。
      if (flag === false) errorFlag(false); //通信エラー
      //ーーー↑自分が友達に設定しているuserの情報をフロントにセット↑ーーー

      await signInWithEmailAndPassword(auth, email, password);

      //ーーー↓メールアドレスの情報を基に自分の学籍番号をフロントにセット↓ーーー
      const studentId = await getStudentIdByEmail(email);
      if (studentId === false)
        errorFlag(false); //通信エラー
      else setId(studentId);
      //ーーー↑メールアドレスの情報を基に自分の学籍番号をフロントにセット↑ーーー

      //ーーー↓メールアドレスを基に自分の情報をフロントにセット↓ーーー
      const flag2 = await fetchUserInfoAndSetbyEmail(email); //自分のデータをフロントにセットする。
      if (flag2 === false) errorFlag(false); //通信エラー
      //ーーー↑メールアドレスを基に自分の情報をフロントにセット↑ーーー

      // ログイン成功時の処理（保存する？確認アラート）
      if (Platform.OS === "web") {
        // Web環境の場合
        const message =
          "ログインに成功しました! ログイン情報を保存しますか？次回以降ログイン情報を入力せずに利用できます※回線に不具合がある、もしくはログアウトした場合などは再度入力が必要になります";
        const result = window.confirm(message);

        if (result) {
          // ユーザーがOKを選択した場合、ローカルストレージに保存
          localStorage.setItem("email", email);
          localStorage.setItem("password", password);
        }
        // メイン画面に遷移
        router.replace("/(main)");
      } else {
        // スマホ環境の場合
        Alert.alert(
          "ログインに成功しました!",
          "ログイン情報を保存しますか？次回以降ログイン情報を入力せずに利用できます※回線に不具合がある、もしくはログアウトした場合などは再度入力が必要になります",
          [
            { text: "NO", onPress: () => router.replace("/(main)") },
            {
              text: "OK",
              onPress: async () => {
                // ユーザーがOKを選択した場合、AsyncStorageに保存
                await AsyncStorage.setItem("email", email);
                await AsyncStorage.setItem("password", password);
                router.replace("/(main)");
              },
            },
          ],
          { cancelable: false }, // ユーザーがアラート外をタップしても閉じられないようにする
        );
      }
    } catch (error: any) {
      console.error("ログイン失敗:", error);
      setErrorMessage("メールアドレスまたはパスワードが正しくありません。"); // エラーメッセージを表示
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.title}>ログイン</Text>
      <TextInput
        style={styles.input}
        placeholder="メールアドレス"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        placeholderTextColor="#969696"
      />
      <TextInput
        style={styles.input}
        placeholder="パスワード"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#969696"
      />

      {/* エラーメッセージを赤色で表示 */}
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>ログイン</Text>
      </TouchableOpacity>

      <View style={styles.signUpContainer}>
        <Text style={styles.text}>初めての方はこちら:</Text>
        <TouchableOpacity onPress={() => router.push("./signUp")}>
          <Text style={styles.signUpText}>サインアップ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
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
    color:"brack"
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  text: {
    fontSize: 16,
    marginRight: 5,
  },
  signUpText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },
  errorText: {
    color: "red", // 赤色でエラーメッセージを表示
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
});

export default LoginScreen;
