import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type HeaderProps = {
  title: string;
  onBack: () => void;
};

const SubHeader: React.FC<HeaderProps> = ({ title, onBack }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack}>
        <Text style={styles.backText}>← 戻る</Text>
      </TouchableOpacity>

      <View style={styles.titleWrapper}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={{ width: 60 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "rgb(197, 233, 255)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },
  titleWrapper: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});

export default SubHeader;
