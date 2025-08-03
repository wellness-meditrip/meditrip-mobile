import React from 'react';
import { SvgProps } from 'react-native-svg';

// SVG 아이콘들을 import
import ArrowLeft from '../../assets/icons/arrow_left.svg';
import Search from '../../assets/icons/search.svg';
import Self from '../../assets/icons/self.svg';

// 아이콘 타입 정의
export type IconName = 'arrow-left' | 'search' | 'self';

interface IconProps extends SvgProps {
  name: IconName;
  size?: number;
  color?: string;
}

// 아이콘 매핑
const iconMap: Record<IconName, React.FC<SvgProps>> = {
  'arrow-left': ArrowLeft,
  search: Search,
  self: Self,
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = '#222222',
  ...props
}) => {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return <IconComponent width={size} height={size} color={color} {...props} />;
};
