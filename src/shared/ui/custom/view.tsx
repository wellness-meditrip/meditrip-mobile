import React from 'react';
import { View as RNView, ViewStyle } from 'react-native';
import { ScaledStyleProps, applyScaledStyles } from './types';

interface CustomViewProps extends ScaledStyleProps {
  style?: ViewStyle;
  children?: React.ReactNode;
}

const View: React.FC<CustomViewProps> = ({ style, children, ...props }) => {
  const scaledStyle = applyScaledStyles(props);
  return <RNView style={[scaledStyle, style]}>{children}</RNView>;
};

export default View;
