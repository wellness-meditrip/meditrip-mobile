import React from 'react';
import {
  ScrollView as RNScrollView,
  ScrollViewProps,
  ViewStyle,
} from 'react-native';
import { ScaledStyleProps, applyScaledStyles } from './types';

interface CustomScrollViewProps extends ScrollViewProps, ScaledStyleProps {
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  children?: React.ReactNode;
}

const ScrollView: React.FC<CustomScrollViewProps> = ({
  style,
  contentContainerStyle,
  children,
  ...props
}) => {
  const scaledStyle = applyScaledStyles(props);
  return (
    <RNScrollView
      style={[scaledStyle, style]}
      contentContainerStyle={contentContainerStyle}
      {...props}
    >
      {children}
    </RNScrollView>
  );
};

export default ScrollView;
