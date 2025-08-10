import { Stack } from 'expo-router';

export default function ClinicsLayout() {
  return (
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
          headerShown: false,
          title: 'Clinics',
        }}
      />
      <Stack.Screen
        name='clinic-list'
        options={{
          headerShown: false,
          title: '클리닉 리스트',
        }}
      />
    </Stack>
  );
}
