import { Stack } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const Layout = () => {
  return (
    <SafeAreaView style={{flex:1}}>
        <View style={{ flex: 1 }}>
        <Stack>
            {/* Stackでラップしているのでページ遷移はここから行います */}
            <Stack.Screen name="index" options={{ headerShown: false }} />

        </Stack>
        </View>
    </SafeAreaView>
  );
};

export default Layout;