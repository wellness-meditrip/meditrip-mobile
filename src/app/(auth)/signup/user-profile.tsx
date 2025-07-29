import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';

const UserProfile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const handleComplete = () => {
    if (!firstName || !lastName) {
      Alert.alert('오류', '이름을 입력해주세요.');
      return;
    }

    // TODO: 실제 회원가입 로직 구현
    Alert.alert('회원가입 완료', 'MediTrip 회원가입이 완료되었습니다!', [
      {
        text: '확인',
        onPress: () => {
          // 메인 화면으로 이동
          router.replace('/(tabs)/home');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>프로필 설정</Text>
          <Text style={styles.subtitle}>기본 정보를 입력해주세요</Text>

          <View style={styles.form}>
            <View style={styles.nameRow}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder='성'
                value={lastName}
                onChangeText={setLastName}
              />
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder='이름'
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>

            <TextInput
              style={styles.input}
              placeholder='전화번호 (선택사항)'
              value={phone}
              onChangeText={setPhone}
              keyboardType='phone-pad'
            />

            <TextInput
              style={styles.input}
              placeholder='생년월일 (선택사항, YYYY-MM-DD)'
              value={birthDate}
              onChangeText={setBirthDate}
            />

            <TouchableOpacity
              style={styles.completeButton}
              onPress={handleComplete}
            >
              <Text style={styles.completeButtonText}>회원가입 완료</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    color: '#666',
  },
  form: {
    gap: 16,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  halfInput: {
    flex: 1,
  },
  completeButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
