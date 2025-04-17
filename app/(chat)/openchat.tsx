import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';
type Message = {
    id: string;
    senderId: string; // 送信者のID（ユーザーIDなど）
    text: string;
    timestamp: number; // ← これを追加（ミリ秒のUNIX時間）
  };

  
const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    setMessages([
      ...messages,
      {
        id: Date.now().toString(),
        senderId: 'user123', // 仮の送信者ID
        text: input,
        timestamp: Date.now(),
      },
    ]);
    setInput('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text style={styles.message}>{item.text}</Text>}
      />
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder="メッセージを入力"
      />
      <Button title="送信" onPress={sendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  message: { padding: 10, backgroundColor: '#f1f1f1', marginVertical: 5 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 },
});

export default ChatScreen;