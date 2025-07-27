import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Input } from './Input';
import { Text } from './Text';

export const InputExample = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  return (
    <View style={styles.container}>
      <Text variant="h2" weight="bold" style={styles.title}>
        Input 컴포넌트 예시
      </Text>
      
      <Input
        label="이름"
        placeholder="이름을 입력하세요"
        value={name}
        onChangeText={setName}
        variant="outlined"
      />
      
      <Input
        label="이메일"
        placeholder="이메일을 입력하세요"
        value={email}
        onChangeText={setEmail}
        variant="outlined"
        error={email && !email.includes('@') ? '올바른 이메일을 입력해주세요' : undefined}
      />
      
      <Input
        label="비밀번호"
        placeholder="비밀번호를 입력하세요"
        value={password}
        onChangeText={setPassword}
        variant="filled"
        secureTextEntry
        helper="8자 이상 입력해주세요"
      />
      
      <View style={styles.result}>
        <Text variant="body" weight="semibold">입력된 값:</Text>
        <Text variant="caption">이름: {name}</Text>
        <Text variant="caption">이메일: {email}</Text>
        <Text variant="caption">비밀번호: {password}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  result: {
    marginTop: 20,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
  },
}); 