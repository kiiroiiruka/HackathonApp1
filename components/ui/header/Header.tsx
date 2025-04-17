import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAtom } from 'jotai';
import { studentIdAtom } from '@/atom/studentIdAtom';

type HeaderProps = {
  title?: string;
  children?: React.ReactNode;
};

const Header: React.FC<HeaderProps> = ({ title = '', children }) => {
  const router = useRouter();
  const [studentId,]=useAtom(studentIdAtom)
  const handleLogout = async () => {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem('email');
        localStorage.removeItem('password');
      } else {
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('password');
      }
      router.push('./(login)');
    } catch (error) {
      console.error('ログアウト処理に失敗しました', error);
    }
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>ログアウト</Text>
      </TouchableOpacity>

      {title && <Text style={styles.headerText}>{title}</Text>}
      {children && (
        <View style={styles.childrenRow}>
          {children}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  childrenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  headerContainer: {

    backgroundColor: '#2196f3',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    position: 'relative',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  childrenContainer: {
    marginTop: 8,
  },
  logoutButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#ff5252',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    zIndex: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Header;
