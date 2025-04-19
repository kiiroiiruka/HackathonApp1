import { Stack, useRouter, useSegments  } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { errorFlagAtom } from '@/atom/flag/errorFlag';
import { useAtom } from 'jotai';
import { Platform, Alert } from 'react-native'; // Platform と Alert をインポート
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage インポート（スマホ用）

const Layout = () => {
  const [errorAction, setErrorAction] = useAtom(errorFlagAtom);
  const router = useRouter();
  const segments = useSegments(); // ← 現在のセグメント取得

  const getBackgroundColor = () => {
    const current = segments[segments.length - 1];
    if (current === '(main)') {
      return '#2196f3';
    }
    return 'white';
  };

  useEffect(() => {
    if (errorAction === false) {
      // エラーが検知されたときの処理

      // ローカルストレージをクリアする処理
      if (Platform.OS === 'web') {
        // Webの場合、localStorageをクリア
        localStorage.clear();
      } else {
        // スマホの場合、AsyncStorageをクリア
        AsyncStorage.clear();
      }

      // アラート表示
      if (Platform.OS === 'web') {
        // Webの場合、window.alertを使ってアラート表示
        window.alert('通信に失敗しました。ログイン画面に戻ります');
      } else {
        // スマホの場合、Alertを使ってアラート表示
        Alert.alert('通信に失敗しました', 'ログイン画面に戻ります');
      }

      // ログイン画面に遷移
      router.replace('/(login)'); 
      console.log("えらーじゃ");

      // フラグをリセットしておく（連続リダイレクト防止）
      setErrorAction(true);       
    }
  }, [errorAction]); // errorAction の変化を監視
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: getBackgroundColor() }}>
      <View style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(login)" options={{ headerShown: false }} />
          <Stack.Screen name="(main)" options={{ headerShown: false }} />
        </Stack>
      </View>
    </SafeAreaView>
  );
};

export default Layout;
