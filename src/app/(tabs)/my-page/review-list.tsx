import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  FlatList,
  Image,
  Modal,
} from 'react-native';
import { useSafeRouter } from '@/src/shared/lib/safe-router';
import { BoxLayout } from '@/src/shared/ui/box-layout';
import {
  useDeleteReview,
  useGetMyReviews,
} from '@/src/shared/config/api-hooks';
import { useAtom } from 'jotai';
import { userAtom } from '../../../shared/lib/profile-store';
import { Button } from '../../../shared/ui/custom';
import { StarRating } from '@/src/shared/ui/StarRating';
import * as FileSystem from 'expo-file-system';
import { ColorPalette } from '../../../../constants/Colors';
import { Icon } from '../../../../components/icons';
import {
  processImageSource,
  getSafeImageUri,
} from '@/src/shared/lib/image-utils';

// 리뷰 상태 타입
type ReviewStatus = '작성됨' | '작성 가능' | '작성 불가';

// API 리뷰 데이터 타입
interface ApiReviewSchema {
  created_at: string;
  doctor_id: number;
  doctor_name: string;
  hospital_id: number;
  image_count: number;
  is_verified: boolean;
  keyword_count: number;
  rating: number;
  review_id: number;
  title: string;
  user_id: number;
  images?: (
    | {
        image_url?: string;
        image_data?: string;
        image_type?: string;
        original_filename?: string;
        file_size?: number;
        width?: number;
        height?: number;
        image_order?: number;
        alt_text?: string;
        created_at?: string;
      }
    | string
  )[]; // 이미지 URL이 문자열일 수도 있음
}

// UI용 리뷰 데이터 타입
interface ReviewSchema {
  id: string;
  clinicName: string;
  practitioner: string;
  visitDate: string;
  rating: number;
  reviewText?: string;
  tags?: string[];
  images?: string[]; // 이미지 URL 배열로 변경
  isExpanded?: boolean;
  status: ReviewStatus;
}

// 목 데이터 (API 구조에 맞게 수정)
const MOCK_REVIEWS: ApiReviewSchema[] = [
  {
    created_at: '2025-08-05T17:41:17.980206',
    doctor_id: 1,
    doctor_name: '우주연',
    hospital_id: 1,
    image_count: 1,
    is_verified: false,
    keyword_count: 3,
    rating: 5,
    review_id: 1,
    title:
      '첫 상담부터 진심 어린 설명과 맞춤형 접근이 인상 깊었어요. 원장님께서 제 상황을 정말 꼼꼼하게 파악해주시고, 개인 맞춤형 치료 계획을 세워주셔서 정말 만족스러웠습니다. 특히 다이어트 패키지 치료를 받으면서 체중 감량뿐만 아니라 전반적인 건강 상태가 개선되는 것을 느낄 수 있었어요.',
    user_id: 1,
    images: [
      {
        image_url: 'https://drive.google.com/file/d/1ABC123/view',
        image_type: 'jpg',
        original_filename: 'review1.jpg',
        file_size: 1024000,
        width: 1920,
        height: 1080,
        image_order: 1,
        alt_text: '리뷰 이미지 1',
        created_at: '2025-08-05T17:41:17.980206',
      },
    ],
  },
  {
    created_at: '2025-08-04T10:30:00.000000',
    doctor_id: 1,
    doctor_name: '우주연',
    hospital_id: 1,
    image_count: 0,
    is_verified: true,
    keyword_count: 2,
    rating: 4.5,
    review_id: 2,
    title: '친절하고 전문적인 진료를 받았습니다.',
    user_id: 1,
    images: [], // 빈 배열로 명시
  },
  {
    created_at: '2025-08-03T14:20:00.000000',
    doctor_id: 1,
    doctor_name: '우주연',
    hospital_id: 1,
    image_count: 3,
    is_verified: false,
    keyword_count: 5,
    rating: 5,
    review_id: 3,
    title: '정말 만족스러운 진료였어요. 재방문 의향이 있습니다.',
    user_id: 1,
    images: [
      {
        image_url: 'https://drive.google.com/file/d/1DEF456/view',
        image_type: 'jpg',
        original_filename: 'review3_1.jpg',
        file_size: 2048000,
        width: 1920,
        height: 1080,
        image_order: 1,
        alt_text: '리뷰 이미지 3-1',
        created_at: '2025-08-03T14:20:00.000000',
      },
      {
        image_url: 'https://drive.google.com/file/d/1GHI789/view',
        image_type: 'jpg',
        original_filename: 'review3_2.jpg',
        file_size: 1536000,
        width: 1920,
        height: 1080,
        image_order: 2,
        alt_text: '리뷰 이미지 3-2',
        created_at: '2025-08-03T14:20:00.000000',
      },
    ],
  },
];

