import React from 'react';
import { SELF } from '@/assets/icons/main';
import { Image } from 'expo-image';

export interface Category {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export const CATEGORIES: Category[] = [
  {
    id: 'mental',
    label: '스트레스',
    icon: React.createElement(Image, {
      source: require('@/assets/icons/main/mental.webp'),
      style: { width: 32, height: 32 },
    }),
  },
  {
    id: 'woman',
    label: '여성질환',
    icon: React.createElement(Image, {
      source: require('@/assets/icons/main/women.webp'),
      style: { width: 32, height: 32 },
    }),
  },
  {
    id: 'anti-aging',
    label: '안티에이징',
    icon: React.createElement(Image, {
      source: require('@/assets/icons/main/anti-aging.webp'),
      style: { width: 32, height: 32 },
    }),
  },
  {
    id: 'immunity',
    label: '면역관리',
    icon: React.createElement(Image, {
      source: require('@/assets/icons/main/immun.webp'),
      style: { width: 32, height: 32 },
    }),
  },
  {
    id: 'diet-detox',
    label: '체중감량',
    icon: React.createElement(Image, {
      source: require('@/assets/icons/main/diet-detox.webp'),
      style: { width: 32, height: 32 },
    }),
  },
];
