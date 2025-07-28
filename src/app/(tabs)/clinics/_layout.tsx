import { Stack } from 'expo-router';

export default function ClinicsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name='index'
        options={{
          title: 'Clinics',
        }}
      />
      <Stack.Screen
        name='clinic-list'
        options={{
          title: '클리닉 리스트',
        }}
      />
    </Stack>
  );
}
