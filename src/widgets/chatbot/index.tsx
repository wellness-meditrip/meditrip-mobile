import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { ColorPalette } from '@/constants/Colors';
import { scale } from '../../shared/lib/scale-utils';
import { CHATBOT } from '../../../assets/icons/components/chatbot';
import Button from '../../shared/ui/custom/button';
import { CLOSE, ROTATE, SEND } from '../../../assets/icons';
import Input from '../../shared/ui/custom/input';
import { useSendChatMessage } from '../../shared/config/api-hooks';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const { mutateAsync, isPending, isError, error, data, isSuccess } =
    useSendChatMessage();

  // 애니메이션 값들
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);

  // 원래 위치와 확장된 위치
  const originalPosition = { x: 0, y: 0 };
  const expandedPosition = { x: 0, y: -100 };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context: { startY: number; startX: number }) => {
      context.startY = translateY.value;
      context.startX = translateX.value;
    },
    onActive: (event, context: { startY: number; startX: number }) => {
      translateY.value = context.startY + event.translationY;
      translateX.value = context.startX + event.translationX;
    },
    onEnd: event => {
      const velocityY = event.velocityY;
      const currentY = translateY.value;

      // 위로 드래그했을 때 (음수 값) 확장된 위치로 이동
      if (currentY < -50 || velocityY < -500) {
        translateY.value = withSpring(expandedPosition.y, {
          damping: 15,
          stiffness: 150,
        });
        translateX.value = withSpring(expandedPosition.x, {
          damping: 15,
          stiffness: 150,
        });
        runOnJS(setIsExpanded)(true);
      } else {
        // 원래 위치로 돌아가기
        translateY.value = withSpring(originalPosition.y, {
          damping: 15,
          stiffness: 150,
        });
        translateX.value = withSpring(originalPosition.x, {
          damping: 15,
          stiffness: 150,
        });
        runOnJS(setIsExpanded)(false);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  interface ChatMessage {
    message: string;
    isUser: boolean;
    time: string;
  }

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      message: '반갑습니다.',
      isUser: false,
      time: new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    },
    {
      message: '아래 질문 버튼을 누르거나 궁금하신 내용을 직접 입력해주세요.',
      isUser: false,
      time: new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    },
  ]);

  // 질문 버튼 데이터
  const questionButtons = [
    '한의학이란 무엇인가요?',
    '다른 의학과의 차별점?',
    '일본에서 인기 있는 진료 과목이 무엇인가요?',
  ];

  useEffect(() => {
    if (!isPending && data?.answer) {
      setChatHistory(prev => [
        ...prev,
        {
          message: data.answer,
          isUser: false,
          time: new Date().toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }),
        },
      ]);
    }
  }, [isPending, data]);

  const handleRefresh = () => {
    setChatHistory([
      {
        message: '반갑습니다.',
        isUser: false,
        time: new Date().toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
      },
      {
        message: '아래 질문 버튼을 누르거나 궁금하신 내용을 직접 입력해주세요.',
        isUser: false,
        time: new Date().toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
      },
    ]);
  };

  const handleQuestionButton = async (question: string) => {
    const currentTime = new Date().toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    setChatHistory(prev => [
      ...prev,
      { message: question, isUser: true, time: currentTime },
    ]);

    try {
      await mutateAsync({
        question: question,
      });
    } catch (error) {
      console.error('챗봇 메시지 전송 실패:', error);
      const errorTime = new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      setChatHistory(prev => [
        ...prev,
        {
          message:
            '죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          isUser: false,
          time: errorTime,
        },
      ]);
    }
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      const currentTime = new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      setChatHistory(prev => [
        ...prev,
        { message: message.trim(), isUser: true, time: currentTime },
      ]);

      try {
        await mutateAsync({
          question: message.trim(),
        });
        setMessage('');
      } catch (error) {
        console.error('챗봇 메시지 전송 실패:', error);
        const errorTime = new Date().toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });

        setChatHistory(prev => [
          ...prev,
          {
            message:
              '죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
            isUser: false,
            time: errorTime,
          },
        ]);
      }
    }
  };

  return (
    <>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.chatbotContainer, animatedStyle]}>
          {/* 챗봇 버튼 */}
          <View style={styles.buttonContainer}>
            <Button onPress={() => setIsOpen(!isOpen)}>
              <CHATBOT width={scale(40)} height={scale(40)} />
            </Button>
          </View>
        </Animated.View>
      </PanGestureHandler>

      {/* 모달 - 챗봇이 열려있을 때만 표시 */}
      <Modal
        visible={isOpen}
        transparent={true}
        animationType='fade'
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <SafeAreaView style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Button onPress={handleRefresh}>
                  <ROTATE width={scale(24)} height={scale(24)} />
                </Button>
                <Text style={styles.headerText}>MEDIRIP AI 챗봇</Text>
                <Button onPress={() => setIsOpen(false)}>
                  <CLOSE width={scale(28)} height={scale(28)} />
                </Button>
              </View>
              <ScrollView
                style={styles.chatContainer}
                contentContainerStyle={styles.chatContent}
                showsVerticalScrollIndicator={false}
              >
                {/* 초기 메시지들 */}
                <ChatMessage
                  message='반갑습니다.'
                  isUser={false}
                  time={
                    chatHistory[0]?.time ||
                    new Date().toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })
                  }
                />
                <ChatMessage
                  message='아래 질문 버튼을 누르거나 궁금하신 내용을 직접 입력해주세요.'
                  isUser={false}
                  time={
                    chatHistory[1]?.time ||
                    new Date().toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })
                  }
                />

                {/* 질문 버튼들 - 초기 메시지들 바로 밑에 고정 */}
                <View style={styles.questionButtonsContainer}>
                  <View style={styles.questionButtonsRow}>
                    <TouchableOpacity
                      style={[
                        styles.questionButton,
                        styles.questionButtonHighlighted,
                      ]}
                      onPress={() => handleQuestionButton(questionButtons[0])}
                      disabled={isPending}
                    >
                      <Text style={styles.questionButtonText}>
                        {questionButtons[0]}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.questionButton}
                      onPress={() => handleQuestionButton(questionButtons[1])}
                      disabled={isPending}
                    >
                      <Text style={styles.questionButtonText}>
                        {questionButtons[1]}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.questionButtonsRow}>
                    <TouchableOpacity
                      style={styles.questionButton}
                      onPress={() => handleQuestionButton(questionButtons[2])}
                      disabled={isPending}
                    >
                      <Text style={styles.questionButtonText}>
                        {questionButtons[2]}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* 사용자와 봇의 대화 메시지들 (첫 번째 메시지 2개 제외) */}
                {chatHistory.slice(2).map((item, index) => (
                  <ChatMessage
                    key={index}
                    message={item.message}
                    isUser={item.isUser}
                    time={item.time}
                  />
                ))}

                {isPending && <TypingIndicator />}
              </ScrollView>
              <View style={styles.modalFooter}>
                <Input
                  placeholder='질문을 입력해주세요.'
                  value={message}
                  onChangeText={setMessage}
                  style={{
                    height: scale(56),
                  }}
                  disabled={isPending}
                  rightIcon={<SEND width={scale(24)} height={scale(24)} />}
                  onRightIconPress={handleSendMessage}
                />
              </View>
            </SafeAreaView>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Chatbot;

