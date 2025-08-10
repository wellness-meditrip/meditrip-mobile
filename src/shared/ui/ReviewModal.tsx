import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
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

  useEffect(() => {
    const loadData = async () => {
      try {
        // 토큰 가져오기
        const token = await apiClient.getAuthToken();
        setAuthToken(token);
        // 사용자 정보 가져오기
        const userProfile = await loadUserFromStorage();
        setUserInfo(userProfile);
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      }
    };

    loadData();
  }, []);

  const injectAuthData = () => {
    if (authToken && userInfo && isWebViewLoaded && visible) {
      const script = `
        try {
          localStorage.setItem('token', '${authToken}');
          localStorage.setItem('userInfo', '${JSON.stringify(userInfo)}');  
          console.log('Auth data injected successfully');
          
        } catch (error) {
          console.error('Failed to inject auth data:', error);
        }
      `;
      webViewRef.current?.injectJavaScript(script);
    }
  };

  useEffect(() => {
    if (isWebViewLoaded) {
      // 웹뷰가 로드된 후 약간의 지연을 두고 인증 데이터 주입
      const timer = setTimeout(() => {
        injectAuthData();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [authToken, userInfo, isWebViewLoaded, visible]);

  const handleWebViewError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error:', nativeEvent);
  };

  const handleWebViewLoadStart = () => {
    console.log('WebView load started');
  };

  const handleWebViewLoadEnd = () => {
    console.log('WebView load completed');
    setIsWebViewLoaded(true);
  };

  return (
    <Modal
      visible={visible}
      animationType='slide'
      presentationStyle='pageSheet'
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>리뷰 작성</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
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
            cacheMode='LOAD_DEFAULT'
            allowsBackForwardNavigationGestures={true}
            incognito={false}
            pullToRefreshEnabled={true}
            allowsLinkPreview={false}
            mediaPlaybackRequiresUserAction={false}
            onLoadStart={handleWebViewLoadStart}
            onLoadEnd={handleWebViewLoadEnd}
            onError={handleWebViewError}
            onHttpError={syntheticEvent => {
              const { nativeEvent } = syntheticEvent;
              console.error('WebView HTTP error:', nativeEvent);
            }}
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
