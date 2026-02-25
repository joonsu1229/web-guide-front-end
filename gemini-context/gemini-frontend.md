# 프론트엔드 개발 가이드 및 베이스 컨텍스트

> **[Global Constraints]**
> - 향후 AI가 생성하는 모든 코드의 주석 및 답변은 반드시 **'한글(Korean)'**로 작성해야 합니다.

이 문서는 프로젝트의 기술 스택, 코딩 컨벤션 및 모듈화 규칙을 정의하며, 모든 AI 협업 및 코드 생성의 기준이 됩니다.

## 1. Tech Stack (기술 스택)

- **Framework**: Vue 3 (v3.5+)
- **Build Tool**: Vite (v7.0+)
- **Language**: TypeScript (v5.8+)
- **Router**: Vue Router (v4.5+)
- **State Management**: Pinia (v3.0+)
- **UI Framework**: Naive UI (v2.38+)
- **Styling**: Tailwind CSS (v3.4+) / PostCSS
- **HTTP Client**: Axios
- **Utilities**:
  - Date: dayjs
  - Logic: lodash-es
  - Markdown: markdown-it, marked, highlight.js

## 2. TypeScript 설정

- **Path Alias**: `@/` 를 사용하여 `src` 디렉토리에 접근합니다. (예: `import ... from '@/components/...'`)
- **Strict Mode**: 프로젝트의 `tsconfig.app.json` 설정을 준수하며, 명확한 타입 정의를 지향합니다.
- **Type Check**: `vue-tsc`를 통한 빌드 타임 타입 체크를 수행합니다.

## 3. Coding Convention (코딩 컨벤션)

### 3.1 Vue Component
- **Composition API 필수**: 모든 컴포넌트는 `<script setup lang="ts">` 형식을 사용합니다.
- **Component 정의**:
  - 파일명은 PascalCase(예: `CategoryItem.vue`)를 사용합니다.
  - 템플릿 내에서는 kebab-case 컴포넌트 태그 사용을 권장합니다. (예: `<category-item />`)
- **Props & Emits**:
  - `defineProps<{ ... }>()` 및 `defineEmits<{ ... }>()`를 사용하여 타입을 명시적으로 정의합니다.

### 3.2 State Management (Pinia)
- `src/stores` 디렉토리에 저장하며, `use[Name]Store` 명명 규칙을 따릅니다.
- Composition API 스타일(Setup Stores)로 작성하는 것을 권장합니다.

### 3.3 API Layer
- `src/api` 디렉토리에 도메인별로 분리하여 관리합니다.
- Axios 인스턴스는 공통 설정(Interceptor 등)을 거친 후 각 API 모듈에서 import하여 사용합니다.

## 4. Component Modularization (컴포넌트 모듈화 규칙)

- **views/**: 라우터와 매핑되는 페이지 단위의 대형 컴포넌트.
- **components/**: 여러 페이지에서 재사용 가능한 UI 조각.
  - 기능적 연관성에 따라 하위 디렉토리를 생성하여 관리합니다. (예: `components/icons/`)
- **Single Responsibility**: 하나의 컴포넌트는 하나의 명확한 책임을 가져야 하며, 로직이 비대해질 경우 자식 컴포넌트로 분리합니다.
