import React from 'react';
import { View, ViewProps } from 'react-native';

interface BoxLayoutProps extends ViewProps {
  horizontal?: number;
  vertical?: number;
  children: React.ReactNode;
}

export const BoxLayout: React.FC<BoxLayoutProps> = ({
  horizontal = 16,
  vertical = 20,
  children,
  style,
  ...props
}) => {
  return (
    <View
      style={[
        {
          paddingHorizontal: horizontal,
          paddingVertical: vertical,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};
