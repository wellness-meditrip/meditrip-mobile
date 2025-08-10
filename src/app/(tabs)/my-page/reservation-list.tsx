import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useSafeRouter } from '@/src/shared/lib/safe-router';

import { BoxLayout } from '@/src/shared/ui/box-layout';

import ReviewModal from '@/src/shared/ui/ReviewModal';
import { useLocalSearchParams } from 'expo-router';

// 예약 상태 타입
type ReservationStatus = '예약 완료' | '예약 취소' | '방문 완료';

// 예약 데이터 타입
interface Reservation {
  id: string;
  clinicName: string;
  location: string;
  practitioner: string;
  treatment: string;
  visitDate: string;
  visitTime: string;
  status: ReservationStatus;
  canBookAgain?: boolean;
  canCancel?: boolean;
  canWriteReview?: boolean;
  canViewReview?: boolean;
}

// 목 데이터
const MOCK_RESERVATIONS: Reservation[] = [
  {
    id: '1',
    clinicName: '우주연 한의원',
    location: '서울 종로구',
    practitioner: '우주연 원장님',
    treatment: '다이어트 패키지',
    visitDate: '25.08.02 (토)',
    visitTime: '오후 14:00',
    status: '예약 완료',
  },
  {
    id: '2',
    clinicName: '우주연 한의원',
    location: '서울 종로구',
    practitioner: '우주연 원장님',
    treatment: '다이어트 패키지',
    visitDate: '25.07.29 (화)',
    visitTime: '오전 11:00',
    status: '예약 완료',
    canBookAgain: true,
    canCancel: true,
  },
  {
    id: '3',
    clinicName: '우주연 한의원',
    location: '서울 종로구',
    practitioner: '우주연 원장님',
    treatment: '다이어트 패키지',
    visitDate: '25.07.17 (목)',
    visitTime: '오전 10:00',
    status: '예약 취소',
  },
  {
    id: '4',
    clinicName: '우주연 한의원',
    location: '서울 종로구',
    practitioner: '우주연 원장님',
    treatment: '다이어트 패키지',
    visitDate: '25.07.02 (수)',
    visitTime: '오후 16:00',
    status: '방문 완료',
    canBookAgain: true,
    canWriteReview: true,
  },
  {
    id: '5',
    clinicName: '우주연 한의원',
    location: '서울 종로구',
    practitioner: '우주연 원장님',
    treatment: '다이어트 패키지',
    visitDate: '25.07.02 (수)',
    visitTime: '오후 16:00',
    status: '방문 완료',
    canBookAgain: true,
    canViewReview: true,
  },
];

