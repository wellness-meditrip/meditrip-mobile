import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

const Dashboard = () => {
  // 다크모드 색상 적용
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const cardTitleColor = useThemeColor({}, 'text');
  const cardContentColor = useThemeColor(
    { light: '#666', dark: '#9BA1A6' },
    'text'
  );
  const borderColor = useThemeColor(
    { light: '#e0e0e0', dark: '#2C2C2E' },
    'text'
  );
  const shadowColor = useThemeColor({}, 'text');

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: cardBackgroundColor,
            borderBottomColor: borderColor,
          },
        ]}
      >
        <Text style={[styles.title, { color: textColor }]}>대시보드</Text>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: cardBackgroundColor, shadowColor },
        ]}
      >
        <Text style={[styles.cardTitle, { color: cardTitleColor }]}>
          오늘의 예약
        </Text>
        <Text style={[styles.cardContent, { color: cardContentColor }]}>
          예약된 일정이 없습니다.
        </Text>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: cardBackgroundColor, shadowColor },
        ]}
      >
        <Text style={[styles.cardTitle, { color: cardTitleColor }]}>
          최근 방문
        </Text>
        <Text style={[styles.cardContent, { color: cardContentColor }]}>
          서울대학교병원 - 2024년 1월 15일
        </Text>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: cardBackgroundColor, shadowColor },
        ]}
      >
        <Text style={[styles.cardTitle, { color: cardTitleColor }]}>
          건강 상태
        </Text>
        <Text style={[styles.cardContent, { color: cardContentColor }]}>
          양호
        </Text>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: cardBackgroundColor, shadowColor },
        ]}
      >
        <Text style={[styles.cardTitle, { color: cardTitleColor }]}>
          다음 예약
        </Text>
        <Text style={[styles.cardContent, { color: cardContentColor }]}>
          예정된 예약이 없습니다.
        </Text>
      </View>
    </ScrollView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  card: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardContent: {
    fontSize: 16,
  },
});
