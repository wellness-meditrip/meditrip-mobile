import { router } from 'expo-router';
import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button, Input, View } from '@/src/shared/ui/custom';
import Footer from '@/src/widgets/footer';
import Gap from '../../../shared/ui/gap';
import { SEARCH } from '@/assets/icons/components';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
    >
      <Gap size={12} style={{ backgroundColor: '#ddd' }} />
      <View
        style={{
          paddingVertical: 12,
          backgroundColor: 'red',
        }}
      >
        <Input
          placeholder='Search'
          rightIcon={<SEARCH />}
          style={{ backgroundColor: '#fafafa' }}
        />
      </View>
      <ThemedView style={styles.stepContainer}>
        <Button
          style={styles.button}
          onPress={() => router.push('/home/dashboard')}
        >
          <ThemedText style={styles.buttonText}>대시보드 보기</ThemedText>
        </Button>
      </ThemedView>
      <Footer />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },

  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
