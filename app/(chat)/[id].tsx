import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getChats } from '@/firebase/get/getChats'; // チャットルームの取得関数をインポート
import { createChat } from '@/firebase/add/createChat'; // メッセージ送信関数をインポート
import { useMeInfoStore } from '@/store/meData'; // Zustandのストアをインポート

type Message = {
  id: string;
  createdBy: string;
  text: string;
  timestamp: number;
};

const ChatRoom = () => {
  const { id } = useLocalSearchParams(); // 動的ルートからチャットルームIDを取得
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  // Zustandからユーザー情報を取得
  const userInfo = useMeInfoStore((state) => state.userInfo);

  useEffect(() => {
    const fetchChatMessages = async () => {
      if (!id) {
        console.error('チャットルームIDが見つかりません。');
        return;
      }

      try {
        // チャットルームのメッセージを取得
        const chatMessages = await getChats(id as string);
        if (chatMessages) {
          const formattedMessages = Object.keys(chatMessages).map((key) => ({
            id: key,
            ...chatMessages[key],
          }));
          setMessages(formattedMessages);
        } else {
          console.log('チャットルームが見つかりませんでした。');
        }
      } catch (error) {
        console.error('チャットメッセージの取得中にエラーが発生しました:', error);
      }
    };

    fetchChatMessages();
  }, [id]);

  const sendMessage = async () => {
    if (!input.trim()) {
      console.error('メッセージが空です。');
      return;
    }

    try {
      const newMessage = {
        createdBy: userInfo.key, // Zustandから取得したユーザーIDを使用
        text: input,
        timestamp: Date.now(),
      };

      // メッセージを送信
      const result = await createChat(newMessage.text, userInfo.key, id as string);
      if (result.success) {
        if (result.messageId) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { id: result.messageId, ...newMessage },
          ]);
        } else {
          console.error('メッセージIDが無効です。');
        }
        setInput(''); // 入力フィールドをクリア
      } else {
        console.error('メッセージ送信エラー:', result.error);
      }
    } catch (error) {
      console.error('メッセージ送信中にエラーが発生しました:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={
              item.createdBy === userInfo.key
                ? [styles.messageContainer, styles.myMessage]
                : [styles.messageContainer, styles.otherMessage]
            }
          >
            <Text style={styles.messageSender}>
              {item.createdBy === userInfo.key ? 'あなた' : item.createdBy}
            </Text>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.messageTimestamp}>
              {new Date(item.timestamp).toLocaleTimeString()}
            </Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="メッセージを入力"
        />
        <Button title="送信" onPress={sendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  messageContainer: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6', // 自分のメッセージの背景色
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC', // 相手のメッセージの背景色
  },
  messageSender: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
  },
  messageTimestamp: {
    fontSize: 10,
    color: '#888',
    marginTop: 4,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
  },
});

export default ChatRoom;