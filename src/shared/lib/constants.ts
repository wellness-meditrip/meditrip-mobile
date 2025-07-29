import React from 'react';
import { SELF } from '@/assets/icons/main';

export interface Category {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export const CATEGORIES: Category[] = [
  {
    id: 'mental',
    label: 'Mental',
    icon: React.createElement(SELF),
  },
  {
    id: 'woman',
    label: 'Woman',
    icon: React.createElement(SELF),
  },
  {
    id: 'anti-aging',
    label: 'Anti-aging',
    icon: React.createElement(SELF),
  },
  {
    id: 'immunity',
    label: 'Immunity',
    icon: React.createElement(SELF),
  },
  {
    id: 'diet-detox',
    label: 'Diet&Detox',
    icon: React.createElement(SELF),
  },
];
