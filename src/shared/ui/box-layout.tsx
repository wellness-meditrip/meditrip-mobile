import React from 'react';
import { View, ViewProps } from 'react-native';
import Gap from './gap';

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
    <>
      <Gap size={12} style={{ backgroundColor: '#eee' }} />
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
    </>
  );
};
