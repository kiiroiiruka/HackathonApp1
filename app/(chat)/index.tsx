import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const ChatIndex = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Button
        title="Open Chat"
        onPress={() => router.push('/(chat)/openchat')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatIndex;