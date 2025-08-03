import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from './index';

export const IconExample: React.FC = () => {
  return (
    <View style={styles.container}>
      <Icon name='arrow-left' size={32} color='#007AFF' />
      <Icon name='search' size={24} color='#FF3B30' />
      <Icon name='self' size={28} color='#34C759' />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
  },
});
