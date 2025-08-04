import React from 'react';
import { View, StyleSheet } from 'react-native';
import { scale } from '../../shared/lib/scale-utils';

const TypingIndicator: React.FC = () => {
  return (
    <View style={styles.messageContainer}>
      <View style={[styles.messageBubble, styles.botBubble]}>
        <View style={styles.typingIndicator}>
          <View style={styles.typingDot} />
          <View style={styles.typingDot} />
          <View style={styles.typingDot} />
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
  },
  botBubble: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderBottomLeftRadius: scale(0),
    borderBottomRightRadius: scale(18),
    borderTopRightRadius: scale(18),
    borderTopLeftRadius: scale(18),
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
    backgroundColor: '#999999',
    marginHorizontal: scale(4),
  },
});

export default TypingIndicator;
