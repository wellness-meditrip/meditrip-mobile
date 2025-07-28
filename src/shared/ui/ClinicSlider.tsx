import React from 'react';
import { StyleSheet, ScrollView, Dimensions } from 'react-native';
import { View } from '@/src/shared/ui/custom';
import { ClinicCard } from './ClinicCard';

interface Clinic {
  id: string;
  name: string;
  specialty: string;
  location: string;
  rating: number;
  image: any;
}

interface ClinicSliderProps {
  clinics: Clinic[];
  onClinicPress?: (clinic: Clinic) => void;
}

export const ClinicSlider: React.FC<ClinicSliderProps> = ({
  clinics,
  onClinicPress,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate='fast'
        snapToInterval={296} // card width + marginRight
        snapToAlignment='start'
      >
        {clinics.map(clinic => (
          <ClinicCard
            key={clinic.id}
            name={clinic.name}
            specialty={clinic.specialty}
            location={clinic.location}
            rating={clinic.rating}
            image={clinic.image}
            onPress={() => onClinicPress?.(clinic)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
});