// API 데이터를 UI 데이터로 변환하는 함수
const transformApiDataToUI = async (
  apiData: ApiReviewSchema
): Promise<ReviewSchema> => {
  const date = new Date(apiData.created_at);
  const formattedDate = `${date.getFullYear().toString().slice(-2)}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} 방문`;

  // 이미지 URL 처리
  let imageUrls: string[] = [];
  if (apiData.images && apiData.images.length > 0) {
    console.log('이미지 데이터:', JSON.stringify(apiData.images, null, 2));
    imageUrls = apiData.images
      .map(image => {
        try {
          console.log('개별 이미지 데이터:', image, typeof image);
          // API 응답 구조에 따라 이미지 URL 처리
          if (typeof image === 'string' && image) {
            // 이미지가 문자열인 경우 (base64 또는 URL)
            if (image.startsWith('data:') || image.startsWith('http')) {
              return image;
            } else {
              return processImageSource(image);
            }
          } else if (
            typeof image === 'object' &&
            image &&
            'image_url' in image
          ) {
            // 이미지가 객체인 경우
            const imageObj = image as {
              image_url?: string;
              image_data?: string;
            };
            if (imageObj.image_url) {
              return processImageSource(imageObj.image_url);
            } else if (imageObj.image_data) {
              // base64 이미지 데이터가 있는 경우
              return `data:image/png;base64,${imageObj.image_data}`;
            }
          } else if (typeof image === 'object' && image && 'url' in image) {
            // 이미지가 객체인 경우 (url 필드 사용)
            const imageObj = image as { url?: string };
            if (imageObj.url) {
              return processImageSource(imageObj.url);
            }
          } else if (typeof image === 'object' && image && 'src' in image) {
            // 이미지가 객체인 경우 (src 필드 사용)
            const imageObj = image as { src?: string };
            if (imageObj.src) {
              return processImageSource(imageObj.src);
            }
          } else if (
            typeof image === 'object' &&
            image &&
            'image_data' in image
          ) {
            // image_data 필드만 있는 경우 (base64)
            const imageObj = image as { image_data?: string };
            if (imageObj.image_data) {
              return `data:image/png;base64,${imageObj.image_data}`;
            }
          }
          return null;
        } catch (error) {
          console.error('이미지 처리 중 오류:', error, image);
          return null;
        }
      })
      .filter((url): url is string => url !== null && url !== undefined);
  }

  return {
    id: apiData.review_id.toString(),
    clinicName: '우주연 한의원', // TODO: 병원 정보 API에서 가져오기
    practitioner: `${apiData.doctor_name} 원장님`,
    visitDate: formattedDate,
    rating: apiData.rating,
    reviewText: apiData.title,
    images: imageUrls.length > 0 ? imageUrls : undefined,
    isExpanded: false,
    status: '작성됨',
  };
};

