import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const Dashboard = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>대시보드</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>오늘의 예약</Text>
        <Text style={styles.cardContent}>예약된 일정이 없습니다.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>최근 방문</Text>
        <Text style={styles.cardContent}>서울대학교병원 - 2024년 1월 15일</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>건강 상태</Text>
        <Text style={styles.cardContent}>양호</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>다음 예약</Text>
        <Text style={styles.cardContent}>예정된 예약이 없습니다.</Text>
      </View>
    </ScrollView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
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
    color: '#333',
  },
  cardContent: {
    fontSize: 16,
    color: '#666',
  },
});
