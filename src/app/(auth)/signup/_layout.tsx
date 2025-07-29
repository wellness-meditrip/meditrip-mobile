import React from 'react';
import { Stack } from 'expo-router';

const SignupLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        animation: 'slide_from_right',
        headerBackTitle: '뒤로',
      }}
    >
      <Stack.Screen
        name='index'
        options={{
          title: '회원가입',
        }}
      />
      <Stack.Screen
        name='signup-email'
        options={{
          title: '이메일 입력',
        }}
      />
      <Stack.Screen
        name='user-profile'
        options={{
          title: '프로필 설정',
        }}
      />
    </Stack>
  );
};

export default SignupLayout;
