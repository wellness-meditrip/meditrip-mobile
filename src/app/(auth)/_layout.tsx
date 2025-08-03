import React from 'react';
import { Stack } from 'expo-router';
import Header from '../../widgets/header';

const AuthLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        header: () => <Header />,
        animation: 'none',
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
