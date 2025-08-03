import { atom } from 'jotai';

// 프로필 이미지 상태
export const profileImageAtom = atom<string | null>(null);

// 프로필 정보 상태
export const profileInfoAtom = atom({
  nickname: 'Elena122',
  email: 'Elena122@email.com',
  lineId: 'Elena122',
  country: '일본',
  language: 'KO',
});
