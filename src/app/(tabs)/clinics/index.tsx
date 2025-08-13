import React, { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { useAtom } from 'jotai';
import { apiClient } from '../../../shared/config';
import { loadUserFromStorage } from '../../../shared/lib/profile-store';
import { useSafeRouter } from '../../../shared/lib/safe-router';
import {
  updateWebViewRouteAtom,
  webViewGoBackRequestAtom,
} from '../../../shared/lib/route-store';

const Clinics = () => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isWebViewLoaded, setIsWebViewLoaded] = useState(false);
  const [hasShownLoadAlert, setHasShownLoadAlert] = useState(false);
  const webViewRef = useRef<WebView>(null);
  const safeRouter = useSafeRouter();
  const [, updateWebViewRoute] = useAtom(updateWebViewRouteAtom);
  const [webViewGoBackRequest] = useAtom(webViewGoBackRequestAtom);

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
    try {
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

      if (data.type === 'ROUTE_CHANGE') {
        updateWebViewRoute(data.route);
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  const injectAuthData = () => {
    if (authToken && userInfo && isWebViewLoaded) {
      const script = `
        try {
          localStorage.setItem('token', '${authToken}');
          localStorage.setItem('userInfo', '${JSON.stringify(userInfo)}');
          
          // Next.js App Router route 변경 감지를 위한 스크립트
          (function() {
            // 현재 pathname 가져오기
            const currentPath = window.location.pathname;
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'ROUTE_CHANGE',
              route: currentPath
            }));
            
            // History API를 통한 route 변경 감지
            const originalPushState = history.pushState;
            const originalReplaceState = history.replaceState;
            
            history.pushState = function() {
              originalPushState.apply(history, arguments);
              const newPath = window.location.pathname;
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'ROUTE_CHANGE',
                route: newPath
              }));
            };
            
            history.replaceState = function() {
              originalReplaceState.apply(history, arguments);
              const newPath = window.location.pathname;
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'ROUTE_CHANGE',
                route: newPath
              }));
            };
            
            // popstate 이벤트 감지 (뒤로가기/앞으로가기)
            window.addEventListener('popstate', function() {
              const newPath = window.location.pathname;
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'ROUTE_CHANGE',
                route: newPath
              }));
            });
            
            // Next.js App Router의 경우 추가 감지
            if (window.next && window.next.router) {
              // App Router의 경우 router.events 대신 다른 방법 사용
              const router = window.next.router;
              if (router.events) {
                router.events.on('routeChangeComplete', function(url) {
                  const path = new URL(url, window.location.origin).pathname;
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'ROUTE_CHANGE',
                    route: path
                  }));
                });
              }
            }
          })();
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

  // 웹뷰 뒤로가기 요청 감지 및 처리
  useEffect(() => {
    if (webViewGoBackRequest && webViewRef.current && isWebViewLoaded) {
      // 웹뷰에 goBack 메시지 전달
      const script = `
        try {
          if (window.next && window.next.router) {
            window.next.router.back();
          }
        } catch (error) {
          console.error('Failed to execute goBack:', error);
        }
      `;
      webViewRef.current.injectJavaScript(script);
    }
  }, [webViewGoBackRequest, isWebViewLoaded]);

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
        onLoadEnd={() => {
          setIsWebViewLoaded(true);
          // 웹뷰 로드 완료 후 route 감지 스크립트 주입
          setTimeout(() => {
            const routeDetectionScript = `
              (function() {
                // 현재 pathname 가져오기
                const currentPath = window.location.pathname;
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'ROUTE_CHANGE',
                  route: currentPath
                }));
                
                // History API를 통한 route 변경 감지
                const originalPushState = history.pushState;
                const originalReplaceState = history.replaceState;
                
                history.pushState = function() {
                  originalPushState.apply(history, arguments);
                  const newPath = window.location.pathname;
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'ROUTE_CHANGE',
                    route: newPath
                  }));
                };
                
                history.replaceState = function() {
                  originalReplaceState.apply(history, arguments);
                  const newPath = window.location.pathname;
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'ROUTE_CHANGE',
                    route: newPath
                  }));
                };
                
                // popstate 이벤트 감지 (뒤로가기/앞으로가기)
                window.addEventListener('popstate', function() {
                  const newPath = window.location.pathname;
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'ROUTE_CHANGE',
                    route: newPath
                  }));
                });
              })();
            `;
            webViewRef.current?.injectJavaScript(routeDetectionScript);
          }, 1000);
        }}
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