// 리뷰 아이템 컴포넌트
const ReviewItem = ({
  review,
  onToggleExpand,
  onEdit,
}: {
  review: ReviewSchema;
  onToggleExpand: (id: string) => void;
  onEdit: (id: string) => void;
}) => {
  // 텍스트 길이로 3줄을 넘어가는지 추정 (한 줄당 약 30-35자)
  const estimatedLines = review.reviewText
    ? Math.ceil(review.reviewText.length / 35)
    : 0;
  const shouldShowExpandButton = estimatedLines > 3;

  return (
    <View style={styles.reviewCard}>
      {/* 리뷰 헤더 */}
      <View style={styles.reviewHeader}>
        <View style={styles.reviewInfo}>
          <Text style={styles.practitionerName}>
            {review.practitioner} 진료
          </Text>
          <Text style={styles.visitDate}>{review.visitDate}</Text>
          <StarRating rating={review.rating} size={14} />
        </View>
        <Button style={styles.menuButton} onPress={() => onEdit(review.id)}>
          <Icon name={'ic-ellipsis-vertical'} />
        </Button>
      </View>

      {/* 리뷰 이미지 (있는 경우) */}
      {review.images && review.images.length > 0 && (
        <View style={styles.imageContainer}>
          {review.images.map((imageUrl, index) => (
            <Image
              key={index}
              source={{ uri: imageUrl }}
              style={styles.reviewImage}
              resizeMode='cover'
            />
          ))}
        </View>
      )}

      {/* 리뷰 텍스트 */}
      {review.reviewText && (
        <View style={styles.reviewTextContainer}>
          <Text
            style={styles.reviewText}
            numberOfLines={review.isExpanded ? undefined : 3}
          >
            {review.reviewText}
          </Text>
          {shouldShowExpandButton && (
            <TouchableOpacity
              style={styles.expandButton}
              onPress={() => onToggleExpand(review.id)}
            >
              <Text style={styles.expandButtonText}>
                {review.isExpanded ? '접기' : '더보기'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* 태그들 - 주석 처리 */}
      {/* <View style={styles.tagsContainer}>
        {review.tags?.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View> */}
    </View>
  );
};

const ReviewList = () => {
  const safeRouter = useSafeRouter();
  const [reviews, setReviews] = useState<ReviewSchema[]>([]);
  const [user] = useAtom(userAtom);
  // TODO: 유저 아이디 추가
  const { data, isLoading, error } = useGetMyReviews(0);

  const [deleteReviewId, setDeleteReviewId] = useState<string | null>(null);
  const [optionModal, setOptionModal] = useState(false);
  const { mutate: deleteReview } = useDeleteReview();

  const handleWriteReview = () => {
    console.log('리뷰 쓰기');
    // 예약 리스트 스크린으로 이동 (리뷰 작성 모드)
    safeRouter.navigate('/my-page/reservation-list?isReviewWrite=true');
  };

  const handleToggleExpand = (reviewId: string) => {
    setReviews(prevReviews =>
      prevReviews.map(review =>
        review.id === reviewId
          ? { ...review, isExpanded: !review.isExpanded }
          : review
      )
    );
  };

  const handleEditReview = (reviewId: string) => {
    setDeleteReviewId(reviewId);
    setOptionModal(true);
  };

  const renderReviewItem = ({ item }: { item: ReviewSchema }) => (
    <ReviewItem
      review={item}
      onToggleExpand={handleToggleExpand}
      onEdit={handleEditReview}
    />
  );

  const keyExtractor = (item: ReviewSchema) => item.id;

  const handleDeleteReview = async (reviewId: string) => {
    await deleteReview(reviewId);
    setDeleteReviewId(null);
    setOptionModal(false);
    setReviews(prevReviews =>
      prevReviews.filter(review => review.id !== reviewId)
    );
  };

  // API 데이터가 로드되면 이미지 처리
  React.useEffect(() => {
    const processReviews = async () => {
      if (data?.items) {
        console.log('API 응답 데이터:', JSON.stringify(data.items, null, 2));
        const processedReviews = await Promise.all(
          data.items.map(transformApiDataToUI)
        );
        setReviews(processedReviews);
      } else {
        // 목데이터 처리
        const processedMockReviews = await Promise.all(
          MOCK_REVIEWS.map(transformApiDataToUI)
        );
        setReviews(processedMockReviews);
      }
    };

    processReviews();
  }, [data]);

  // API 데이터가 있으면 사용, 없으면 목데이터 사용
  const displayData = reviews;

  return (
    <>
      <SafeAreaView style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            작성 리뷰 {displayData.length}개
          </Text>
          <Button style={styles.writeButton} onPress={handleWriteReview}>
            <Text style={styles.writeButtonText}>리뷰 쓰기</Text>
          </Button>
        </View>

        {/* 리뷰 목록 */}
        <FlatList
          data={displayData}
          renderItem={renderReviewItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </SafeAreaView>
      <Modal
        visible={optionModal}
        onRequestClose={() => setOptionModal(false)}
        transparent={true}
        animationType='slide'
      >
        <Button
          style={styles.modalOverlay}
          onPress={() => setOptionModal(false)}
        >
          <View style={styles.optionModal}>
            {/* 드래그 핸들 */}
            <View style={styles.dragHandle} />

            {/* 옵션 버튼들 */}
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
                alert('준비중입니다');
              }}
            >
              <Text style={styles.optionText}>수정하기</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => handleDeleteReview(deleteReviewId || '')}
            >
              <Text style={styles.optionText}>삭제하기</Text>
            </TouchableOpacity>
          </View>
        </Button>
      </Modal>
    </>
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
  writeButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  writeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  separator: {
    height: 12,
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reviewInfo: {
    flex: 1,
  },
  practitionerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  visitDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  menuButton: {
    padding: 4,
  },
  menuIcon: {
    fontSize: 30,
    fontWeight: 'bold',
    color: ColorPalette.primary,
  },
  imageContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  reviewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    fontSize: 24,
  },
  reviewTextContainer: {
    marginBottom: 12,
  },
  reviewText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  expandButton: {
    marginTop: 8,
  },
  expandButtonText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    color: '#6B7280',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  optionModal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingBottom: 34,
    paddingHorizontal: 20,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: ColorPalette.primary,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  optionButton: {
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  optionText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
});

export default ReviewList;
