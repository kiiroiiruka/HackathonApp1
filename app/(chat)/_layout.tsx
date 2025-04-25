// app/_layout.tsx
import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* この設定で全ページのヘッダーを非表示にする */}
    </Stack>
  );
};

export default Layout;
