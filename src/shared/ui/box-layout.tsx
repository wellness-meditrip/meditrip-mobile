import React from 'react';
import { View, ViewProps } from 'react-native';

interface BoxLayoutProps extends ViewProps {
  horizontal?: number;
  vertical?: number;
  children: React.ReactNode;
  backgroundColor?: string;
}

export const BoxLayout: React.FC<BoxLayoutProps> = ({
  horizontal = 16,
  vertical = 20,
  children,
  style,
  backgroundColor,
  ...props
}) => {
  return (
    <View
      style={[
        {
          paddingHorizontal: horizontal,
          paddingVertical: vertical,
          backgroundColor,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};
