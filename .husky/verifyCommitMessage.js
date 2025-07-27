#!/usr/bin/env node
const fs = require("fs");

// 커밋 메시지 파일 경로를 가져옵니다.
const commitMessageFilePath = process.argv[2];

// 커밋 메시지를 읽어옵니다.
const commitMessage = fs.readFileSync(commitMessageFilePath, "utf-8").trim();

// 병합 커밋 메시지 검증 제외
if (commitMessage.startsWith("Merge branch")) {
  process.exit(0); // 병합 커밋 메시지는 검증을 건너뜁니다.
}

// 정규 표현식 수정 (커밋 메시지 형식을 검증)
const commitMessagePattern =
  /^(feat|fix|style|design|HOTFIX|refactor|docs|chore|lint|deploy|rename|remove|type|comment|struct|SEO|setting):\s.{1,40}\s#\d+$/;

// 이모지 제거: 이모지가 있다면 제거하고, 나머지 텍스트만 검증
const sanitizedCommitMessage = commitMessage.replace(/^[^\w\s]+/, "").trim(); // 이모지 부분을 제거

// 커밋 메시지 형식을 검증합니다.
if (!commitMessagePattern.test(sanitizedCommitMessage)) {
  console.error(`
  사용가능한 commit의 형식은 아래와 같습니다.
  
  ===================== [태그이름] + 설명 + #이슈번호 =====================
  feat:           새로운 기능 추가
  fix:            버그 수정
  style:          코드 포맷 변경, 세미 콜론 누락, 코드 수정이 없는 경우
  design:         CSS 등 사용자 UI 변경 및 설계
  BREAKING CHANGE: 커다란 API 변경의 경우
  HOTFIX:         급하게 치명적인 버그를 고쳐야하는 경우
  refactor:       코드 리팩토링
  docs:           문서 수정
  chore:          빌드 업무, 패키지 매니저 수정
  lint:           린트 에러 수정
  deploy:         배포 관련 작업
  rename:         파일 혹은 폴더명 수정
  remove:         파일 삭제
  type:           타입 수정
  comment:        주석 추가 및 변경
  struct:         폴더 구조 변경
  SEO:            웹 접근성
  ==================================================================
  형식에 맞춰 커밋 메시지를 다시 작성해주세요. 커밋 메시지는 설명 뒤에 이슈 번호도 포함해야 합니다. 예시: Feat: 기능 추가 설명 #123
  커밋 메시지는 총 80자로 제한됩니다. 가능한 간결한 커밋 메시지를 작성해 주세요.
  `);
  process.exit(1); // 검증 실패 시 프로세스를 종료합니다.
}

// 성공적으로 완료되면 프로세스를 종료합니다.
process.exit(0);
