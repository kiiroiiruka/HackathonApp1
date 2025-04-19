import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
  const timeStyle = time === '活動中' ? styles.busyTime : styles.freeTime;
  
  // location に対するチェック
  const locationText = location.trim() === '' ? '未記入' : location;
  const locationStyle = location.trim() === '' ? styles.emptyLocation : styles.filledLocation;

  // message に対するチェック
  const messageText = message.trim() === '' ? '未記入' : message;
  const messageStyle = message.trim() === '' ? styles.emptyLocation : styles.filledLocation; // メッセージのスタイルも赤/緑に変更

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        {/* 左側の情報 */}
        <View style={styles.leftSection}>
          <Text style={styles.label}>👤 {username}</Text>
          <Text style={styles.label}>🎓 {studentId}</Text>
          <Text style={[styles.label, messageStyle]}>💬 {messageText}</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
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
    minHeight: 150, // 最小の高さを指定
    maxHeight: 220, // 最大の高さを指定
    justifyContent: 'space-between', // 内容の配置を調整
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap', // コンテンツがはみ出さないように
  },
  leftSection: {
    flex: 1,
    paddingRight: 10,
    justifyContent: 'space-around', // 中身を均等に配置
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
    minWidth: 120, // 最小幅を指定してバランスを取る
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
    color: '#ff3b30', // 活動中は赤
  },
  freeTime: {
    color: '#4cd964', // それ以外は緑
  },
  emptyLocation: {
    color: '#ff3b30', // 未記入の場合は赤
  },
  filledLocation: {
    color: '#4cd964', // 記入されている場合は緑
  },
});

export default StateInCurrentFriend;