const styles = StyleSheet.create({
  chatbotContainer: {
    position: 'absolute',
    bottom: scale(68),
    right: scale(10),
    zIndex: 9999,
  },
  buttonContainer: {
    width: scale(60),
    height: scale(60),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ColorPalette.subGreen,
    borderRadius: scale(100),
    overflow: 'hidden',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: ColorPalette.primaryColor0,
    borderRadius: scale(12),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalContent: {
    width: '100%',
    flex: 1,
    backgroundColor: ColorPalette.primaryColor0,
    borderRadius: scale(12),
    overflow: 'hidden',
  },
  modalHeader: {
    width: '100%',
    height: scale(56),
    backgroundColor: ColorPalette.primaryColor0,
    paddingHorizontal: scale(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopLeftRadius: scale(12),
    borderTopRightRadius: scale(12),
  },
  headerText: {
    fontSize: scale(18),
    fontWeight: 'bold',
    color: ColorPalette.primary,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: ColorPalette.bgDefault,
  },
  chatContent: {
    paddingTop: scale(12),
    paddingHorizontal: scale(20),
  },
  modalFooter: {
    width: '100%',
    backgroundColor: ColorPalette.bgDefault,
    borderBottomLeftRadius: scale(12),
    borderBottomRightRadius: scale(12),
  },
  questionButtonsContainer: {
    marginTop: scale(16),
    marginBottom: scale(16),
  },
  questionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(8),
  },
  questionButton: {
    flex: 1,
    backgroundColor: ColorPalette.primaryColor0,
    paddingHorizontal: scale(12),
    paddingVertical: scale(4),
    borderRadius: scale(16),
    marginHorizontal: scale(4),
    borderWidth: 1,
    borderColor: ColorPalette.bgDefault,
  },
  questionButtonHighlighted: {
    backgroundColor: ColorPalette.subGreen,
    borderColor: ColorPalette.subGreen,
  },
  questionButtonText: {
    fontSize: scale(12),
    color: ColorPalette.primary,
    textAlign: 'center',
    lineHeight: scale(16),
  },
});
