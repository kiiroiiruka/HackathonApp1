import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAtom } from 'jotai'; // jotaiをインポート
import { getChatroomByPersons } from '@/firebase/get/getChatroom'; // ルーム取得関数をインポート
import { createChatroom } from '@/firebase/add/createChatroom'; // チャットルーム作成関数をインポート
import { studentIdAtom } from '@/atom/studentIdAtom'; // MyIdを管理するatomをインポート
import { useEffect, useState } from 'react';
import { getProfileImageUriByStudentId } from '@/firebase/get/getProfileImageUriByStudentId';

type UserCardProps = {
  username: string;
  studentId: string;
  location: string;
  message: string;
  time: string;
};

const StateInCurrentFriend: React.FC<UserCardProps> = ({
  username,
  studentId,
  location,
  message,
  time,
}) => {
  const router = useRouter(); // ルーターを使用してページ遷移
  const [myId,] = useAtom(studentIdAtom); // jotaiからMyIdを取得
  const [imageUri, setImageUri] = useState<string | null>(null);

  // 末尾から最初に現れる '--' を探して、それを基準に分ける処理
  const lastDoubleHyphenIndex = studentId.lastIndexOf('--');
  const mainId = lastDoubleHyphenIndex !== -1 ? studentId.slice(0, lastDoubleHyphenIndex) : studentId; // '--' より前の部分
  const subId = lastDoubleHyphenIndex !== -1 ? studentId.slice(lastDoubleHyphenIndex + 2) : ''; // '--' より後ろの部分

  useEffect(() => {
    const fetchImage = async () => {
      const uri = await getProfileImageUriByStudentId(studentId);
      setImageUri(uri);
    };
    fetchImage();
  }, [studentId]);

  const timeStyle = time === '活動中' ? styles.busyTime : styles.freeTime;

  // location に対するチェック
  const locationText = location.trim() === '' ? '未記入' : location;
  const locationStyle = location.trim() === '' ? styles.emptyLocation : styles.filledLocation;

  // message に対するチェック
  const messageText = message.trim() === '' ? '未記入' : message;
  const messageStyle = message.trim() === '' ? styles.emptyLocation : styles.filledLocation;

  const handleChatNavigation = async () => {
    console.log('ルームチャットに移動ボタンが押されました。');
    try {
      // MyIdとstudentIdを使ってチャットルームを検索
      const chatroom = await getChatroomByPersons(myId, studentId);
      console.log(chatroom)
      if (chatroom) {
        // チャットルームが見つかった場合、動的ルートに遷移
        router.push(`/(chat)/${chatroom.id}`);
      } else {
        console.log('条件に一致するチャットルームが見つかりませんでした。新しいチャットルームを作成します。');
        // チャットルームが見つからなかった場合、新しいチャットルームを作成
        const result = await createChatroom(myId, studentId);
        if (result && result.success) {
          console.log('新しいチャットルームが作成されました:', result.chatroomId);
          router.push(`/(chat)/${result.chatroomId}`); // 作成したチャットルームに遷移
        } else {
          console.error('チャットルーム作成エラー:', result?.error || '不明なエラー');
        }
      }
    } catch (error) {
      console.error('チャットルーム取得エラー:', error);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        {/* 左側の情報 */}
        <View style={styles.leftSection}>
          <Text>👤ユーザー名</Text>
          <Text style={styles.label}> {username}</Text>
          <Text>🎓学籍番号</Text>
          <Text style={styles.label}>
           {mainId}
            {subId && <Text style={styles.subStudentId}>{"\n"}{subId}</Text>}
          </Text>
          <Text>💬一言メッセージ</Text>
          <Text style={[styles.label, messageStyle]}>{messageText}</Text>
        </View>

        {/* 右側の情報 */}
        <View style={styles.rightSection}>
          <View style={styles.highlightBox}>
            <Text style={styles.highlightLabel}>📍 現在地</Text>
            <Text style={[styles.highlightText, locationStyle]}>{locationText}</Text>
          </View>
          <View style={styles.highlightBox}>
            <Text style={styles.highlightLabel}>⏰ 何時まで暇？</Text>
            <Text style={[styles.highlightText, timeStyle]}>{time}</Text>
          </View>
        </View>
      </View>

      {/* 中央にルームチャットボタンを追加 */}
      <View style={styles.buttonContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
        
        <TouchableOpacity style={styles.chatButton} onPress={handleChatNavigation}>
          <Text style={styles.chatIcon}>💬</Text>
          <Text style={styles.chatButtonText}>ルームチャットに移動</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    marginLeft: 16,
    elevation: 3, // Android shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  
  chatIcon: {
    fontSize: 16,
    color: '#fff',
    marginRight: 8,
  },
  subStudentId: {
    fontSize: 11,
    color: '#999',
    fontWeight: '400',
    marginTop: 4,
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignSelf: 'center',
    marginVertical: 10,
  },
  placeholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    alignSelf: 'center',
    backgroundColor: '#f2f2f2',
  },
  placeholderText: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    padding: 16,
    minHeight: 150,
    maxHeight: 250,
    justifyContent: 'space-between',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  leftSection: {
    flex: 1,
    paddingRight: 10,
    justifyContent: 'space-around',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  rightSection: {
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    minWidth: 120,
  },
  highlightBox: {
    backgroundColor: '#e1f4ff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'flex-end',
  },
  highlightLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
  },
  highlightText: {
    fontSize: 14,
    fontWeight: '700',
  },
  busyTime: {
    color: '#ff3b30',
  },
  freeTime: {
    color: '#4cd964',
  },
  emptyLocation: {
    color: '#ff3b30',
  },
  filledLocation: {
    color: '#4cd964',
  },
  buttonContainer: {
    alignItems: 'center',
    flexDirection:"row",
    margin:"auto",
    marginTop:-5
  },
});

export default StateInCurrentFriend;
