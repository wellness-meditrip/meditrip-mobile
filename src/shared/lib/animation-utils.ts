import { interpolate, useAnimatedStyle } from 'react-native-reanimated';

export interface ScaleConfig {
  inputRange: number[];
  outputRange: number[];
  extrapolateLeft?: 'extend' | 'clamp' | 'identity';
  extrapolateRight?: 'extend' | 'clamp' | 'identity';
}

/**
 * 커스터마이징된 scale 애니메이션 훅
 * @param animatedValue - 애니메이션 값 (보통 scrollOffset 등)
 * @param config - scale 설정
 * @returns 애니메이션 스타일
 */
export const useCustomScale = (
  animatedValue: { value: number },
  config: ScaleConfig
) => {
  return useAnimatedStyle(() => {
    const scale = interpolate(
      animatedValue.value,
      config.inputRange,
      config.outputRange,
      {
        extrapolateLeft: config.extrapolateLeft || 'clamp',
        extrapolateRight: config.extrapolateRight || 'clamp',
      }
    );

    return {
      transform: [{ scale }],
    };
  });
};

/**
 * 스크롤 기반 scale 애니메이션
 * @param scrollOffset - 스크롤 오프셋 값
 * @param headerHeight - 헤더 높이
 * @returns 애니메이션 스타일
 */
export const useScrollScale = (
  scrollOffset: { value: number },
  headerHeight: number = 250
) => {
  return useCustomScale(scrollOffset, {
    inputRange: [-headerHeight, 0, headerHeight],
    outputRange: [2, 1, 0.75],
  });
};

/**
 * 페이드 인/아웃과 함께하는 scale 애니메이션
 * @param animatedValue - 애니메이션 값
 * @param config - scale 설정
 * @returns 애니메이션 스타일 (scale + opacity)
 */
export const useScaleWithOpacity = (
  animatedValue: { value: number },
  config: ScaleConfig
) => {
  return useAnimatedStyle(() => {
    const scale = interpolate(
      animatedValue.value,
      config.inputRange,
      config.outputRange,
      {
        extrapolateLeft: config.extrapolateLeft || 'clamp',
        extrapolateRight: config.extrapolateRight || 'clamp',
      }
    );

    const opacity = interpolate(
      animatedValue.value,
      config.inputRange,
      [0, 1, 1], // 페이드 인 효과
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });
};

/**
 * 바운스 효과가 있는 scale 애니메이션
 * @param animatedValue - 애니메이션 값
 * @param config - scale 설정
 * @returns 애니메이션 스타일
 */
export const useBounceScale = (
  animatedValue: { value: number },
  config: ScaleConfig
) => {
  return useAnimatedStyle(() => {
    const baseScale = interpolate(
      animatedValue.value,
      config.inputRange,
      config.outputRange,
      {
        extrapolateLeft: config.extrapolateLeft || 'clamp',
        extrapolateRight: config.extrapolateRight || 'clamp',
      }
    );

    // 바운스 효과를 위한 추가 계산
    const bounceScale = interpolate(
      animatedValue.value,
      config.inputRange,
      config.outputRange.map(scale => scale * 1.1), // 10% 더 크게
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }
    );

    // 바운스 효과는 짧은 구간에서만 적용
    const finalScale = animatedValue.value < 0 ? bounceScale : baseScale;

    return {
      transform: [{ scale: finalScale }],
    };
  });
};

/**
 * 스프링 효과가 있는 scale 애니메이션
 * @param animatedValue - 애니메이션 값
 * @param config - scale 설정
 * @returns 애니메이션 스타일
 */
export const useSpringScale = (
  animatedValue: { value: number },
  config: ScaleConfig
) => {
  return useAnimatedStyle(() => {
    const scale = interpolate(
      animatedValue.value,
      config.inputRange,
      config.outputRange,
      {
        extrapolateLeft: config.extrapolateLeft || 'clamp',
        extrapolateRight: config.extrapolateRight || 'clamp',
      }
    );

    // 스프링 효과를 위한 추가 변형
    const springScale =
      scale * (1 + Math.sin(animatedValue.value * 0.1) * 0.05);

    return {
      transform: [{ scale: springScale }],
    };
  });
};
