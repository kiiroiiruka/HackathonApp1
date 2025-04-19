import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Image, Text, Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

export default function ImagePickerScreen({ navigation }: { navigation: any }) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // 設定ボタンの状態を管理


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
  
    data.append('upload_preset', 'YOUR_UPLOAD_PRESET'); // unsigned upload のプリセット名
    data.append('cloud_name', 'dy1ip2xgb'); // あなたの Cloudinary Cloud Name
  
    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dy1ip2xgb/image/upload', {
        method: 'POST',
        body: data,
      });
  
      const result = await res.json();
  
      if (result.secure_url) {
        Alert.alert('画像がアップロードされました！', `URL:\n${result.secure_url}`);
        // アップロード後にURLを使って他の処理をすることも可能
      } else {
        console.log(result);
        Alert.alert('アップロード失敗', 'Cloudinaryからエラーが返されました。');
      }
    } catch (error) {
      Alert.alert('エラー', '画像のアップロードに失敗しました。');
      console.error(error);
    }
  };
  

  const handleCancelImage = () => {
    setImageUri(null); // 画像を取り消す
    setIsButtonDisabled(true); // ボタンを無効化
  };

  return (
    <View style={styles.container}>
      <Button title="📁 画像を選択する" onPress={pickImage} />

      {imageUri ? (
        <>
          <Image source={{ uri: imageUri }} style={styles.preview} />

          {/* 画像アップロードボタン */}
          <TouchableOpacity
            style={[styles.saveButton, isButtonDisabled ? styles.saveButtonDisabled : null]}
            onPress={uploadImage}
            disabled={isButtonDisabled}
          >
            <Text style={styles.saveButtonText}>選択した写真をアップロードする</Text>
          </TouchableOpacity>

          {/* 画像取り消しボタン */}
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancelImage}>
            <Text style={styles.cancelButtonText}>選択した写真を取り消す</Text>
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
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#2196F3',
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