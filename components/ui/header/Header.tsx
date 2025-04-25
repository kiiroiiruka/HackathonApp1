import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAtom } from "jotai";
import { errorFlagAtom } from "@/atom/flag/errorFlag";
import { Ionicons } from "@expo/vector-icons";
type HeaderProps = {
  title?: string;
  children?: React.ReactNode;
};

const Header: React.FC<HeaderProps> = ({ title = "", children }) => {
  const router = useRouter();
  const [, errorFlag] = useAtom(errorFlagAtom);
  const handleLogout = async () => {
    try {
      if (Platform.OS === "web") {
        localStorage.removeItem("email");
        localStorage.removeItem("password");
      } else {
        await AsyncStorage.removeItem("email");
        await AsyncStorage.removeItem("password");
      }
      router.push("./(login)");
      location.reload();
    } catch (error) {
      errorFlag(false); //error
    }
  };

  const handleProfileSettings = () => {
    router.push("./(meInfoChange)"); // プロフィール画面に遷移（適宜変更してね）
  };
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>ログアウト</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleProfileSettings}
        style={styles.profileButton}
      >
        <Ionicons
          name="person-circle-outline"
          size={20}
          color="rgb(222, 255, 179)"
          style={{ marginRight: 3 }}
        />
        <Text style={styles.profileButtonText}>個人情報</Text>
      </TouchableOpacity>

      {title && <Text style={styles.headerText}>{title}</Text>}

      {children && <View style={styles.childrenRow}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  profileButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "gray", // 半透明の白でちょっとオシャレに
    paddingHorizontal: 5,
    padding: 3,
    marginTop: -3,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  profileButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  childrenRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingTop: 16,
  },
  headerContainer: {
    backgroundColor: "#2196f3",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    position: "relative",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  childrenContainer: {
    marginTop: 8,
  },
  logoutButton: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#ff5252",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    zIndex: 10,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default Header;
