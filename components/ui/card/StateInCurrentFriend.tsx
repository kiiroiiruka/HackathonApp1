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
  return (
    <View style={styles.card}>
      <View style={styles.innerContainer}>
        {/* 左側の情報 */}
        <View style={styles.leftSection}>
          <Text style={styles.label}>👤  <Text style={styles.text}>{username}</Text></Text>
          <Text style={styles.label}>🎓 <Text style={styles.text}>{studentId}</Text></Text>
          <Text style={styles.label}>💬  <Text style={styles.text}>{message}</Text></Text>
        </View>

        {/* 右側の情報 */}
        <View style={styles.rightSection}>
          <View style={styles.highlightBox}>
            <Text style={styles.highlightLabel}>📍 現在地</Text>
            <Text style={styles.highlightText}>{location}</Text>
          </View>
          <View style={styles.highlightBox}>
            <Text style={styles.highlightLabel}>⏰ 何時まで暇？</Text>
            <Text style={styles.highlightText}>{time}</Text>
          </View>
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 2,
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftSection: {
    flex: 1,
    paddingRight: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  text: {
    fontWeight: '400',
    color: '#333',
  },
  rightSection: {
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  highlightBox: {
    backgroundColor: '#007AFF20',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 8,
    alignItems: 'flex-end',
  },
  highlightLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#007AFF',
  },
  highlightText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});

export default StateInCurrentFriend;
