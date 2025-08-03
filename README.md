# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## SVG Icons

이 프로젝트는 SVG 파일들을 React Native 컴포넌트로 사용할 수 있도록 설정되어 있습니다.

### 사용법

```tsx
import { Icon } from '@/components/icons';

// 기본 사용법
<Icon name="arrow-left" />

// 크기와 색상 커스터마이징
<Icon name="search" size={32} color="#007AFF" />

// 사용 가능한 아이콘들
// - arrow-left: 왼쪽 화살표
// - search: 검색 아이콘
// - self: 사용자 아이콘
```

### 새로운 SVG 아이콘 추가하기

1. `assets/icons/` 폴더에 SVG 파일을 추가
2. `components/icons/index.tsx`에서 import 추가
3. `IconName` 타입에 새 아이콘 이름 추가
4. `iconMap`에 매핑 추가

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
