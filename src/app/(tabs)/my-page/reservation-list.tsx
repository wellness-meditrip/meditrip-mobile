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
import { useGetReservationList, Reservation } from '../../../shared/config';

// 예약 상태 타입 (API 스키마에 맞춤)
type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

// UI용 예약 데이터 타입
interface ReservationUI {
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

const ReservationList = () => {
  const [sortOrder, setSortOrder] = useState<'최신순' | '오래된순'>('최신순');
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState<
    string | null
  >(null);
  const { isReviewWrite } = useLocalSearchParams();
  const { data, isLoading, error } = useGetReservationList(1);

  // API에서 받아온 예약 데이터
  const reservations = data?.data?.items || [];

  // 테스트용으로 상태를 다양하게 변경 (실제 운영시에는 제거)
  const modifiedReservations = reservations.map((reservation, index) => {
    // 첫 번째는 예약 완료, 두 번째는 예약 완료, 세 번째는 예약 취소, 네 번째는 방문 완료, 다섯 번째는 방문 완료
    const statusMap = [
      'CONFIRMED',
      'CONFIRMED',
      'CANCELLED',
      'COMPLETED',
      'COMPLETED',
    ];
    const status = statusMap[index] || reservation.status;

    return {
      ...reservation,
      status: status as 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED',
    };
  });

  // API 데이터를 UI 데이터로 변환하는 함수
  const transformReservationData = (
    reservation: Reservation
  ): ReservationUI => {
    // 날짜 형식을 변환 (YYYY-MM-DD -> YY.MM.DD (요일))
    const formatDate = (dateStr: string): string => {
      const date = new Date(dateStr);
      const year = date.getFullYear().toString().slice(-2);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
      const weekday = weekdays[date.getDay()];
      return `${year}.${month}.${day} (${weekday})`;
    };

    // 시간 형식을 변환 (HH:MM -> 오전/오후 HH:MM)
    const formatTime = (timeStr: string): string => {
      const [hour, minute] = timeStr.split(':');
      const hourNum = parseInt(hour);
      if (hourNum < 12) {
        return `오전 ${hour}:${minute}`;
      } else if (hourNum === 12) {
        return `오후 ${hour}:${minute}`;
      } else {
        return `오후 ${hourNum - 12}:${minute}`;
      }
    };

    return {
      id: reservation.reservation_id.toString(),
      clinicName: reservation.hospital_name,
      location: '서울 종로구', // API에 위치 정보가 없어서 기본값 사용
      practitioner: reservation.doctor_name,
      treatment: reservation.symptoms || '진료 상담',
      visitDate: formatDate(reservation.reservation_date),
      visitTime: formatTime(reservation.reservation_time),
      status: reservation.status,
      canBookAgain: reservation.status === 'COMPLETED',
      canCancel: reservation.status === 'CONFIRMED',
      canWriteReview: reservation.status === 'COMPLETED',
      canViewReview: false, // API에 리뷰 정보가 없어서 기본값 사용
    };
  };

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>예약 목록을 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            예약 목록을 불러오는데 실패했습니다.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // API 데이터를 UI 데이터로 변환
  const transformedReservations = modifiedReservations.map(
    transformReservationData
  );

  // 정렬된 예약 목록
  const sortedReservations = [...transformedReservations].sort((a, b) => {
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
      case 'CONFIRMED':
        return '#FF6B35';
      case 'CANCELLED':
        return '#9CA3AF';
      case 'COMPLETED':
        return '#10B981';
      default:
        return '#9CA3AF';
    }
  };

  const getStatusBackgroundColor = (status: ReservationStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return '#FFF3F0';
      case 'CANCELLED':
        return '#F3F4F6';
      case 'COMPLETED':
        return '#F0FDF4';
      default:
        return '#F3F4F6';
    }
  };

  // 상태를 한글로 변환하는 함수
  const getStatusText = (status: ReservationStatus): string => {
    switch (status) {
      case 'PENDING':
        return '예약 대기';
      case 'CONFIRMED':
        return '예약 완료';
      case 'CANCELLED':
        return '예약 취소';
      case 'COMPLETED':
        return '방문 완료';
      default:
        return '예약 대기';
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
          {isReviewWrite
            ? `작성할 수 있는 리뷰 ${transformedReservations.filter(item => item.canWriteReview).length}건`
            : `총 예약 ${reservations.length}건`}
        </Text>
        {!isReviewWrite && (
          <TouchableOpacity
            style={styles.sortButton}
            onPress={handleSortToggle}
          >
            <Text style={styles.sortButtonText}>{sortOrder}</Text>
            <Text style={styles.sortIcon}>↕</Text>
          </TouchableOpacity>
        )}
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
                    {getStatusText(reservation.status)}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7E2D4',
  },
  loadingText: {
    fontSize: 18,
    color: '#374151',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7E2D4',
  },
  errorText: {
    fontSize: 18,
    color: '#374151',
  },
});

export default ReservationList;
