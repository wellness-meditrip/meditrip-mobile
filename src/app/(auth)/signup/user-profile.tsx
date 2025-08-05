import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { DatePicker } from '@/src/shared/ui/custom';
import { useCreateProfile } from '@/src/shared/config/api-hooks';

const UserProfile = () => {
  // API 훅
  const createProfileMutation = useCreateProfile();

  // 관심 건강 주제 상태
  const [selectedHealthTopics, setSelectedHealthTopics] = useState<string[]>(
    []
  );

  // 성별과 나이 상태
  const [selectedGender, setSelectedGender] = useState<string>('none');
  const [birthDate, setBirthDate] = useState('');

  // 키와 몸무게 상태
  const [height, setHeight] = useState('000.0');
  const [weight, setWeight] = useState('00.0');

  // 건강 주제 옵션
  const healthTopics = [
    { id: 'stress', name: '스트레스', icon: '🌙' },
    { id: 'womens', name: '여성질환', icon: '♀' },
    { id: 'weight', name: '체중감량/디톡스', icon: '🥗' },
    { id: 'immune', name: '면역관리', icon: '🛡️' },
    { id: 'antiaging', name: '안티에이징', icon: '🍃' },
  ];

  // 성별 옵션
  const genderOptions = [
    { id: 'male', name: '남성', icon: '♂' },
    { id: 'female', name: '여성', icon: '♀' },
    { id: 'none', name: '선택안함', icon: '' },
  ];

  // 건강 주제 토글
  const toggleHealthTopic = (topicId: string) => {
    setSelectedHealthTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  // 성별 선택
  const selectGender = (genderId: string) => {
    setSelectedGender(genderId);
  };

  // 저장 버튼 처리
  const handleSave = async () => {
    // UI에서 이미 버튼이 비활성화되므로 추가 검증은 불필요
    try {
      // 날짜 형식을 YYYY-MM-DD로 변환
      const formattedBirthDate = birthDate
        ? birthDate.replace(/\./g, '-')
        : undefined;

      // 키와 몸무게를 숫자로 변환
      const heightNumber = parseFloat(height);
      const weightNumber = parseFloat(weight);

      const profileData = {
        gender:
          selectedGender === 'none'
            ? undefined
            : (selectedGender as 'male' | 'female'),
        birthdate: formattedBirthDate,
        height: heightNumber || undefined,
        weight: weightNumber || undefined,
        topics_of_interest: selectedHealthTopics,
      };

      const result = await createProfileMutation.mutateAsync(profileData);

      if (result.success) {
        Alert.alert(
          '성공',
          result.message || '프로필이 성공적으로 생성되었습니다!',
          [
            {
              text: '확인',
              onPress: () => {
                // 홈 화면으로 이동
                router.replace('/(tabs)/home');
              },
            },
          ]
        );
      } else {
        // API 응답에서 에러 메시지를 찾는 로직
        let errorMessage = '프로필 생성에 실패했습니다.';
        if (result.error) {
          errorMessage = result.error;
        } else if (result.message) {
          errorMessage = result.message;
        }

        // 토큰 관련 에러인 경우 로그인 화면으로 이동
        if (errorMessage.includes('토큰') || errorMessage.includes('인증')) {
          Alert.alert('인증 오류', errorMessage, [
            {
              text: '로그인으로 이동',
              onPress: () => {
                router.replace('/(auth)/login');
              },
            },
          ]);
        } else {
          Alert.alert('오류', errorMessage);
        }
      }
    } catch (error: any) {
      console.error('프로필 생성 중 오류 발생:', error);
      Alert.alert(
        '오류',
        error?.message || '프로필 생성 중 문제가 발생했습니다.'
      );
    }
  };

  // 저장 버튼 활성화 조건
  const isSaveButtonEnabled =
    selectedHealthTopics.length > 0 && !createProfileMutation.isPending;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* 1. 관심 건강 주제 섹션 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              관심 건강 주제를 선택해주세요.{' '}
              <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.sectionSubtitle}>하나 이상 선택해주세요</Text>
            <View style={styles.healthTopicsContainer}>
              {healthTopics.map(topic => (
                <TouchableOpacity
                  key={topic.id}
                  style={[
                    styles.healthTopicButton,
                    selectedHealthTopics.includes(topic.id) &&
                      styles.selectedHealthTopic,
                  ]}
                  onPress={() => toggleHealthTopic(topic.id)}
                >
                  <Text
                    style={[
                      styles.healthTopicIcon,
                      selectedHealthTopics.includes(topic.id) &&
                        styles.selectedHealthTopicText,
                    ]}
                  >
                    {topic.icon}
                  </Text>
                  <Text
                    style={[
                      styles.healthTopicText,
                      selectedHealthTopics.includes(topic.id) &&
                        styles.selectedHealthTopicText,
                    ]}
                  >
                    {topic.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {selectedHealthTopics.length === 0 && (
              <Text style={styles.errorText}>
                관심 건강 주제를 하나 이상 선택해주세요.
              </Text>
            )}
          </View>

          {/* 2. 성별과 나이 섹션 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>성별과 나이를 알려주세요.</Text>

            {/* 성별 선택 */}
            <View style={styles.subSection}>
              <Text style={styles.subSectionLabel}>성별</Text>
              <View style={styles.genderContainer}>
                {genderOptions.map(gender => (
                  <TouchableOpacity
                    key={gender.id}
                    style={[
                      styles.genderButton,
                      selectedGender === gender.id && styles.selectedGender,
                    ]}
                    onPress={() => selectGender(gender.id)}
                  >
                    {gender.icon && (
                      <Text
                        style={[
                          styles.genderIcon,
                          selectedGender === gender.id &&
                            styles.selectedGenderText,
                        ]}
                      >
                        {gender.icon}
                      </Text>
                    )}
                    <Text
                      style={[
                        styles.genderText,
                        selectedGender === gender.id &&
                          styles.selectedGenderText,
                      ]}
                    >
                      {gender.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 생년월일 입력 */}
            <View style={styles.subSection}>
              <Text style={styles.subSectionLabel}>생년월일</Text>
              <DatePicker
                placeholder='날짜를 선택해주세요'
                selectedDate={birthDate}
                onChange={setBirthDate}
                style={styles.datePicker}
              />
            </View>
          </View>

          {/* 3. 키와 몸무게 섹션 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>키와 몸무게를 알려주세요.</Text>

            {/* 키 입력 */}
            <View style={styles.subSection}>
              <Text style={styles.subSectionLabel}>키(cm)</Text>
              <TextInput
                style={styles.measurementInput}
                value={height}
                onChangeText={setHeight}
                placeholder='000.0'
                keyboardType='numeric'
              />
            </View>

            {/* 몸무게 입력 */}
            <View style={styles.subSection}>
              <Text style={styles.subSectionLabel}>몸무게(kg)</Text>
              <TextInput
                style={styles.measurementInput}
                value={weight}
                onChangeText={setWeight}
                placeholder='00.0'
                keyboardType='numeric'
              />
            </View>
          </View>

          {/* 저장 버튼 */}
          <TouchableOpacity
            style={[
              styles.saveButton,
              !isSaveButtonEnabled && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={!isSaveButtonEnabled}
          >
            <Text style={styles.saveButtonText}>
              {createProfileMutation.isPending ? '저장 중...' : '저장하기'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  required: {
    color: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 8,
  },
  subSection: {
    marginBottom: 18,
  },
  subSectionLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  healthTopicsContainer: {
    gap: 12,
  },
  healthTopicButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    gap: 12,
  },
  selectedHealthTopic: {
    backgroundColor: '#FF6B35',
  },
  healthTopicIcon: {
    fontSize: 20,
    color: '#333',
  },
  healthTopicText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  selectedHealthTopicText: {
    color: '#fff',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    gap: 8,
  },
  selectedGender: {
    backgroundColor: '#FF6B35',
  },
  genderIcon: {
    fontSize: 16,
    color: '#333',
  },
  genderText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  selectedGenderText: {
    color: '#fff',
  },
  datePicker: {
    borderColor: '#ddd',
  },
  measurementInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#FF6B35',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.7,
  },
});