const ReservationList = () => {
  const [sortOrder, setSortOrder] = useState<'최신순' | '오래된순'>('최신순');
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState<
    string | null
  >(null);
  const { isReviewWrite } = useLocalSearchParams();

  // 정렬된 예약 목록
  const sortedReservations = [...MOCK_RESERVATIONS].sort((a, b) => {
    // 날짜 문자열을 Date 객체로 변환 (예: "25.08.02" -> 2025-08-02)
    const getDateFromString = (dateStr: string) => {
      const [year, month, day] = dateStr.split('.').map(num => parseInt(num));
      return new Date(2000 + year, month - 1, day);
    };

    const dateA = getDateFromString(a.visitDate.split(' ')[0]);
    const dateB = getDateFromString(b.visitDate.split(' ')[0]);

    if (sortOrder === '최신순') {
      return dateB.getTime() - dateA.getTime(); // 최신순 (내림차순)
    } else {
      return dateA.getTime() - dateB.getTime(); // 오래된순 (오름차순)
    }
  });

  const reviews = isReviewWrite
    ? sortedReservations.filter(item => item.canWriteReview)
    : sortedReservations;

  const getStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case '예약 완료':
        return '#FF6B35';
      case '예약 취소':
        return '#9CA3AF';
      case '방문 완료':
        return '#10B981';
      default:
        return '#9CA3AF';
    }
  };

  const getStatusBackgroundColor = (status: ReservationStatus) => {
    switch (status) {
      case '예약 완료':
        return '#FFF3F0';
      case '예약 취소':
        return '#F3F4F6';
      case '방문 완료':
        return '#F0FDF4';
      default:
        return '#F3F4F6';
    }
  };

  const handleSortToggle = () => {
    setSortOrder(sortOrder === '최신순' ? '오래된순' : '최신순');
  };

  const handleBookAgain = (reservationId: string) => {
    alert('준비중입니다');
    // 예약 페이지로 이동하는 로직
  };

  const handleCancelBooking = (reservationId: string) => {
    alert('준비중입니다');
    // 예약 취소 로직
  };

  const handleWriteReview = (reservationId: string) => {
    console.log('리뷰 작성하기:', reservationId);
    setSelectedReservationId(reservationId);
    setReviewModalVisible(true);
  };

  const handleCloseReviewModal = () => {
    setReviewModalVisible(false);
    setSelectedReservationId(null);
  };

  const handleViewReview = (reservationId: string) => {
    alert('준비중입니다');
    // 리뷰 보기 페이지로 이동하는 로직
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          총 예약 {MOCK_RESERVATIONS.length}건
        </Text>
        <TouchableOpacity style={styles.sortButton} onPress={handleSortToggle}>
          <Text style={styles.sortButtonText}>{sortOrder}</Text>
          <Text style={styles.sortIcon}>↕</Text>
        </TouchableOpacity>
      </View>

      {/* 예약 목록 */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <BoxLayout horizontal={16}>
          {reviews.map(reservation => (
            <View key={reservation.id} style={styles.reservationCard}>
              {/* 클리닉 정보 */}
              <View style={styles.clinicInfo}>
                <Text style={styles.clinicName}>{reservation.clinicName}</Text>
                <Text style={styles.locationInfo}>
                  {reservation.location} | {reservation.practitioner}
                </Text>
                <Text style={styles.treatmentInfo}>
                  진료 항목 {reservation.treatment}
                </Text>
              </View>

              {/* 방문 일자 */}
              <View style={styles.visitInfo}>
                <Text style={styles.visitDateText}>
                  방문 일자 {reservation.visitDate} {reservation.visitTime}
                </Text>
              </View>

              {/* 상태 버튼 */}
              <View style={styles.statusContainer}>
                <View
                  style={[
                    styles.statusButton,
                    {
                      backgroundColor: getStatusBackgroundColor(
                        reservation.status
                      ),
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusColor(reservation.status) },
                    ]}
                  >
                    {reservation.status}
                  </Text>
                </View>
              </View>

              {/* 액션 버튼들 */}
              {(reservation.canBookAgain ||
                reservation.canCancel ||
                reservation.canWriteReview ||
                reservation.canViewReview) && (
                <View style={styles.actionButtons}>
                  {reservation.canBookAgain && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleBookAgain(reservation.id)}
                    >
                      <Text style={styles.actionButtonText}>다시 예약하기</Text>
                    </TouchableOpacity>
                  )}
                  {reservation.canCancel && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleCancelBooking(reservation.id)}
                    >
                      <Text style={styles.actionButtonText}>예약 취소하기</Text>
                    </TouchableOpacity>
                  )}
                  {reservation.canWriteReview && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleWriteReview(reservation.id)}
                    >
                      <Text style={styles.actionButtonText}>리뷰 작성하기</Text>
                    </TouchableOpacity>
                  )}
                  {reservation.canViewReview && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleViewReview(reservation.id)}
                    >
                      <Text style={styles.actionButtonText}>
                        작성 리뷰 보기
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          ))}
        </BoxLayout>
      </ScrollView>

      {/* 리뷰 작성 모달 */}
      <ReviewModal
        visible={reviewModalVisible}
        onClose={handleCloseReviewModal}
        reservationId={selectedReservationId || undefined}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7E2D4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#374151',
    marginRight: 4,
  },
  sortIcon: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  scrollView: {
    flex: 1,
  },
  reservationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  clinicInfo: {
    marginBottom: 8,
  },
  clinicName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  locationInfo: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  treatmentInfo: {
    fontSize: 14,
    color: '#6B7280',
  },
  visitInfo: {
    marginBottom: 12,
  },
  visitDateText: {
    fontSize: 14,
    color: '#374151',
  },
  statusContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
});

export default ReservationList;
