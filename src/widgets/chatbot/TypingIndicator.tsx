import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { scale } from '../../shared/lib/scale-utils';

const TypingIndicator: React.FC = () => {
  const [activeDot, setActiveDot] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDot(prev => (prev + 1) % 3);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.messageContainer}>
      <View style={styles.messageBubble}>
        <View style={styles.typingIndicator}>
          <View
            style={[styles.typingDot, activeDot === 0 && styles.activeDot]}
          />
          <View
            style={[styles.typingDot, activeDot === 1 && styles.activeDot]}
          />
          <View
            style={[styles.typingDot, activeDot === 2 && styles.activeDot]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    marginBottom: scale(2),
    alignItems: 'flex-start',
  },
  messageBubble: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    borderTopLeftRadius: scale(18),
    borderTopRightRadius: scale(18),
    borderBottomRightRadius: scale(18),
    maxWidth: '80%',
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderBottomLeftRadius: scale(0),
  },
  typingIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scale(8),
  },
  typingDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: '#CCCCCC',
    marginHorizontal: scale(4),
  },
  activeDot: {
    backgroundColor: '#666666',
  },
});

export default TypingIndicator;
