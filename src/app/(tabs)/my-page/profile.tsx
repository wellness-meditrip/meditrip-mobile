import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

const Profile = () => {
  // 다크모드 색상 적용
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor(
    { light: '#666', dark: '#9BA1A6' },
    'text'
  );
  const borderColor = useThemeColor(
    { light: '#f0f0f0', dark: '#2C2C2E' },
    'text'
  );
  const avatarBackgroundColor = useThemeColor(
    { light: '#e0e0e0', dark: '#3A3A3C' },
    'background'
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View
        style={[
          styles.profileSection,
          { backgroundColor: cardBackgroundColor },
        ]}
      >
        <View style={styles.avatarContainer}>
          <View
            style={[styles.avatar, { backgroundColor: avatarBackgroundColor }]}
          >
            <Text style={styles.avatarText}>👤</Text>
          </View>
        </View>
        <Text style={[styles.name, { color: textColor }]}>사용자 이름</Text>
        <Text style={[styles.email, { color: secondaryTextColor }]}>
          user@example.com
        </Text>
      </View>

      <View
        style={[styles.infoSection, { backgroundColor: cardBackgroundColor }]}
      >
        <View style={[styles.infoItem, { borderBottomColor: borderColor }]}>
          <Text style={[styles.infoLabel, { color: secondaryTextColor }]}>
            전화번호
          </Text>
          <Text style={[styles.infoValue, { color: textColor }]}>
            010-1234-5678
          </Text>
        </View>
        <View style={[styles.infoItem, { borderBottomColor: borderColor }]}>
          <Text style={[styles.infoLabel, { color: secondaryTextColor }]}>
            생년월일
          </Text>
          <Text style={[styles.infoValue, { color: textColor }]}>
            1990년 1월 1일
          </Text>
        </View>
        <View style={[styles.infoItem, { borderBottomColor: borderColor }]}>
          <Text style={[styles.infoLabel, { color: secondaryTextColor }]}>
            주소
          </Text>
          <Text style={[styles.infoValue, { color: textColor }]}>
            서울시 강남구
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileSection: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
  },
  infoSection: {
    padding: 20,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontSize: 16,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
});
