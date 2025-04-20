import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Image, Text, Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import SubHeader from '@/components/ui/header/SubScreenHeader';
import { mailAddressAtom } from '@/atom/mailAddressAtom';
import { useAtom } from 'jotai';
import { updateProfileImageUriByEmail } from '@/firebase/update/imageSet';
export default function ImagePickerScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // 設定ボタンの状態を管理
  const [mail,]=useAtom(mailAddressAtom)
  const router=useRouter()
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('写真へのアクセス権が必要です');
      }
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri); // 画像のURIを設定
      setIsButtonDisabled(false); // 画像が選ばれたらボタンを有効にする
    }
  };

  const uploadImage = async () => {
    if (!imageUri) return;
  
    const data = new FormData();
  
    // Cloudinary に画像を送るためのデータを整える
    const fileName = imageUri.split('/').pop();
    const fileType = fileName?.split('.').pop();
  
    data.append('file', {
      uri: imageUri,
      name: fileName,
      type: `image/${fileType}`,
    } as any);
  
    // Cloudinaryのアップロード設定
    data.append('upload_preset', 'TeatImages'); // unsigned upload のプリセット名
    data.append('cloud_name', 'dy1ip2xgb'); // あなたの Cloudinary Cloud Name
  
    // 画像を "media/pictures" フォルダにアップロード
    data.append('public_id', 'media/pictures/' + fileName); // public_idにターゲットフォルダを指定
  
    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dy1ip2xgb/image/upload', {
        method: 'POST',
        body: data,
      });
  
      const result = await res.json();
      console.log("取得したURI",result)
      // ここでsecure_urlを使って画像URLを更新
      if (result.secure_url) {
        await updateProfileImageUriByEmail(mail,String(result.secure_url)); // 画像URLをFirestoreに保存
        Alert.alert('画像がアップロードされました！', `URL:\n${result.secure_url}`);
      } else {
        console.log(result);
        Alert.alert('アップロード失敗', 'Cloudinaryからエラーが返されました。');
      }
    } catch (error) {
      Alert.alert('エラー', '画像のアップロードに失敗しました。');
      console.error(error);
    }
  };

  return (
      <View style={styles.container}>
        <SubHeader title="アイコン画像の変更" onBack={() => router.back()} />
    
        <Button title="📁 画像を選択する" onPress={pickImage} />
    
        {imageUri ? (
          <>
            <Image source={{ uri: imageUri }} style={styles.preview} />
    
            <TouchableOpacity
              style={[styles.saveButton, isButtonDisabled ? styles.saveButtonDisabled : null]}
              onPress={uploadImage}
              disabled={isButtonDisabled}
            >
              <Text style={styles.saveButtonText}>アイコンを決定</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.infoText}>画像がまだ選ばれていません。</Text>
        )}
      </View>
    );
}

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  preview: {
    width: 300,
    height: 300,
    marginTop: 20,
    borderRadius: 150, // ← ここを追加
    borderWidth: 3,
    borderColor: '#2196F3',
    overflow: 'hidden', // 念のため追加（Androidでも切り抜きが効くように）
  },
  infoText: {
    marginTop: 20,
    fontSize: 16,
    color: '#555',
  },
  cancelButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#FF6F61',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#2196F3',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },
  saveButtonDisabled: {
    backgroundColor: '#B0BEC5',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
