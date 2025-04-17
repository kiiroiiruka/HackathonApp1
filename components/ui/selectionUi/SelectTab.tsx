import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Props = {
  options: string[];
  selected: string;
  setSelected: (value: string) => void;
};

const SelectTab: React.FC<Props> = ({ options, selected, setSelected }) => {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isSelected = selected === option;
        return (
          <TouchableOpacity
            key={option}
            style={[
              styles.tab,
              isSelected && styles.activeTab,
              isSelected && styles.scaleUp,
            ]}
            onPress={() => setSelected(option)}
          >
            <Text style={isSelected ? styles.activeText : styles.tabText}>
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 12,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2ECC71', // 緑系
    backgroundColor: '#E8F5E9', // 薄い緑
    transform: [{ scale: 1 }],
  },
  activeTab: {
    backgroundColor: '#2ECC71', // 明るい緑
  },
  scaleUp: {
    transform: [{ scale: 1.07 }],
  },
  tabText: {
    color: '#2ECC71',
    fontSize: 14,
  },
  activeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SelectTab;
