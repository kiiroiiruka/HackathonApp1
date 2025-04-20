import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';
import { studentIdAtom } from '@/atom/studentIdAtom';
import { useAtom } from 'jotai';
import { createChat, getChats } from '@/firebase/firebaseFunction';

type Message = {
  id: string;
  createdBy: string; // 送信者のID（学籍番号）
  text: string;
  createdAt: number; // ミリ秒のUNIX時間
};

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [meId, setMeId] = useAtom(studentIdAtom);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // 送信完了メッセージ用

  // 初期レンダリング時にオープンチャットのデータを取得
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const chats = await getChats.getChats(null); // オープンチャットのデータを取得
        if (chats) {
          // データを配列形式に変換してセット
          const chatArray = Object.values(chats) as Message[];
          setMessages(chatArray);
        }
      } catch (error) {
        console.error('チャットデータの取得中にエラーが発生しました:', error);
      }
    };

    fetchChats();
  }, []);

  const sendMessage = async () => {
    const newMessage = {
      id: Date.now().toString(),
      createdBy: meId, // 学籍番号をsenderIdにセット
      text: input,
      createdAt: Date.now(),
    };

    setMessages([...messages, newMessage]);
    setInput('');

    try {
      await createChat.createChat(input, meId); // データを送信
      setSuccessMessage('データを送信しました'); // 成功メッセージをセット

      // 3秒後にメッセージを非表示にする
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('データ送信エラー:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={styles.message}>
            {item.createdBy}: {item.text}
          </Text>
        )}
      />
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder="メッセージを入力"
      />
      <Button title="送信" onPress={sendMessage} />

      {/* 送信完了メッセージ */}
      {successMessage && <Text style={styles.successMessage}>{successMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  message: { padding: 10, backgroundColor: '#f1f1f1', marginVertical: 5 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 },
  successMessage: {
    marginTop: 10,
    textAlign: 'center',
    color: 'green',
    fontSize: 16,
  },
});

export default ChatScreen;