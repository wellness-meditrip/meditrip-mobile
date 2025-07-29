import { INSTAGRAM, TWITTER, YOUTUBE } from '@/assets/icons/components/footer';
import { scale } from '@/src/shared/lib';
import { Text, View } from '@/src/shared/ui/custom';
import React from 'react';
import { StyleSheet } from 'react-native';
import { BoxLayout } from '../../shared/ui/box-layout';

const Footer = () => {
  return (
    <BoxLayout>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <TWITTER />
            <INSTAGRAM />
            <YOUTUBE />
          </View>
          <View style={{ height: 10 }} />
          <View>
            <Text fontSize={12} color='#666' weight='bold'>
              MEDITRIP
            </Text>
          </View>
          <View style={{ height: 10 }} />
          <Text fontSize={12} color='#666'>
            Pravacy
          </Text>
          <Text fontSize={12} color='#666'>
            Terms of Service
          </Text>
        </View>
      </View>
    </BoxLayout>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    width: '40%',
    paddingHorizontal: scale(16),
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
});
