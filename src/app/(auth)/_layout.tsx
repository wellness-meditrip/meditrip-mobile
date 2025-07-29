import React from 'react';
import { Stack } from 'expo-router';

const AuthLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name='login'
        options={{
          title: '로그인',
        }}
      />
      <Stack.Screen
        name='signup'
        options={{
          title: '회원가입',
        }}
      />
    </Stack>
  );
};

export default AuthLayout;
