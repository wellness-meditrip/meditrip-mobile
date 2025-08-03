import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Text from '../shared/ui/custom/text';
import { MEDITRIP } from '../../assets/icons/components';

export default function Index() {
  useEffect(() => {
    // 5초 후 탭 라우팅으로 리다이렉트 (글꼴 로딩 시간 늘림)
    const timer = setTimeout(() => {
      router.replace('/(tabs)/home');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <MEDITRIP width={100} height={100} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});
