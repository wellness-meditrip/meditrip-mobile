import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { BoxLayout } from '@/src/shared/ui/box-layout';
import { ARROW_LEFT } from '@/assets/icons/components/header';
import { Button } from '../../../shared/ui/custom';
import { SafeRouterHandler, useSafeRouter } from '../../../shared/lib';
import { useAtom } from 'jotai';
import {
  userAtom,
  isLoggedInAtom,
  clearUserData,
} from '@/src/shared/lib/profile-store';
import {
  useGetMyReviews,
  useGetReservationList,
} from '../../../shared/config/api-hooks';
import { api } from '../../../shared/config/api-client';
import { Icon } from '@/components/icons';
import { ColorPalette } from '@/constants/Colors';
import { getSafeImageUri } from '@/src/shared/lib/image-utils';

// 상수 데이터
const MOCK_RESERVATIONS = [
  {
    id: '1',
    clinicName: 'Healing Clinic',
    treatment: 'Weight Loss Treatment',
    date: 'March 20, 2024',
    time: '2:00 PM',
  },
  {
    id: '2',
    clinicName: 'Healing Clinic',
    treatment: 'Weight Loss Treatment',
    date: 'March 20, 2024',
    time: '2:00 PM',
  },
];

const MOCK_REVIEWS = [
  {
    id: '1',
    clinicName: 'Healing Clinic',
    treatment: 'Weight Loss Treatment',
    rating: 5,
    image: require('@/assets/images/react-logo.png'),
  },
  {
    id: '2',
    clinicName: 'Healing Clinic',
    treatment: 'Weight Loss Treatment',
    rating: 5,
    image: require('@/assets/images/react-logo.png'),
  },
  {
    id: '3',
    clinicName: 'Healing Clinic',
    treatment: 'Weight Loss Treatment',
    rating: 5,
    image: require('@/assets/images/react-logo.png'),
  },
];

const MENU_ITEMS = [
  { id: '1', text: '앱 설정' },
  { id: '2', text: '공지사항' },
  { id: '3', text: '개인정보처리방침' },
  { id: '4', text: '이용약관' },
  { id: '5', text: '로그아웃' },
];

// 유틸리티 함수
const renderStars = (rating: number) => '★'.repeat(rating);

// 컴포넌트들
const ProfileSection = ({ safeRouter }: { safeRouter: SafeRouterHandler }) => {
  const [user] = useAtom(userAtom);

  // 사용자 정보
  const displayName = user?.displayName || user?.nickname || '사용자';
  const displayCountry = user?.country || '한국';

  return (
    <BoxLayout horizontal={16}>
      <View style={styles.profileContainer}>
        <View style={styles.profileInfo}>
          {user?.profileImage ? (
            <Image
              source={{ uri: getSafeImageUri(user.profileImage) }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profileImage}>
              <Icon name='ic-mypage' size={50} color={ColorPalette.tertiary} />
            </View>
          )}
          <View style={styles.profileText}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{displayName}</Text>
            </View>
            <View style={styles.countryInfo}>
              {/* 국가 아이콘 - 한국 일본 미국 - 유저 정보에서 가져와서 조건부 렌더링*/}
              {displayCountry === '한국' && (
                <Text style={styles.countryFlag}>🇰🇷</Text>
              )}
              {displayCountry === '일본' && (
                <Text style={styles.countryFlag}>🇯🇵</Text>
              )}
              {displayCountry === '미국' && (
                <Text style={styles.countryFlag}>🇺🇸</Text>
              )}
              <Text style={styles.countryText}>{displayCountry}</Text>
            </View>
          </View>
          <Button
            style={styles.editButton}
            onPress={() => safeRouter.push('/my-page/profile')}
          >
            <Icon name='ic-edit' size={24} color={ColorPalette.primary} />
          </Button>
        </View>
      </View>
    </BoxLayout>
  );
};

