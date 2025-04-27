import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import SubHeader from "@/components/ui/header/SubScreenHeader";
import { mailAddressAtom } from "@/atom/mailAddressAtom";
import { useAtom } from "jotai";
import { updateProfileImageAndPublicIdByEmail } from "@/firebase/update/imageSet";
import * as ImagePicker from "expo-image-picker";

export default function ImagePickerScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // 設定ボタンの状態を管理
  const [mail] = useAtom(mailAddressAtom);
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null); // Web 専用

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("写真へのアクセス権が必要です");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    if (Platform.OS === "web") {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.onchange = (event) => {
        const target = event.target as HTMLInputElement;
        if (target && target.files && target.files[0]) {
          const file = target.files[0];
          const uri = URL.createObjectURL(file);
          setImageUri(uri);
          setImageFile(file); // Web用に file を state に保持
          setIsButtonDisabled(false);
        }
      };
      fileInput.click();
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        setIsButtonDisabled(false);
      }
    }
  };

  const handleSave = async () => {
    if (!imageUri) return;

    if (Platform.OS === "web") {
      if (imageFile) {
        await uploadImage(imageFile); // Web では file を直接渡す
      }
    } else {
      await uploadImage({ uri: imageUri });
    }
  };
  const uploadImage = async (file: File | { uri: string }) => {
    if (!file) return;

    const data = new FormData();

    let uri = "";
    let name = "";
    let type = "";

    // Webでアップロード時、fileオブジェクトを利用
    if (Platform.OS === "web" && file instanceof File) {
      name = file.name;
      type = file.type;
      data.append("file", file); // Webの場合はFileオブジェクトをそのままFormDataに追加
    } else if (file instanceof Object && "uri" in file) {
      uri = file.uri;
      name = uri.split("/").pop() ?? "defaultName";
      type = `image/${name.split(".").pop()}`;
      data.append("file", {
        uri,
        name,
        type,
      } as any);
    }

    data.append("upload_preset", "TeatImages");
    data.append("cloud_name", "dy1ip2xgb");
    data.append("public_id", `media/pictures/${name}`);

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dy1ip2xgb/image/upload",
        {
          method: "POST",
          body: data,
        },
      );

      const result = await res.json();
      console.log("取得したURI", result);
      const publicId = `media/pictures/${name}`;

      // 成功した場合
      if (result.secure_url) {
        console.log("アップロード成功");
        await updateProfileImageAndPublicIdByEmail(
          mail,
          String(result.secure_url),
          publicId,
        ); // Firestoreに画像URLを保存
        if (Platform.OS !== "web") {
          // Web以外でのみアラートを表示
          Alert.alert(
            "画像がアップロードされました！",
            `URL:\n${result.secure_url}`,
          );
        }
      } else {
        // secure_url が返されなかった場合にのみエラー処理
        console.log("アップロード失敗:", result);
        if (Platform.OS !== "web") {
          // Web以外でのみアラートを表示
          Alert.alert(
            "アップロード失敗",
            "Cloudinaryからエラーが返されました。",
          );
        }
      }
    } catch (error) {
      // エラーハンドリング
      console.error("アップロード中にエラーが発生:", error);
      if (Platform.OS !== "web") {
        // Web以外でのみアラートを表示
        Alert.alert("エラー", "画像のアップロードに失敗しました。");
      }
    }
  };

  return (
    <View style={styles.container}>
      <SubHeader title="アイコン画像の変更" onBack={() => router.back()} />

      {imageUri ? (
        <>
          <Image source={{ uri: imageUri }} style={styles.preview} />
          <TouchableOpacity
            style={[
              styles.saveButton,
              isButtonDisabled ? styles.saveButtonDisabled : null,
            ]}
            onPress={handleSave}
            disabled={isButtonDisabled}
          >
            <Text style={styles.saveButtonText}>
              アイコンの変更内容を保存する
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.infoText}>画像がまだ選ばれていません。</Text>
      )}

      <TouchableOpacity onPress={pickImage} style={styles.button}>
        <Text style={styles.buttonText}>アイコンにしたい画像を選択する</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "gray",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: "10%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  container: {
    flex: 1,
  },
  preview: {
    width: 300,
    height: 300,
    marginTop: 20,
    borderRadius: 150,
    borderWidth: 3,
    borderColor: "#2196F3",
    overflow: "hidden",
    margin: "auto",
  },
  infoText: {
    marginTop: 20,
    fontSize: 16,
    color: "#555",
    margin: "auto",
  },
  saveButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: "#2196F3",
    borderRadius: 30,
    margin: "auto",
  },
  saveButtonDisabled: {
    backgroundColor: "#B0BEC5",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
