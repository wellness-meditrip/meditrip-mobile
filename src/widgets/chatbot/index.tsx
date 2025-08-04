import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
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

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const { mutateAsync, isPending, isError, error, data, isSuccess } =
    useSendChatMessage();

  interface ChatMessage {
    message: string;
    isUser: boolean;
    time: string;
  }

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      message: '안녕하세요! 메디트립 챗봇입니다. 질문해주세요!',
      isUser: false,
      time: new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    },
    {
      message: '경락은 뭐야?',
      isUser: true,
      time: '오후 02:36',
    },
    {
      message:
        '경락(經絡)은 인체의 기와 혈이 흐르는 경로를 의미합니다. 경락은 전신의 조직을 연결하고, 기혈을 운행하는 역할을 합니다. 경락은 크게 12개의 주요 경맥과 여러 가지 낙맥으로 구성되어 있으며, 이들은 서로 협력하여 인체의 기능을 조절하고 질병을 예방하는 데 중요한 역할을 합니다. 경락의 원리는 전통적인 한의학에서 중요한 개념으로, 건강과 질병의 관계를 이해하는 데 도움을 줍니다.',
      isUser: false,
      time: '오후 02:36',
    },
    {
      message: '경혈은 뭐야?',
      isUser: true,
      time: '오후 02:36',
    },
    {
      message:
        '경혈(經絡)은 인체의 기와 혈이 흐르는 경로를 의미합니다. 경혈은 전신의 조직을 연결하고, 기혈을 운행하는 역할을 합니다. 경혈은 크게 12개의 주요 경맥과 여러 가지 낙맥으로 구성되어 있으며, 이들은 서로 협력하여 인체의 기능을 조절하고 질병을 예방하는 데 중요한 역할을 합니다. 경혈의 원리는 전통적인 한의학에서 중요한 개념으로, 건강과 질병의 관계를 이해하는 데 도움을 줍니다.',
      isUser: false,
      time: '오후 02:36',
    },
  ]);

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
        message: '안녕하세요! 메디트립 챗봇입니다. 질문해주세요!',
        isUser: false,
        time: new Date().toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
      },
    ]);
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
        const response = await mutateAsync({
          question: message.trim(),
        });
        console.log('챗봇 응답:', response);
        setMessage('');
      } catch (error) {
        console.error('API 호출 오류:', error);

        if (__DEV__) {
          const mockResponse = {
            answer: '한의학은 한국에서 독자적으로 발전한 전통 의학 체계입니다.',
            sources: ['모의 데이터'],
            confidence: 0.9,
          };

          const currentTime = new Date().toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });

          setChatHistory(prev => [
            ...prev,
            { message: mockResponse.answer, isUser: false, time: currentTime },
          ]);
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <Button onPress={() => setIsOpen(!isOpen)}>
        <CHATBOT width={scale(40)} height={scale(40)} />
      </Button>
      <Modal visible={isOpen} transparent={true} animationType='fade'>
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Button onPress={handleRefresh}>
                <ROTATE width={scale(24)} height={scale(24)} />
              </Button>
              <Text style={styles.headerText}>챗봇</Text>
              <Button onPress={() => setIsOpen(!isOpen)}>
                <CLOSE width={scale(28)} height={scale(28)} />
              </Button>
            </View>
            <ScrollView
              style={styles.chatContainer}
              contentContainerStyle={styles.chatContent}
              showsVerticalScrollIndicator={false}
            >
              {chatHistory.map((item, index) => (
                <ChatMessage
                  key={index}
                  message={item.message}
                  isUser={item.isUser}
                  time={item.time}
                />
              ))}

              {isPending && <TypingIndicator />}
            </ScrollView>
          </View>
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
      </Modal>
    </View>
  );
};

export default Chatbot;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: scale(68),
    right: scale(10),
    width: scale(60),
    height: scale(60),
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
  modalContent: {
    width: '100%',
    flex: 1,
    backgroundColor: ColorPalette.primaryColor0,
    borderRadius: 0,
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
  },
});
