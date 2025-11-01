# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

indexly는 독창적인 인덱스 기반 정리 시스템을 사용하는 React Native 투두 관리 앱입니다. Expo SDK 52를 기반으로 하며, Monthly/Weekly/Daily 카테고리로 작업을 구성할 수 있는 드래그 앤 드롭 기능을 제공합니다.

## 개발 명령어

```bash
# 개발 서버 시작
npm start
# 또는
expo start

# 플랫폼별 실행
npm run ios          # iOS 시뮬레이터
npm run android      # Android 에뮬레이터
npm run web          # 웹 브라우저

# 테스트 실행
npm test             # Jest 테스트 (watch 모드)

# 코드 검사
npm run lint         # Expo 린트 실행

# 빌드 및 배포
npm run build        # iOS용 EAS 빌드
npm run submit       # App Store 제출
```

## 핵심 아키텍처

### 상태 관리 구조
- **TodoContext** (`store/TodoContext.js`): 모든 투두 CRUD 작업과 SQLite 데이터베이스 연동
- **DragDropContext** (`store/DragDropContext.js`): 드래그 앤 드롭 상태 및 존 감지 관리
- React Context API를 통한 전역 상태 관리, SQLite로 로컬 데이터 영속성 보장

### 데이터베이스 스키마
- **todo 테이블**: `id`, `type` (Monthly/Weekly/Daily), `text`, `isCompleted`, `orderIndex`
- **meta 테이블**: 앱 메타데이터 저장
- SQLite 관련 모든 작업은 `util/database.js`에서 처리

### 커스텀 드래그 앤 드롭 구현
- 외부 라이브러리 없이 `react-native-gesture-handler`로 직접 구현
- `useInsideZone` 훅으로 드롭 존 감지
- `DraggingTodoItem.js`로 드래그 중 시각적 피드백 제공

### 화면 구조
- **app/index.tsx**: 루트 컴포넌트, React Navigation 설정
- **screens/Todo.js**: 메인 투두 관리 화면
- **screens/Loading.js**: 데이터베이스 초기화 중 로딩 화면

### 주요 컴포넌트
- **CollapsibleView.js**: Monthly/Weekly/Daily 섹션의 접기/펼치기 기능
- **TodoItem.js**: 개별 투두 아이템 (편집, 완료, 드래그 기능 포함)
- **Input.js**: 새 투두 추가 입력 컴포넌트

## 개발 시 주의사항

### 타입 시스템
- `constants/type.js`에서 투두 타입 상수 관리 (MONTHLY, WEEKLY, DAILY)
- TypeScript 지원, path alias 설정됨 (`@/` = 프로젝트 루트)

### 색상 테마
- `constants/color.js`에서 일관된 색상 체계 관리
- Daily(빨강), Weekly(분홍), Monthly(연분홍), 완료됨(회색) 구분

### 키보드 처리
- `useKeyboardVisibility` 훅으로 키보드 상태 추적
- 키보드 표시 시 섹션 자동 관리 로직 구현

### 데이터베이스 작업
- 모든 SQLite 작업은 `TodoContext`를 통해 수행
- 데이터베이스 초기화는 앱 시작 시 `Loading.js`에서 처리
- 순서 변경 시 `orderIndex` 필드 활용

### 빌드 설정
- iOS 중심 개발 (bundle ID: `com.janechun.indexly`)
- EAS Build 사용하여 App Store 배포
- `app.json`에서 빌드 넘버 관리

## 테스트 구조

현재 Jest 설정이 되어 있으나 커스텀 테스트 파일 없음. 새로운 테스트 작성 시:
- `jest-expo` 프리셋 사용
- 컴포넌트 테스트는 `__tests__/` 디렉토리에 배치 권장