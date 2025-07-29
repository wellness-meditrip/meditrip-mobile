import React from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, View } from '@/src/shared/ui/custom';
import { useThemeColor } from '@/hooks/useThemeColor';

interface ClinicCardProps {
  name: string;
  specialty: string;
  location: string;
  rating: number;
  image: any;
  onPress?: () => void;
}

export const ClinicCard: React.FC<ClinicCardProps> = ({
  name,
  specialty,
  location,
  rating,
  image,
  onPress,
}) => {
  // 다크모드 색상 적용
  const cardBackgroundColor = useThemeColor({}, 'background');
  const badgeBackgroundColor = useThemeColor(
    { light: 'rgba(255, 255, 255, 0.9)', dark: 'rgba(0, 0, 0, 0.8)' },
    'background'
  );
  const badgeTextColor = useThemeColor(
    { light: '#333', dark: '#ECEDEE' },
    'text'
  );

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: cardBackgroundColor,
          shadowColor: useThemeColor({}, 'text'),
        },
      ]}
      onPress={onPress}
    >
      <Image source={image} style={styles.image} />
      <View style={styles.badgeContainer}>
        <View
          style={{
            ...styles.locationBadge,
            backgroundColor: badgeBackgroundColor,
          }}
        >
          <Text style={{ ...styles.locationText, color: badgeTextColor }}>
            {location}
          </Text>
        </View>
        <View
          style={{
            ...styles.ratingBadge,
            backgroundColor: badgeBackgroundColor,
          }}
        >
          <Text style={{ ...styles.ratingText, color: badgeTextColor }}>
            ⭐ {rating}
          </Text>
        </View>
      </View>
      <View style={styles.overlay}>
        <Text style={styles.clinicName}>{name}</Text>
        <Text style={styles.specialty}>{specialty}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 200,
    height: 240,
    borderRadius: 12,
    marginRight: 16,
    overflow: 'hidden',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badgeContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'column',
    gap: 8,
  },
  locationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  locationText: {
    fontSize: 12,
    fontWeight: '600',
  },
  ratingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 16,
  },
  clinicName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  specialty: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
  },
});
