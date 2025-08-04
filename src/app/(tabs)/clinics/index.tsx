import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const Clinics = () => {
  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <WebView
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
        // 미리 로드 최적화
        preloadEnabled={true}
        allowsLinkPreview={false}
        mediaPlaybackRequiresUserAction={false}
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
