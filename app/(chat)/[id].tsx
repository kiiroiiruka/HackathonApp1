import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { createChat, getChats } from '@/firebase/firebaseFunction';
import SubHeader from '@/components/ui/header/SubScreenHeader';

type Message = {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
};

const ChatRoom = () => {
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [myId] = useState('myUniqueId');
  const router = useRouter(); // ← 戻るボタンで使用

  useEffect(() => {
    const fetchChatMessages = async () => {
      if (!id) return;

      try {
        const chatMessages = await getChats.getChats(id as string);
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
    if (!input.trim()) return;

    try {
      const newMessage = {
        sender: myId,
        text: input,
        timestamp: Date.now(),
      };

      const result = await createChat.createChat(newMessage.text, myId, id as string);
      if (result.success) {
        if (result.messageId) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { id: result.messageId, ...newMessage },
          ]);
        }
        setInput('');
      } else {
        console.error('メッセージ送信エラー:', result.error);
      }
    } catch (error) {
      console.error('メッセージ送信中にエラーが発生しました:', error);
    }
  };

return (
  <KeyboardAvoidingView
    style={styles.container}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  >
    <View style={styles.wrapper}>
      {/* SubHeader */}
      <SubHeader title="チャット" onBack={() => router.back()} />

      {/* メッセージ一覧 */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={
              item.sender === myId
                ? [styles.messageContainer, styles.myMessage]
                : [styles.messageContainer, styles.otherMessage]
            }
          >
            <Text style={styles.messageSender}>
              {item.sender === myId ? 'あなた' : item.sender}
            </Text>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.messageTimestamp}>
                  {new Date(item.timestamp).toLocaleTimeString()}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.messageList}
        keyboardShouldPersistTaps="handled" // ★ここ大事！
      />

      {/* 入力エリア */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="メッセージを入力"
          placeholderTextColor="#b0b0b0"
          returnKeyType="send"
          onSubmitEditing={sendMessage} // ★エンターでも送信OK
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>送信</Text>
        </TouchableOpacity>
      </View>
    </View>
  </KeyboardAvoidingView>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  wrapper: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: 80,
  },
  messageList: {
    flexGrow: 1,
    padding: 16,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC',
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
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#18D7A3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    position: 'absolute', // 入力フィールドを画面下部に固定
    bottom: -10, // 画面下部に配置
    left: 0,
    right: 0,
    paddingBottom:40,
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 25,
    backgroundColor: '#fff',
    fontSize: 16,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sendButton: {
    backgroundColor: 'rgba(129, 132, 63, 0.76)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChatRoom;
