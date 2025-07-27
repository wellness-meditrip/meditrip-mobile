import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen
        
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Stack.Screen
        name="dashboard"
        options={{
          title: "대시보드",
        }}
      />
    </Stack>
  );
} 