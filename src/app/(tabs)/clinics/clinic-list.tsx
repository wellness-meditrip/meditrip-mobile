import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

const mockClinics = [
  { id: '1', name: '서울대학교병원', location: '서울시 종로구', rating: 4.8 },
  { id: '2', name: '연세대학교병원', location: '서울시 서대문구', rating: 4.7 },
  { id: '3', name: '고려대학교병원', location: '서울시 성북구', rating: 4.6 },
  { id: '4', name: '삼성서울병원', location: '서울시 강남구', rating: 4.9 },
  { id: '5', name: '아산병원', location: '서울시 송파구', rating: 4.5 },
];

const ClinicList = () => {
  // 다크모드 색상 적용
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const clinicLocationColor = useThemeColor(
    { light: '#666', dark: '#9BA1A6' },
    'text'
  );
  const ratingColor = '#FF6B35';
  const shadowColor = useThemeColor({}, 'text');

  const renderClinic = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.clinicItem,
        { backgroundColor: cardBackgroundColor, shadowColor },
      ]}
    >
      <View style={styles.clinicInfo}>
        <Text style={[styles.clinicName, { color: textColor }]}>
          {item.name}
        </Text>
        <Text style={[styles.clinicLocation, { color: clinicLocationColor }]}>
          {item.location}
        </Text>
      </View>
      <View style={styles.ratingContainer}>
        <Text style={[styles.rating, { color: ratingColor }]}>
          ⭐ {item.rating}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>클리닉 리스트</Text>
      <FlatList
        data={mockClinics}
        renderItem={renderClinic}
        keyExtractor={item => item.id}
        style={styles.list}
      />
    </View>
  );
};

export default ClinicList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  list: {
    flex: 1,
  },
  clinicItem: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  clinicInfo: {
    flex: 1,
  },
  clinicName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  clinicLocation: {
    fontSize: 14,
  },
  ratingContainer: {
    alignItems: 'flex-end',
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
  },
});
