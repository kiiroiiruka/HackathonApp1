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
  Image, // 追加
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMeInfoStore } from '@/store/meData';
import { subscribeToChats } from '@/firebase/fetch/fetchChats';
import { createChat } from '@/firebase/add/createChat';
import SubHeader from '@/components/ui/header/SubScreenHeader';
import { getUserInfoByDocId } from '@/firebase/get/getChatIcon';
import { setReadCount } from '@/firebase/chatReadTime/updateAccessTime';
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
  const [usernames, setUsernames] = useState<{ [key: string]: string }>({});
  const [profileImages, setProfileImages] = useState<{ [key: string]: string }>({});

  // ユーザー名とアイコン画像を取得
  useEffect(() => {
    const fetchUsernames = async () => {
      const uniqueIds = [...new Set(messages.map(msg => msg.createdBy))];
      const nameMap: { [key: string]: string } = { ...usernames };
      const imageMap: { [key: string]: string } = { ...profileImages };
  
      await Promise.all(
        uniqueIds.map(async (id) => {
          if (!nameMap[id]) {
            const user = await getUserInfoByDocId(id);
            if (user && user.username) {
              nameMap[id] = user.username; // ユーザー名がある場合のみ追加
            }
            if (user && user.profileImageUri) {
              imageMap[id] = user.profileImageUri; // アイコン画像があれば追加
            }
          }
        })
      );
      setUsernames(nameMap);
      setProfileImages(imageMap); // アイコン画像の状態を更新
    };
  
    if (messages.length > 0) {
      fetchUsernames();
    }
  }, [messages]);

  useEffect(() => {
    if (!id || typeof id !== 'string') {
      console.error('チャットルームIDが無効です。');
      return;
    }
  
    const unsubscribe = subscribeToChats(id, async (chats) => {
      if (Array.isArray(chats)) {
        const sortedChats = chats.sort((a, b) => a.createdAt - b.createdAt);
        setMessages(sortedChats);
  
        // 🔽 ここでカウント保存
        await setReadCount(userInfo.key, id, sortedChats.length);
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
        const newMessages = [...messages, { id: result.messageId, ...newMessage }];
        setMessages(newMessages);
        setInput('');
  
        // 🔽 カウント更新
        await setReadCount(userInfo.key, id as string, newMessages.length);
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
              <View style={styles.messageHeader}>
                
              {item.createdBy === userInfo.key?(
                <View style={{marginLeft:"auto",flexDirection:"row",alignItems:"center",marginRight: -10}}>


                  <Text style={styles.messageSender}>
                    あなた
                  </Text>
                  <View style={{marginLeft:5}}>
                    {profileImages[item.createdBy] ? (
                      <Image
                        source={{ uri: profileImages[item.createdBy] }}
                        style={styles.profileImage}
                      />
                    ) : (
                      <View style={styles.profileImagePlaceholder}>
                        <Text style={styles.profileImagePlaceholderText}>なし</Text>
                      </View>
                    )}
                  </View>
                </View>
                ):(
                  <>
                    {profileImages[item.createdBy] ? (
                      <Image
                        source={{ uri: profileImages[item.createdBy] }}
                        style={styles.profileImage}
                      />
                    ) : (
                      <View style={styles.profileImagePlaceholder}>
                        <Text style={styles.profileImagePlaceholderText}>なし</Text>
                      </View>
                    )}

                    <Text style={styles.messageSender}>
                      {usernames[item.createdBy] ?? '名前取得中...'}
                    </Text>
                  </>
                )
                }

              </View>
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
  profileImagePlaceholderText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center', // テキストを中央揃え
    margin:"auto"
  },
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
    marginBottom: 20,
  },
  sendButton: {
    backgroundColor: 'rgba(129, 132, 63, 0.76)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    justifyContent: 'center',
    marginBottom: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  profileImagePlaceholder: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
  },
});

export default ChatRoom;
