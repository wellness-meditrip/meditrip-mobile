import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import WebView from 'react-native-webview';
import { useAtom } from 'jotai';
import {
  userAtom,
  isLoggedInAtom,
  saveUserToStorage,
  saveLoginState,
} from '@/src/shared/lib/profile-store';
import { api } from '@/src/shared/config/api-client';

export type LoginProvider = 'google' | 'line';

interface WebViewLoginModalProps {
  visible: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  provider: LoginProvider;
}

const WebViewLoginModal: React.FC<WebViewLoginModalProps> = ({
  visible,
  onClose,
  onLoginSuccess,
  provider,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [webViewError, setWebViewError] = useState<string | null>(null);
  const webViewRef = useRef<WebView>(null);
  const [user, setUser] = useAtom(userAtom);
  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);

  // 로그인 제공자에 따른 URL 설정
  const getLoginUrl = (provider: LoginProvider): string => {
    switch (provider) {
      case 'google':
        return 'http://localhost:3000/login/google';
      case 'line':
        return 'http://localhost:3000/login/line';
      default:
        return 'http://localhost:3000/login/google';
    }
  };

  // 로그인 제공자에 따른 제목 설정
  const getModalTitle = (provider: LoginProvider): string => {
    switch (provider) {
      case 'google':
        return '구글 로그인';
      case 'line':
        return '라인 로그인';
      default:
        return '소셜 로그인';
    }
  };

  const handleCloseModal = () => {
    onClose();
    setIsLoading(false);
    setWebViewError(null);
  };

  const handleWebViewLoadStart = () => {
    setIsLoading(true);
    setWebViewError(null);
  };

  const handleWebViewLoadEnd = () => {
    setIsLoading(false);
  };

  const handleWebViewError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    setWebViewError('웹뷰 로딩 중 오류가 발생했습니다.');
    setIsLoading(false);
  };

  const handleWebViewLoad = (syntheticEvent: any) => {
    setIsLoading(false);
  };

  const handleWebViewLoadProgress = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
  };

  const handleWebViewHttpError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    setWebViewError(`HTTP 오류: ${nativeEvent.statusCode}`);
    setIsLoading(false);
  };

  const handleWebViewMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      // 웹뷰에서 전송된 메시지 처리
      if (data.type === 'LOGIN_SUCCESS') {
        // 로그인 성공 처리
        const providerName = data.provider === 'google' ? '구글' : '라인';

        // 사용자 정보 처리
        if (data.user) {
          let userData;

          if (data.provider === 'google') {
            const googleUser = data.user;
            userData = {
              id: googleUser.sub, // Google의 고유 ID
              email: googleUser.email,
              displayName: googleUser.name,
              nickname: googleUser.name, // 기본값으로 이름 사용
              lineId: '', // 구글 로그인은 라인 ID가 없음
              country: '한국', // 기본값
              language: 'KO', // 기본값
              profileImage: googleUser.picture,
              isNewUser: false,
            };
          } else if (data.provider === 'line') {
            const lineUser = data.user;
            userData = {
              id: lineUser.userId, // 라인의 고유 ID
              email: lineUser.userId, // 라인 userId를 email 필드에 저장
              displayName: lineUser.displayName,
              nickname: lineUser.displayName, // 기본값으로 이름 사용
              lineId: '', // 사용자가 직접 입력하는 라인 ID는 빈 문자열로 설정
              country: '한국', // 기본값
              language: 'KO', // 기본값
              profileImage: lineUser.pictureUrl,
              isNewUser: false,
            };
          }

          if (userData) {
            // Jotai 상태 업데이트
            setUser(userData);
            setIsLoggedIn(true);

            // AsyncStorage에 저장
            saveUserToStorage(userData);
            saveLoginState(true);

            // 토큰 저장
            if (data.token) {
              await api.setAuthToken(data.token);
            }
          }
        }

        Alert.alert('로그인 성공', `${providerName} 로그인이 완료되었습니다.`, [
          {
            text: '확인',
            onPress: () => {
              handleCloseModal();
              onLoginSuccess();
            },
          },
        ]);
      } else if (data.type === 'LOGIN_ERROR') {
        // 로그인 실패 처리
        Alert.alert(
          '로그인 실패',
          data.error || '로그인 중 오류가 발생했습니다.',
          [{ text: '확인', onPress: () => handleCloseModal() }]
        );
      } else if (data.type === 'CLOSE_MODAL') {
        // 모달 닫기 요청
        handleCloseModal();
      }
    } catch (error) {
      console.error('WebView message parsing error:', error);
    }
  };

  const handleWebViewNavigationStateChange = (navState: any) => {
    // URL 변경 감지 및 처리
    const { url } = navState;

    // 특정 URL에서 처리할 로직
    if (url.includes('success')) {
      // 성공 페이지 감지
      handleCloseModal();
      onLoginSuccess();
    } else if (url.includes('error')) {
      // 에러 페이지 감지
      setWebViewError('로그인 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={handleCloseModal}
      animationType='slide'
      presentationStyle='pageSheet'
    >
      <SafeAreaView style={styles.modalContainer}>
        {/* 모달 헤더 */}
        <View style={styles.modalHeader}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCloseModal}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{getModalTitle(provider)}</Text>
          <View style={styles.placeholder} />
        </View>

        {/* 웹뷰 컨테이너 */}
        <View style={styles.webViewContainer}>
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size='large' color='#FF6B35' />
            </View>
          )}

          {webViewError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{webViewError}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => {
                  setWebViewError(null);
                  webViewRef.current?.reload();
                }}
              >
                <Text style={styles.retryButtonText}>다시 시도</Text>
              </TouchableOpacity>
            </View>
          )}

          <WebView
            ref={webViewRef}
            source={{ uri: getLoginUrl(provider) }}
            style={styles.webView}
            onLoadStart={handleWebViewLoadStart}
            onLoadEnd={handleWebViewLoadEnd}
            onLoad={handleWebViewLoad}
            onLoadProgress={handleWebViewLoadProgress}
            onError={handleWebViewError}
            onHttpError={handleWebViewHttpError}
            onMessage={handleWebViewMessage}
            onNavigationStateChange={handleWebViewNavigationStateChange}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
            allowsBackForwardNavigationGestures={true}
            userAgent='MEDITRIP-Mobile-App'
            // 추가 설정으로 웹뷰 표시 문제 해결
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size='large' color='#FF6B35' />
                <Text style={styles.loadingText}>
                  로그인 페이지를 불러오는 중...
                </Text>
              </View>
            )}
            // 웹뷰 렌더링 문제 해결을 위한 추가 속성
            bounces={false}
            scrollEnabled={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            // iOS에서 웹뷰 표시 문제 해결
            automaticallyAdjustContentInsets={false}
            contentInsetAdjustmentBehavior='never'
            // 디버깅을 위한 추가 설정
            onShouldStartLoadWithRequest={request => {
              console.log('WebView should start load:', request);
              return true;
            }}
            onContentProcessDidTerminate={() => {
              console.log('WebView content process terminated');
              setWebViewError('웹뷰 프로세스가 종료되었습니다.');
            }}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 30,
  },
  webViewContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
  },
  webView: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    zIndex: 1,
  },
  errorText: {
    fontSize: 16,
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default WebViewLoginModal;
