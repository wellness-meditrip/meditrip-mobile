import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { ColorPalette } from '@/constants/Colors';
import Header from '@/src/widgets/header';

import Chatbot from '../../widgets/chatbot';
import { scale } from '../../shared/lib/scale-utils';
import { Icon } from '../../../components/icons';

export default function TabLayout() {
  return (
    <>
      <Tabs
        initialRouteName='home'
        screenOptions={{
          tabBarActiveTintColor: ColorPalette.primaryColor50,
          tabBarInactiveTintColor: ColorPalette.primary,
          tabBarLabelStyle: {
            fontWeight: 'bold',
          },
          headerShown: true,
          header: () => <Header />,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              position: 'relative',
              height: 72,
              paddingTop: 8,
            },
            default: {
              height: 72,
              paddingTop: 8,
            },
          }),
          animation: 'none',
        }}
      >
        <Tabs.Screen
          name='home'
          options={{
            title: 'Home',
            tabBarIcon: ({ focused }) => (
              <Icon
                name='ic-home'
                size={scale(26)}
                color={
                  focused ? ColorPalette.primaryColor50 : ColorPalette.primary
                }
              />
            ),
            tabBarLabel: '홈',
            tabBarLabelStyle: {
              fontSize: scale(12),
              fontWeight: 'bold',
              paddingTop: 4,
            },
          }}
        />
        <Tabs.Screen
          name='clinics'
          options={{
            title: 'Clinics',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Icon
                name='ic-clinic-list'
                size={scale(26)}
                color={
                  focused ? ColorPalette.primaryColor50 : ColorPalette.primary
                }
              />
            ),
            tabBarLabel: '한의원',
            tabBarLabelStyle: {
              fontSize: scale(12),
              fontWeight: 'bold',
              paddingTop: 4,
            },
          }}
        />
        <Tabs.Screen
          name='my-page'
          options={{
            headerShown: false,
            title: 'My Page',
            tabBarIcon: ({ focused }) => (
              <Icon
                name='ic-mypage'
                size={scale(26)}
                color={
                  focused ? ColorPalette.primaryColor50 : ColorPalette.primary
                }
              />
            ),
            tabBarLabel: '마이페이지',
            tabBarLabelStyle: {
              fontSize: scale(12),
              fontWeight: 'bold',
              paddingTop: 4,
            },
          }}
        />
      </Tabs>
      <Chatbot />
    </>
  );
}
