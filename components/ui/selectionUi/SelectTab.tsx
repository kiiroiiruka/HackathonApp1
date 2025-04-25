import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";

type Props = {
  options: string[];
  selected: string;
  setSelected: (value: string) => void;
};

const SelectTab: React.FC<Props> = ({ options, selected, setSelected }) => {
  const animatedValues = useRef(
    options.map(() => new Animated.Value(0)),
  ).current;

  useEffect(() => {
    const selectedIndex = options.indexOf(selected);

    animatedValues.forEach((val, index) => {
      Animated.timing(val, {
        toValue: index === selectedIndex ? 1 : 0,
        duration: 250,
        useNativeDriver: false,
      }).start();
    });
  }, [selected]);

  return (
    <View style={styles.container}>
      {options.map((option, index) => {
        const isFirst = index === 0;
        const isLast = index === options.length - 1;

        const bgColor = animatedValues[index].interpolate({
          inputRange: [0, 1],
          outputRange: ["#E8F5E9", "#2ECC71"],
        });

        const textColor = animatedValues[index].interpolate({
          inputRange: [0, 1],
          outputRange: ["#2ECC71", "#fff"],
        });

        const scale = animatedValues[index].interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.05],
        });

        // borderWidth のアニメーション
        const borderWidth = animatedValues[index].interpolate({
          inputRange: [0, 1],
          outputRange: [2, 2.5], // スケールに合わせて少し太く補正
        });

        return (
          <TouchableOpacity
            key={option}
            onPress={() => setSelected(option)}
            activeOpacity={0.8}
          >
            <Animated.View
              style={[
                styles.tab,
                isFirst && styles.firstTab,
                isLast && styles.lastTab,
                {
                  backgroundColor: bgColor,
                  transform: [{ scale }],
                  alignSelf: "center",
                  borderWidth: borderWidth, // borderWidth のアニメーションを追加
                },
              ]}
            >
              <Animated.Text
                style={[
                  styles.tabText,
                  {
                    color: textColor,
                    fontWeight: selected === option ? "bold" : "normal",
                  },
                ]}
              >
                {option}
              </Animated.Text>
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    overflow: "hidden",
    marginHorizontal: 16,
    marginBottom: 8,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 4,
  },
  firstTab: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  lastTab: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  tabText: {
    fontSize: 12,
    textAlign: "center",
  },
});

export default SelectTab;