const ReservationSection = ({
  safeRouter,
}: {
  safeRouter: SafeRouterHandler;
}) => {
  // const [user] = useAtom(userAtom);
  const { data, isLoading, error } = useGetReservationList(1);

  // API 데이터를 UI용으로 변환하는 함수
  const transformReservationData = (apiReservation: {
    reservation_id: number;
    hospital_id: number;
    hospital_name: string;
    doctor_id: number;
    doctor_name: string;
    user_id: number;
    symptoms: string;
    reservation_date: string;
    reservation_time: string;
    status: string;
    contact_email: string;
    contact_phone: string;
    interpreter_language: string;
    created_at: string;
    image_count: number;
  }) => {
    const date = new Date(apiReservation.reservation_date);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const dayOfWeek = days[date.getDay()];
    const formattedDate = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} (${dayOfWeek})`;

    const time = apiReservation.reservation_time;
    const formattedTime = time.substring(0, 5); // "HH:MM" 형식으로 변환

    // 상태에 따른 텍스트 변환
    const getStatusText = (status: string) => {
      switch (status) {
        case 'PENDING':
          return '예약 완료';
        case 'CONFIRMED':
          return '예약 확정';
        case 'CANCELLED':
          return '예약 취소';
        case 'COMPLETED':
          return '진료 완료';
        default:
          return status;
      }
    };

    // 상태에 따른 색상
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'PENDING':
          return '#FFA500'; // 주황색
        case 'CONFIRMED':
          return '#4CAF50'; // 초록색
        case 'CANCELLED':
          return '#9E9E9E'; // 회색
        case 'COMPLETED':
          return '#2196F3'; // 파란색
        default:
          return '#666';
      }
    };

    return {
      id: apiReservation.reservation_id.toString(),
      hospitalName: apiReservation.hospital_name,
      doctorName: apiReservation.doctor_name,
      date: formattedDate,
      time: formattedTime,
      status: getStatusText(apiReservation.status),
      statusColor: getStatusColor(apiReservation.status),
      symptoms: apiReservation.symptoms,
      language: apiReservation.interpreter_language,
      hospitalId: apiReservation.hospital_id,
      doctorId: apiReservation.doctor_id,
    };
  };

  // 표시할 예약 데이터 (API 데이터가 있으면 사용, 없으면 빈 배열)
  const displayReservations = data?.data?.items
    ? data.data.items.map(transformReservationData).slice(0, 2)
    : [];

  return (
    <BoxLayout horizontal={24}>
      <Button
        style={styles.sectionHeader}
        onPress={() => safeRouter.push('/my-page/reservation-list')}
      >
        <Text style={styles.sectionTitle}>예약 목록</Text>
        <View style={styles.sectionIcon}>
          <ARROW_LEFT style={{ transform: [{ rotate: '180deg' }] }} />
        </View>
      </Button>
      <View style={styles.reservationList}>
        {displayReservations.map(reservation => (
          <View key={reservation.id} style={styles.reservationCard}>
            <View style={styles.reservationInfo}>
              <Text style={styles.hospitalName}>
                {reservation.hospitalName}
              </Text>
              <View style={styles.reservationHeader}>
                <Text style={styles.reservationDateTime}>
                  {reservation.date} {reservation.time}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: reservation.statusColor },
                  ]}
                >
                  <Text style={styles.statusText}>{reservation.status}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
        {displayReservations.length === 0 && !isLoading && (
          <View style={styles.emptyReservationCard}>
            <Text style={styles.emptyReservationText}>
              예약 내역이 없습니다.
            </Text>
          </View>
        )}
        {isLoading && (
          <View style={styles.emptyReservationCard}>
            <Text style={styles.emptyReservationText}>로딩 중...</Text>
          </View>
        )}
      </View>
    </BoxLayout>
  );
};

const ReviewSection = ({ safeRouter }: { safeRouter: SafeRouterHandler }) => {
  const [user] = useAtom(userAtom);
  const { data, isLoading, error } = useGetMyReviews(1);

  // API 데이터를 UI용으로 변환하는 함수
  const transformReviewData = (apiReview: {
    review_id: number;
    doctor_name: string;
    created_at: string;
    title: string;
    rating: number;
  }) => {
    const date = new Date(apiReview.created_at);
    const formattedDate = `${date.getFullYear().toString().slice(-2)}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} 방문`;

    return {
      id: apiReview.review_id.toString(),
      doctorName: `${apiReview.doctor_name} 원장님`,
      visitDate: formattedDate,
      reviewText: apiReview.title,
      rating: apiReview.rating,
    };
  };

  // 표시할 리뷰 데이터 (API 데이터가 있으면 사용, 없으면 빈 배열)
  const displayReviews = data?.items
    ? data.items.map(transformReviewData).slice(0, 2)
    : [];

  return (
    <BoxLayout horizontal={24}>
      <Button
        style={styles.sectionHeader}
        onPress={() => safeRouter.push('/my-page/review-list')}
      >
        <Text style={styles.sectionTitle}>내가 작성한 리뷰</Text>
        <ARROW_LEFT style={{ transform: [{ rotate: '180deg' }] }} />
      </Button>
      <View style={styles.reviewList}>
        {displayReviews.map(
          (review: {
            id: string;
            doctorName: string;
            visitDate: string;
            reviewText: string;
            rating: number;
          }) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewDoctorName}>{review.doctorName}</Text>
                <Text style={styles.reviewVisitDate}>{review.visitDate}</Text>
              </View>
              <Text
                style={styles.reviewText}
                numberOfLines={2}
                ellipsizeMode='tail'
              >
                {review.reviewText}
              </Text>
            </View>
          )
        )}
        {displayReviews.length === 0 && !isLoading && (
          <View style={styles.emptyReviewCard}>
            <Text style={styles.emptyReviewText}>작성한 리뷰가 없습니다.</Text>
          </View>
        )}
        {isLoading && (
          <View style={styles.emptyReviewCard}>
            <Text style={styles.emptyReviewText}>로딩 중...</Text>
          </View>
        )}
      </View>
    </BoxLayout>
  );
};

const MenuSection = ({ safeRouter }: { safeRouter: SafeRouterHandler }) => {
  const [, setUser] = useAtom(userAtom);
  const [, setIsLoggedIn] = useAtom(isLoggedInAtom);

  const handleLogout = async () => {
    // 저장된 사용자 데이터 삭제
    await clearUserData();

    // API 토큰 제거
    await api.removeAuthToken();

    // Jotai 상태 초기화
    setUser(null);
    setIsLoggedIn(false);

    Alert.alert('로그아웃 완료', '로그아웃이 완료되었습니다.');

    // 로그인 화면으로 이동
    safeRouter.push('/(auth)/login');
  };

  return (
    <BoxLayout horizontal={24}>
      {MENU_ITEMS.map(item => (
        <TouchableOpacity
          key={item.id}
          style={styles.menuItem}
          onPress={item.text === '로그아웃' ? handleLogout : undefined}
        >
          <Text style={styles.menuText}>{item.text}</Text>
        </TouchableOpacity>
      ))}
    </BoxLayout>
  );
};

const MyPage = () => {
  const safeRouter = useSafeRouter();
  const [isLoggedIn] = useAtom(isLoggedInAtom);

  // 토큰이 없으면 빈 화면 렌더링
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      const authToken = await api.loadAuthToken();
      setToken(authToken);
    };

    loadToken();
  }, []);

  // 로딩 중이거나 토큰이 없으면 로그인 필요 화면
  if (!token || !isLoggedIn) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>로그인이 필요합니다.</Text>
          <Button
            style={styles.loginButton}
            onPress={() => safeRouter.push('/(auth)/login')}
          >
            <Text style={styles.loginButtonText}>로그인 페이지로 이동</Text>
          </Button>
        </View>
      </View>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
    >
      <ProfileSection safeRouter={safeRouter} />
      <ReservationSection safeRouter={safeRouter} />
      <ReviewSection safeRouter={safeRouter} />
      <MenuSection safeRouter={safeRouter} />
    </ParallaxScrollView>
  );
};

export default MyPage;

const styles = StyleSheet.create({
  // 프로필 섹션 스타일
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 40,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ColorPalette.bgDefault,
  },
  profileText: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginStatus: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 8,
    fontWeight: '500',
  },
  countryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryFlag: {
    fontSize: 24,
    marginTop: 0,
    marginRight: 2,
  },
  countryText: {
    fontSize: 16,
    color: '#666',
  },
  editButton: {
    padding: 8,
  },
  editIcon: {
    fontSize: 14,
  },

  // 섹션 헤더 스타일
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  purpleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  purpleCircleText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // 예약 섹션 스타일
  reservationList: {
    gap: 12,
  },
  reservationCard: {
    backgroundColor: ColorPalette.bgSurface1,
    padding: 16,
    borderRadius: 8,
  },
  reservationInfo: {
    flex: 1,
  },
  hospitalName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  reservationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reservationDateTime: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  symptomsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  reservationDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  languageText: {
    fontSize: 12,
    color: '#666',
  },
  emptyReservationCard: {
    backgroundColor: ColorPalette.bgDefault,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyReservationText: {
    fontSize: 14,
    color: '#666',
  },

  // 리뷰 섹션 스타일
  reviewList: {
    gap: 12,
  },
  reviewCard: {
    backgroundColor: ColorPalette.bgSurface2,
    padding: 16,
    borderRadius: 8,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewDoctorName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewVisitDate: {
    fontSize: 14,
    color: '#666',
  },
  reviewText: {
    fontSize: 14,
    color: '#333',
  },
  emptyReviewCard: {
    backgroundColor: ColorPalette.bgDefault,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyReviewText: {
    fontSize: 14,
    color: '#666',
  },

  // 메뉴 섹션 스타일

  menuItem: {
    paddingVertical: 10,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  // 빈 화면 스타일
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#A1CEDC',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
