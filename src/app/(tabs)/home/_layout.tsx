import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <>
      <Stack
        initialRouteName='index'
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen
          name='index'
          options={{
            title: '홈',
          }}
        />
        <Stack.Screen
          name='dashboard'
          options={{
            title: '대시보드',
          }}
        />
      </Stack>
    </>
  );
}
