import { Stack } from 'expo-router';
import Header from '../../../widgets/header';

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
          headerShown: true,
          header: () => <Header title='한의원' />,
          title: 'Clinics',
        }}
      />
      {/* <Stack.Screen
        name='clinic-list'
        options={{
          headerShown: true,
          header: () => <Header title='클리닉 리스트' />,
          title: '클리닉 리스트',
        }}
      /> */}
    </Stack>
  );
}
