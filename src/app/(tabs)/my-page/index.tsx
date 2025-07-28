import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MyPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Page</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/my-page/profile')}
      >
        <Text style={styles.buttonText}>프로필 보기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MyPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
