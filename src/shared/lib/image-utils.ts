import * as FileSystem from 'expo-file-system';

/**
 * 구글 드라이브 뷰어 링크에서 이미지 ID를 추출합니다.
 * 예: https://drive.google.com/file/d/1ABC123/view -> 1ABC123
 */
export const extractGoogleDriveImageId = (url: string): string | null => {
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
};

/**
 * 구글 드라이브 이미지 ID를 썸네일 URL로 변환합니다.
 */
export const getGoogleDriveThumbnailUrl = (
  imageId: string,
  size: number = 1000
): string => {
  return `https://drive.google.com/thumbnail?id=${imageId}&sz=w${size}`;
};

/**
 * 구글 드라이브 뷰어 링크를 썸네일 URL로 변환합니다.
 */
export const convertGoogleDriveUrlToThumbnail = (
  url: string,
  size: number = 1000
): string => {
  const imageId = extractGoogleDriveImageId(url);
  if (!imageId) {
    return url; // 변환할 수 없으면 원본 URL 반환
  }
  return getGoogleDriveThumbnailUrl(imageId, size);
};

/**
 * 이미지 URL이 구글 드라이브 링크인지 확인합니다.
 */
export const isGoogleDriveUrl = (url: string): boolean => {
  return url.includes('drive.google.com');
};

/**
 * 이미지 소스를 처리하여 적절한 URL을 반환합니다.
 * 구글 드라이브 링크인 경우 썸네일 URL로 변환하고,
 * 그렇지 않으면 원본 URL을 반환합니다.
 */
export const processImageSource = (
  imageUrl: string | undefined | null
): string => {
  if (!imageUrl || typeof imageUrl !== 'string') return '';

  if (isGoogleDriveUrl(imageUrl)) {
    return convertGoogleDriveUrlToThumbnail(imageUrl);
  }

  return imageUrl;
};

/**
 * 이미지 URI를 안전하게 처리하는 함수
 * @param imageUri - 이미지 URI (URL 또는 로컬 파일 경로)
 * @returns 처리된 이미지 URI
 */
export const getSafeImageUri = (imageUri?: string): string | undefined => {
  if (!imageUri) return undefined;

  // URL인 경우 (http://, https://, data: 등)
  if (
    imageUri.startsWith('http://') ||
    imageUri.startsWith('https://') ||
    imageUri.startsWith('data:')
  ) {
    return imageUri;
  }

  // 로컬 파일 경로인 경우
  if (
    imageUri.startsWith('file://') ||
    (FileSystem.documentDirectory &&
      imageUri.startsWith(FileSystem.documentDirectory)) ||
    (FileSystem.cacheDirectory &&
      imageUri.startsWith(FileSystem.cacheDirectory))
  ) {
    return imageUri;
  }

  // 상대 경로인 경우 documentDirectory에 추가
  if (!imageUri.startsWith('/') && FileSystem.documentDirectory) {
    return `${FileSystem.documentDirectory}${imageUri}`;
  }

  return imageUri;
};

/**
 * 이미지 파일이 존재하는지 확인하는 함수
 * @param imageUri - 이미지 URI
 * @returns 파일 존재 여부
 */
export const checkImageExists = async (imageUri?: string): Promise<boolean> => {
  if (!imageUri) return false;

  try {
    const safeUri = getSafeImageUri(imageUri);
    if (!safeUri) return false;

    const fileInfo = await FileSystem.getInfoAsync(safeUri);
    return fileInfo.exists;
  } catch (error) {
    console.error('이미지 파일 확인 실패:', error);
    return false;
  }
};

/**
 * 오래된 프로필 이미지 파일을 정리하는 함수
 * @param currentUserId - 현재 사용자 ID
 */
export const cleanupOldProfileImages = async (currentUserId: string) => {
  try {
    if (!FileSystem.documentDirectory) return;

    const files = await FileSystem.readDirectoryAsync(
      FileSystem.documentDirectory
    );
    const profileFiles = files.filter(
      file =>
        file.startsWith('profile_') &&
        file.endsWith('.jpg') &&
        !file.includes(`profile_${currentUserId}_`)
    );

    for (const file of profileFiles) {
      await FileSystem.deleteAsync(`${FileSystem.documentDirectory}${file}`);
      console.log('오래된 프로필 이미지 삭제:', file);
    }
  } catch (error) {
    console.error('프로필 이미지 정리 실패:', error);
  }
};
