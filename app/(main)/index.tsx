import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

import StateInCurrentFriend from '@/components/ui/card/StateInCurrentFriend';
import { useFriendUserStore } from '@/store/friendData';
import Header from '@/components/ui/header/Header';
import SelectTab from '@/components/ui/selectionUi/SelectTab';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // ← アイコン追加！

const MainScreen: React.FC = () => {
  const users = useFriendUserStore((state) => state.users);
  const router=useRouter()
  // 🔽 ここで選択状態を管理（デフォルトは「友達」）
  const [selectedTab, setSelectedTab] = useState<string>('友達');

  return (
    <SafeAreaView style={styles.container}>
      <Header title="暇やつ探そうぜ？">
      <View style={{margin:"auto",flexDirection:"row"}}>
        {/* 🔽 選択肢を SelectTab に渡す */}

          <SelectTab
            options={['友達', '暇な奴だけ']}
            selected={selectedTab}
            setSelected={setSelectedTab}
          />
          <TouchableOpacity
            style={styles.settingsButtonSmall}
            onPress={() => router.push('./(setting)')}
          >
            <Ionicons name="settings-outline" size={16} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.settingsButtonTextSmall}>位置情報設定</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingsButtonSmall}
            onPress={() => router.push('./(addFriend)')}
          >
            <Ionicons name="settings-outline" size={16} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.settingsButtonTextSmall}>友達追加</Text>
          </TouchableOpacity>
        </View>
      </Header>

{/* 🔽 選択状態に応じて表示を切り替えることもできる（任意） */}
      <FlatList
        data={
          selectedTab === '暇な奴だけ'
            ? users.filter((u) => !u.time.includes('活動中'))
            : users
        }
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <StateInCurrentFriend
            username={item.username}
            location={item.location}
            message={item.message}
            time={item.time}
            studentId={item.uid}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  settingsButtonSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    marginVertical: 12,
  },
  
  settingsButtonTextSmall: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatButton: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default MainScreen;
