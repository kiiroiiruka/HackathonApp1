import React from 'react';
import { SafeAreaView, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import StudentList from '@/components/ui/card/AddFriendList';
import { useRouter } from 'expo-router';

export default function App() {
  const router = useRouter();

  const allStudents = ['A123456', 'A123457', 'A123458', 'A123459'];
  const addedStudents = ['A123457'];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* 上部バー + 戻るボタン */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← 戻る</Text>
        </TouchableOpacity>
      </View>

      {/* 本体部分 */}
      <View style={{ flex: 1 }}>
        <StudentList studentIds={allStudents} alreadyAddedIds={addedStudents} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 10,
    paddingLeft: 16,
    paddingBottom: 10,
    backgroundColor: '#f2f2f2',
  },
  backText: {
    fontSize: 16,
    color: '#007AFF',
  },
});
