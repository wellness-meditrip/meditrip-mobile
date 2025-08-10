import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { scale } from '../../shared/lib/scale-utils';
import { ColorPalette } from '@/constants/Colors';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  time: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser, time }) => {
  return (
    <View style={styles.messageContainer}>
      <View
        style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.botBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isUser ? styles.userText : styles.botText,
          ]}
        >
          {message}
        </Text>
      </View>
      <Text
        style={[
          styles.timeText,
          { alignSelf: isUser ? 'flex-end' : 'flex-start' },
        ]}
      >
        {time}
      </Text>
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
  userBubble: {
    backgroundColor: ColorPalette.subGreen,
    borderBottomLeftRadius: scale(18),
    borderBottomRightRadius: scale(0),
    borderTopRightRadius: scale(18),
    borderTopLeftRadius: scale(18),
    alignSelf: 'flex-end',
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
  messageText: {
    fontSize: scale(16),
    lineHeight: scale(22),
  },
  userText: {
    color: '#FFFFFF',
  },
  botText: {
    color: '#000000',
  },
  timeText: {
    fontSize: scale(12),
    color: '#999999',
    marginTop: scale(4),
  },
});

export default ChatMessage;
