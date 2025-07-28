import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Clinics = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clinics</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/clinics/clinic-list')}
      >
        <Text style={styles.buttonText}>클리닉 리스트 보기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Clinics;

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
