import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

type Props = {
  studentIds: string[];
  alreadyAddedIds: string[];
  onFriendToggle: (studentId: string, isAdded: boolean) => void;  // onFriendToggle の追加
};

const StudentList: React.FC<Props> = ({ studentIds, alreadyAddedIds, onFriendToggle }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handlePress = (id: string, isAdded: boolean) => {
    setSelectedId(id);
    onFriendToggle(id, isAdded);  // 追加/削除処理を親に通知
  };

  const renderItem = ({ item }: { item: string }) => {
    const isAdded = alreadyAddedIds.includes(item);

    return (
      <View style={styles.card}>
        <Text style={styles.studentId}>{item}</Text>
        <TouchableOpacity
          onPress={() => handlePress(item, isAdded)}  // ここで渡す値を修正
          disabled={isAdded}
          style={[styles.button, isAdded ? styles.addedButton : styles.addButton]}
        >
          <Text style={styles.buttonText}>
            {isAdded ? '追加済み' : '追加'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={studentIds}
        keyExtractor={(item) => item}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
      {selectedId && (
        <Text style={styles.selectedText}>押された番号：{selectedId}</Text>
      )}
    </View>
  );
};

export default StudentList;

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
  },
  list: {
    paddingVertical: 20,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  studentId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: '#4CAF50',
  },
  addedButton: {
    backgroundColor: '#aaa',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  selectedText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#444',
  },
});
