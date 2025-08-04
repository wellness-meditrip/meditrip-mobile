import { IconName } from '../../../components/icons';

export interface Category {
  id: string;
  label: string;
  icon: IconName;
}

export const CATEGORIES: Category[] = [
  {
    id: 'mental',
    label: '스트레스',
    icon: 'ic-mental-health',
  },
  {
    id: 'woman',
    label: '여성질환',
    icon: 'ic-woman-health',
  },
  {
    id: 'anti-aging',
    label: '안티에이징',
    icon: 'ic-anti-aging',
  },
  {
    id: 'immunity',
    label: '면역관리',
    icon: 'ic-immunity',
  },
  {
    id: 'diet-detox',
    label: '체중감량',
    icon: 'ic-diet-detox',
  },
];
