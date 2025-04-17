import { Stack } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';

const Layout = () => {
  useEffect(() => {
    // ユーザーがログインしていないならスキップ
    if (!auth.currentUser) return;

    // Firestore のユーザードキュメントをリアルタイム監視
    const unsubscribe = onSnapshot(doc(db, 'users', auth.currentUser.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('ユーザーデータが更新されました:', data);
        // ここで context に入れたり、state を更新したりできる
      }
    });

    // クリーンアップ（アンマウント時に監視を解除）
    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
