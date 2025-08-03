import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { Image } from 'expo-image';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { BoxLayout } from '@/src/shared/ui/box-layout';
import { ARROW_LEFT } from '@/assets/icons/components/header';
import { Button } from '../../../shared/ui/custom';
import { SafeRouterHandler, useSafeRouter } from '../../../shared/lib';
import { useAtom } from 'jotai';
import {
  profileImageAtom,
  profileInfoAtom,
} from '@/src/shared/lib/profile-store';

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
  { id: '3', text: '이용약관' },
  { id: '4', text: '로그아웃' },
];

// 유틸리티 함수
const renderStars = (rating: number) => '★'.repeat(rating);

// 컴포넌트들
const ProfileSection = ({ safeRouter }: { safeRouter: SafeRouterHandler }) => {
  const [profileImage] = useAtom(profileImageAtom);
  const [profileInfo] = useAtom(profileInfoAtom);

  return (
    <BoxLayout horizontal={16}>
      <View style={styles.profileContainer}>
        <View style={styles.profileInfo}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Image
              source={require('@/assets/images/react-logo.png')}
              style={styles.profileImage}
            />
          )}
          <View style={styles.profileText}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{profileInfo.nickname}</Text>
            </View>
            <View style={styles.countryInfo}>
              <View style={styles.japanFlag} />
              <Text style={styles.countryText}>{profileInfo.country}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => safeRouter.push('/my-page/profile')}
          >
            <Text style={styles.editIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BoxLayout>
  );
};

const ReservationSection = () => (
  <BoxLayout horizontal={16}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Reservation List</Text>
      <View style={styles.sectionIcon}>
        <View style={styles.purpleCircle}>
          <Text style={styles.purpleCircleText}>J</Text>
        </View>
        <ARROW_LEFT style={{ transform: [{ rotate: '180deg' }] }} />
      </View>
    </View>
    <View style={styles.reservationList}>
      {MOCK_RESERVATIONS.map(reservation => (
        <View key={reservation.id} style={styles.reservationCard}>
          <View style={styles.reservationInfo}>
            <Text style={styles.clinicName}>{reservation.clinicName}</Text>
            <Text style={styles.treatmentName}>{reservation.treatment}</Text>
          </View>
          <View style={styles.reservationTime}>
            <Text style={styles.dateText}>{reservation.date}</Text>
            <Text style={styles.timeText}>at {reservation.time}</Text>
          </View>
        </View>
      ))}
    </View>
  </BoxLayout>
);

const ReviewSection = () => (
  <BoxLayout horizontal={16}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>My Review</Text>
      <ARROW_LEFT style={{ transform: [{ rotate: '180deg' }] }} />
    </View>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.reviewScroll}
    >
      {MOCK_REVIEWS.map(review => (
        <View key={review.id} style={styles.reviewCard}>
          <Image source={review.image} style={styles.reviewImage} />
          <View style={styles.reviewOverlay}>
            <Text style={styles.reviewStars}>{renderStars(review.rating)}</Text>
            <View style={styles.reviewText}>
              <Text style={styles.reviewClinicName}>{review.clinicName}</Text>
              <Text style={styles.reviewTreatment}>{review.treatment}</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  </BoxLayout>
);

const MenuSection = ({ safeRouter }: { safeRouter: SafeRouterHandler }) => (
  <BoxLayout horizontal={16}>
    <View style={styles.menuContainer}>
      {MENU_ITEMS.map(item => (
        <TouchableOpacity key={item.id} style={styles.menuItem}>
          <Text style={styles.menuText}>{item.text}</Text>
        </TouchableOpacity>
      ))}
      <Button onPress={() => safeRouter.push('/login')}>
        <Text>로그인</Text>
      </Button>
    </View>
  </BoxLayout>
);

const MyPage = () => {
  const safeRouter = useSafeRouter();
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
    >
      <ProfileSection safeRouter={safeRouter} />
      <ReservationSection />
      <ReviewSection />
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
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileText: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  countryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  japanFlag: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF0000',
    marginRight: 8,
  },
  countryText: {
    fontSize: 14,
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
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reservationInfo: {
    flex: 1,
  },
  clinicName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  treatmentName: {
    fontSize: 14,
    color: '#666',
  },
  reservationTime: {
    alignItems: 'flex-end',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
  },

  // 리뷰 섹션 스타일
  reviewScroll: {
    marginTop: 8,
  },
  reviewCard: {
    width: 200,
    height: 120,
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  reviewImage: {
    width: '100%',
    height: '100%',
  },
  reviewOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'space-between',
    padding: 12,
  },
  reviewStars: {
    color: '#FFD700',
    fontSize: 16,
  },
  reviewText: {
    position: 'absolute',
    bottom: 12,
    left: 12,
  },
  reviewClinicName: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  reviewTreatment: {
    color: 'white',
    fontSize: 12,
  },

  // 메뉴 섹션 스타일
  menuContainer: {
    marginTop: 24,
  },
  menuItem: {
    paddingVertical: 12,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
});
