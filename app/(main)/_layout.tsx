import { Stack } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

const Layout = () => {
  return (
    <View style={{ flex: 1 }}>
      {/* Stackでラップしているのでページ遷移はここから行います */}
      <Stack>
        {/* 他のページへのリンクが必要なら、Stack.Screenで定義できます */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(setting)" options={{ headerShown: false }} />
        <Stack.Screen name="(addFriend)" options={{ headerShown: false }} />
        <Stack.Screen name="(meInfoChange)" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
};

export default Layout;
