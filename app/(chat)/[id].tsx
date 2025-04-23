import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMeInfoStore } from '@/store/meData';
import { subscribeToChats } from '@/firebase/fetch/fetchChats';
import { createChat } from '@/firebase/add/createChat';
import SubHeader from '@/components/ui/header/SubScreenHeader';

type Message = {
  id: string;
  createdBy: string;
  text: string;
  createdAt: number;
};

const ChatRoom = () => {
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const userInfo = useMeInfoStore((state) => state.userInfo);
  const router = useRouter();

  useEffect(() => {
    if (!id || typeof id !== 'string') {
      console.error('チャットルームIDが無効です。');
      return;
    }

    const unsubscribe = subscribeToChats(id, (chats) => {
      if (Array.isArray(chats)) {
        const sortedChats = chats.sort((a, b) => a.createdAt - b.createdAt);
        setMessages(sortedChats);
      } else {
        console.error('chatsが配列ではありません:', chats);
      }
    });

    return () => unsubscribe();
  }, [id]);

  const sendMessage = async () => {
    if (!input.trim()) {
      console.error('メッセージが空です。');
      return;
    }

    try {
      const newMessage = {
        createdBy: userInfo.key,
        text: input,
        createdAt: Date.now(),
      };

      const result = await createChat(newMessage.text, userInfo.key, id as string);
      if (result.success && result.messageId) {
        setMessages((prev) => [...prev, { id: result.messageId, ...newMessage }]);
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
        <SubHeader title="チャット" onBack={() => router.back()} />

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
                {new Date(item.createdAt).toLocaleTimeString()}
              </Text>
            </View>
          )}
          contentContainerStyle={styles.messageList}
          keyboardShouldPersistTaps="handled"
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="メッセージを入力"
            placeholderTextColor="#b0b0b0"
            returnKeyType="send"
            onSubmitEditing={sendMessage}
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
    backgroundColor: '#18D7A3',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 25,
    backgroundColor: '#fff',
    fontSize: 16,
    marginRight: 10,
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
