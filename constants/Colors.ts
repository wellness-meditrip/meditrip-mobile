/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

// 메인 컬러 팔레트
export const ColorPalette = {
  // Color 섹션
  primary: '#271F1D', // Primary
  secondary: '#5D4A43', // Secondary
  tertiary: '#92766A', // Tertiary
  disabled: '#A68E84', // Disabled
  bgDefault: '#E9E4E1', // BG default / Divider

  // Color Palette 섹션
  primaryColor: '#FF8E66', // Primary Color (주황색/코랄색) - 50
  bgSurface1: '#F7E2D4', // BG surface 1 (밝은 살구색/베이지색)
  bgSurface2: '#F1E8DC', // BG surface 2 (더 밝은 베이지색)
  subGreen: '#9FB57B', // Sub Green (차분한 녹색)
  subBrown: '#C69B7B', // Sub Brown (중간 갈색)
  accent: '#E3B36F', // Accent (황금색/겨자색)

  // Primary Color 단계별 색상
  primaryColor90: '#852300', // 가장 진한 단계
  primaryColor70: '#BD3100', // 진한 단계
  primaryColor50: '#FF8E66', // 기본 단계 (기존 primaryColor와 동일)
  primaryColor30: '#FFAC8F', // 밝은 단계
  primaryColor10: '#FFE0D6', // 매우 밝은 단계
  primaryColor0: '#FFFCFB', // 가장 밝은 단계 (거의 흰색)
};

export const Colors = {
  light: {
    text: ColorPalette.primary,
    background: '#fff',
    tint: ColorPalette.primaryColor,
    icon: ColorPalette.secondary,
    tabIconDefault: ColorPalette.tertiary,
    tabIconSelected: ColorPalette.primaryColor,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: ColorPalette.primaryColor,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: ColorPalette.primaryColor,
  },
};
