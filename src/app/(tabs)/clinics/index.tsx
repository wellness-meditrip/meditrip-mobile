import React, { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { apiClient } from '../../../shared/config';
import { loadUserFromStorage } from '../../../shared/lib/profile-store';
import { useSafeRouter } from '../../../shared/lib/safe-router';

const Clinics = () => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isWebViewLoaded, setIsWebViewLoaded] = useState(false);
  const [hasShownLoadAlert, setHasShownLoadAlert] = useState(false);
  const webViewRef = useRef<WebView>(null);
  const safeRouter = useSafeRouter();

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

  const handleOnMessage = (event: WebViewMessageEvent) => {
    const data = JSON.parse(event.nativeEvent.data);

    if (data.type === 'LOGIN_REQUEST') {
      Alert.alert('로그인 필요', '로그인이 필요합니다.', [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '확인',
          onPress: () => safeRouter.navigate('/(auth)/login'),
        },
      ]);
    }

    if (data.type === 'WEBVIEW_LOADED' && !hasShownLoadAlert) {
      Alert.alert('로드 완료', 'WebView 로딩이 완료되었습니다!');
      setHasShownLoadAlert(true);
    }
  };

  const injectAuthData = () => {
    if (authToken && userInfo && isWebViewLoaded) {
      const script = `
        try {
          localStorage.setItem('token', '${authToken}');
          localStorage.setItem('userInfo', '${JSON.stringify(userInfo)}');     
              
          
        } catch (error) {
          console.error('Failed to inject auth data:', error);
        }
      `;
      webViewRef.current?.injectJavaScript(script);
    }
  };

  useEffect(() => {
    injectAuthData();
  }, [authToken, userInfo, isWebViewLoaded]);

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <WebView
        ref={webViewRef}
        source={{ uri: 'https://meditrip-web-eta.vercel.app/clinics' }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
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
        onMessage={handleOnMessage}
        onLoadEnd={() => setIsWebViewLoaded(true)}
      />
    </SafeAreaView>
  );
};

export default Clinics;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
  },
});
