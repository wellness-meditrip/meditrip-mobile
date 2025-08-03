import { Stack } from 'expo-router';

export default function MyPageLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'none',
      }}
    >
      <Stack.Screen
        name='index'
        options={{
          title: 'My Page',
        }}
      />
      <Stack.Screen
        name='profile'
        options={{
          title: '프로필',
        }}
      />
    </Stack>
  );
}
