import { scale } from '../../lib/scale-utils';

// 공통 스타일 props 타입
export interface ScaledStyleProps {
  // 크기 관련
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;

  // 패딩 관련
  padding?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;

  // 마진 관련
  margin?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  marginHorizontal?: number;
  marginVertical?: number;

  // 폰트 관련
  fontSize?: number;
  lineHeight?: number;
  letterSpacing?: number;

  // 테두리 관련
  borderRadius?: number;
  borderWidth?: number;

  // 위치 관련
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;

  // 기타
  gap?: number;
  flex?: number;
  flexGrow?: number;
  flexShrink?: number;
  aspectRatio?: number;
}

// scale 적용 함수
export const applyScaledStyles = (props: ScaledStyleProps) => {
  return {
    // 크기 관련
    ...(props.width !== undefined && { width: scale(props.width) }),
    ...(props.height !== undefined && { height: scale(props.height) }),
    ...(props.minWidth !== undefined && { minWidth: scale(props.minWidth) }),
    ...(props.minHeight !== undefined && { minHeight: scale(props.minHeight) }),
    ...(props.maxWidth !== undefined && { maxWidth: scale(props.maxWidth) }),
    ...(props.maxHeight !== undefined && { maxHeight: scale(props.maxHeight) }),

    // 패딩 관련
    ...(props.padding !== undefined && { padding: scale(props.padding) }),
    ...(props.paddingTop !== undefined && {
      paddingTop: scale(props.paddingTop),
    }),
    ...(props.paddingBottom !== undefined && {
      paddingBottom: scale(props.paddingBottom),
    }),
    ...(props.paddingLeft !== undefined && {
      paddingLeft: scale(props.paddingLeft),
    }),
    ...(props.paddingRight !== undefined && {
      paddingRight: scale(props.paddingRight),
    }),
    ...(props.paddingHorizontal !== undefined && {
      paddingHorizontal: scale(props.paddingHorizontal),
    }),
    ...(props.paddingVertical !== undefined && {
      paddingVertical: scale(props.paddingVertical),
    }),

    // 마진 관련
    ...(props.margin !== undefined && { margin: scale(props.margin) }),
    ...(props.marginTop !== undefined && { marginTop: scale(props.marginTop) }),
    ...(props.marginBottom !== undefined && {
      marginBottom: scale(props.marginBottom),
    }),
    ...(props.marginLeft !== undefined && {
      marginLeft: scale(props.marginLeft),
    }),
    ...(props.marginRight !== undefined && {
      marginRight: scale(props.marginRight),
    }),
    ...(props.marginHorizontal !== undefined && {
      marginHorizontal: scale(props.marginHorizontal),
    }),
    ...(props.marginVertical !== undefined && {
      marginVertical: scale(props.marginVertical),
    }),

    // 폰트 관련
    ...(props.fontSize !== undefined && { fontSize: scale(props.fontSize) }),
    ...(props.lineHeight !== undefined && {
      lineHeight: scale(props.lineHeight),
    }),
    ...(props.letterSpacing !== undefined && {
      letterSpacing: scale(props.letterSpacing),
    }),

    // 테두리 관련
    ...(props.borderRadius !== undefined && {
      borderRadius: scale(props.borderRadius),
    }),
    ...(props.borderWidth !== undefined && {
      borderWidth: scale(props.borderWidth),
    }),

    // 위치 관련
    ...(props.top !== undefined && { top: scale(props.top) }),
    ...(props.bottom !== undefined && { bottom: scale(props.bottom) }),
    ...(props.left !== undefined && { left: scale(props.left) }),
    ...(props.right !== undefined && { right: scale(props.right) }),

    // 기타
    ...(props.gap !== undefined && { gap: scale(props.gap) }),
    ...(props.flex !== undefined && { flex: props.flex }),
    ...(props.flexGrow !== undefined && { flexGrow: props.flexGrow }),
    ...(props.flexShrink !== undefined && { flexShrink: props.flexShrink }),
    ...(props.aspectRatio !== undefined && { aspectRatio: props.aspectRatio }),
  };
};
