import { Stack } from 'expo-router';
import Header from '../../../widgets/header';

export default function MyPageLayout() {
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
          title: '마이페이지',
          headerShown: true,
          header: () => <Header title='마이페이지' />,
        }}
      />
      <Stack.Screen
        name='profile'
        options={{
          title: '프로필',
          headerShown: true,
          header: () => <Header title='프로필' />,
        }}
      />
      <Stack.Screen
        name='reservation-list'
        options={{
          title: '예약 목록',
          headerShown: true,
          header: () => <Header title='예약목록' />,
        }}
      />
      <Stack.Screen
        name='review-list'
        options={{
          title: '리뷰 내역',
          headerShown: true,
          header: () => <Header title='리뷰 내역' />,
        }}
      />
    </Stack>
  );
}
