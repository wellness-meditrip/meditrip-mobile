import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 기준이 되는 디자인 크기
const DESIGN_WIDTH = 375; // iPhone 기준
const DESIGN_HEIGHT = 812; // iPhone 기준

/**
 * 화면 크기에 따라 적응적으로 스케일링하는 함수
 * @param size - 원본 크기
 * @returns 스케일링된 크기
 */
export const scale = (size: number): number => {
  const widthScale = SCREEN_WIDTH / DESIGN_WIDTH;
  const heightScale = SCREEN_HEIGHT / DESIGN_HEIGHT;
  const scale = Math.min(widthScale, heightScale);

  const newSize = size * scale;

  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }

  return Math.round(newSize);
};

/**
 * 폰트 크기 전용 스케일링 함수 (verticalScale)
 * @param size - 원본 폰트 크기
 * @returns 스케일링된 폰트 크기
 */
export const verticalScale = (size: number): number => {
  const scale = SCREEN_HEIGHT / DESIGN_HEIGHT;
  const newSize = size * scale;

  // 폰트는 최소/최대 크기 제한
  const minSize = 8;
  const maxSize = 32;

  const finalSize = Math.max(minSize, Math.min(maxSize, newSize));

  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(finalSize));
  }

  return Math.round(finalSize);
};
