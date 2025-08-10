import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from '@/components/icons';
import type { IconName } from '@/components/icons';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  color?: string;
  emptyColor?: string;
  showText?: boolean;
  textStyle?: any;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 16,
  color = '#FFD700',
  emptyColor = '#E5E7EB',
  showText = false,
  textStyle,
}) => {
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= maxRating; i++) {
      const starValue = i;
      const isHalfStar = rating >= starValue - 0.5 && rating < starValue;
      const isFullStar = rating >= starValue;

      let iconName: IconName = 'ic-star';
      let iconColor = emptyColor;

      if (isFullStar) {
        iconColor = color;
      } else if (isHalfStar) {
        iconName = 'ic-star-half';
        iconColor = color;
      }

      stars.push(
        <Icon key={i} name={iconName} size={size} color={iconColor} />
      );
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>{renderStars()}</View>
      {showText && <Text style={[styles.ratingText, textStyle]}>{rating}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
});
