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

const MainScreen: React.FC = () => {
  const users = useFriendUserStore((state) => state.users);
  const router=useRouter()
  // 🔽 ここで選択状態を管理（デフォルトは「友達」）
  const [selectedTab, setSelectedTab] = useState<string>('友達');

  return (
    <SafeAreaView style={styles.container}>
      <Header title="暇やつ探そうぜ？">
        <View style={{ flex: 1 }}>
          {/* 自分の情報設定ボタン */}
          <TouchableOpacity
            style={{ marginVertical: 'auto', marginLeft: 'auto' }}
            onPress={() => router.push('./(setting)')}
          >
            <Text>{'自分の情報設定'}</Text>
          </TouchableOpacity>

          {/* チャット画面への遷移ボタン */}
          <TouchableOpacity
            style={styles.chatButton}
            onPress={() => router.push('./(chat)')}
          >
            <Text style={styles.chatButtonText}>{'チャットへ移動'}</Text>
          </TouchableOpacity>

          <SelectTab
            options={['友達', '暇な奴だけ']}
            selected={selectedTab}
            setSelected={setSelectedTab}
          />
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
