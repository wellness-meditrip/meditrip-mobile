import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Text, View } from '@/src/shared/ui/custom';
import { useThemeColor } from '@/hooks/useThemeColor';

interface ClinicCardProps {
  name: string;
  specialty: string;
  tags: string[];
  rating: number;
  image: any; // require() 또는 { uri: string }
  onPress?: () => void;
  isLast?: boolean;
}

export const ClinicCard: React.FC<ClinicCardProps> = ({
  name,
  specialty,
  tags,
  rating,
  image,
  onPress,
  isLast = false,
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
          marginRight: isLast ? 0 : 16,
        },
      ]}
      onPress={onPress}
    >
      <Image source={image} style={styles.image} />
      <View style={styles.badgeContainer}>
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
        <View style={styles.tagsContainer}>
          {tags?.map(tag => (
            <Text key={tag} style={styles.tag}>
              {tag}
            </Text>
          ))}
        </View>
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
    maxWidth: 120,
  },
  locationText: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 14,
  },
  ratingBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  ratingText: {
    fontSize: 10,
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
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  tag: {
    color: 'white',
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
});
