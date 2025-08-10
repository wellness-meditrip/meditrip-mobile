import React from 'react';
import { StyleSheet, ScrollView, Dimensions } from 'react-native';
import { View } from '@/src/shared/ui/custom';
import { ClinicCard } from './ClinicCard';
import { scale } from '../lib/scale-utils';
import { Clinic } from '../../app/(tabs)/home';

interface ClinicSliderProps {
  clinics: Clinic[];
  onClinicPress?: (clinic: Clinic) => void;
}

export const ClinicSlider: React.FC<ClinicSliderProps> = ({
  clinics,
  onClinicPress,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      decelerationRate='fast'
      snapToInterval={296} // card width + marginRight
      snapToAlignment='start'
    >
      {clinics.map((clinic, index) => (
        <ClinicCard
          key={clinic.id}
          name={clinic.name}
          specialty={clinic.specialty}
          tags={clinic?.tags || []}
          rating={clinic.rating}
          image={clinic.image}
          onPress={() => onClinicPress?.(clinic)}
          isLast={index === clinics.length - 1}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {},
});
