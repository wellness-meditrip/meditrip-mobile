import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors, ColorPalette } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Header from '@/src/widgets/header';
import {
  HOME,
  HOME_COLOR,
  CLINICS,
  CLINICS_COLOR,
  MY_PAGE,
  MY_PAGE_COLOR,
} from '@/assets/icons/components';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      initialRouteName='home'
      screenOptions={{
        tabBarActiveTintColor: ColorPalette.primaryColor50,
        tabBarLabelStyle: {
          fontWeight: 'bold',
        },
        headerShown: true,
        header: () => <Header />,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
        animation: 'none',
      }}
    >
      <Tabs.Screen
        name='home'
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) =>
            focused ? (
              <HOME_COLOR width={24} height={24} />
            ) : (
              <HOME width={24} height={24} />
            ),
        }}
      />
      <Tabs.Screen
        name='clinics'
        options={{
          title: 'Clinics',
          tabBarIcon: ({ focused }) =>
            focused ? (
              <CLINICS_COLOR width={24} height={24} />
            ) : (
              <CLINICS width={24} height={24} />
            ),
        }}
      />
      <Tabs.Screen
        name='my-page'
        options={{
          title: 'My Page',
          tabBarIcon: ({ focused }) =>
            focused ? (
              <MY_PAGE_COLOR width={24} height={24} />
            ) : (
              <MY_PAGE width={24} height={24} />
            ),
        }}
      />
    </Tabs>
  );
}
