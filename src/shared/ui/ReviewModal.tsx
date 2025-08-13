import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { apiClient } from '../config/api-client';
import { loadUserFromStorage } from '../lib/profile-store';

interface ReviewModalProps {
  visible: boolean;
  onClose: () => void;
  reservationId?: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  visible,
  onClose,
  reservationId,
}) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isWebViewLoaded, setIsWebViewLoaded] = useState(false);
  const webViewRef = useRef<WebView>(null);

  // 데이터 로드
  useEffect(() => {
    if (visible) {
      const loadData = async () => {
        try {
          const token = await apiClient.getAuthToken();
          setAuthToken(token);
          const userProfile = await loadUserFromStorage();
          setUserInfo(userProfile);
        } catch (error) {
          console.error('데이터 로드 실패:', error);
        }
      };
      loadData();
    }
  }, [visible]);

  // 인증 데이터 주입
  const injectAuthData = useCallback(() => {
    if (authToken && userInfo && isWebViewLoaded && webViewRef.current) {
      const script = `
        try {
          localStorage.setItem('token', '${authToken}');
          localStorage.setItem('userInfo', '${JSON.stringify(userInfo)}');
          console.log('Auth data injected successfully');
        } catch (error) {
          console.error('Failed to inject auth data:', error);
        }
      `;

      try {
        webViewRef.current.injectJavaScript(script);
      } catch (error) {
        console.error('JavaScript injection failed:', error);
      }
    }
  }, [authToken, userInfo, isWebViewLoaded]);

  // 웹뷰 로드 완료 시 인증 데이터 주입
  useEffect(() => {
    if (isWebViewLoaded) {
      const timer = setTimeout(injectAuthData, 500);
      return () => clearTimeout(timer);
    }
  }, [isWebViewLoaded, injectAuthData]);

  // 웹뷰 이벤트 핸들러
  const handleWebViewLoadStart = useCallback(() => {
    console.log('WebView load started');
  }, []);

  const handleWebViewLoadEnd = useCallback(() => {
    console.log('WebView load completed');
    setIsWebViewLoaded(true);
  }, []);

  const handleWebViewError = useCallback((syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error:', nativeEvent);
  }, []);

  // 모달 닫기 시 상태 초기화
  const handleClose = useCallback(() => {
    setIsWebViewLoaded(false);
    onClose();
  }, [onClose]);

  return (
    <Modal
      visible={visible}
      animationType='slide'
      presentationStyle='pageSheet'
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>리뷰 작성</Text>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>닫기</Text>
          </TouchableOpacity>
        </View>

        {/* 웹뷰 */}
        <View style={styles.webviewContainer}>
          <WebView
            ref={webViewRef}
            source={{ uri: 'https://meditrip-web-eta.vercel.app/review' }}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            cacheEnabled={true}
            onLoadStart={handleWebViewLoadStart}
            onLoadEnd={handleWebViewLoadEnd}
            onError={handleWebViewError}
            // iOS 최적화
            {...(Platform.OS === 'ios' && {
              allowsInlineMediaPlayback: true,
            })}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  closeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  closeButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  webviewContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default ReviewModal;
