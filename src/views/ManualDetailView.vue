<template>
  <div class="guide-layout">
    <ManualSidebar
      :currentSection="section"
      :activeItemId="activeItemId"
      :initialActiveMenu="$route.query.activeMenu"
      :forceMenuOpen="$route.query.menuOpen === 'true'"
      @section-change="handleItemSelect"
    />
    <main class="main-content">
      <div class="back-to-main">
        <button @click="goToMainPage" class="back-button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          메인으로 돌아가기
        </button>
      </div>
      <ManualContent 
        :activeItem="activeItem" 
      />
    </main>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useCategoryStore } from '@/stores/useCategoryStore'
import { useManualContentStore } from '@/stores/useManualContentStore'

import ManualSidebar from '@/components/ManualSidebar.vue'
import ManualContent from '@/components/ManualContent.vue'

export default {
  name: 'GuideDetailView',
  components: {
    ManualSidebar,
    ManualContent
  },
  props: {
    section: { type: String, required: true },
    categoryId: { type: String, default: null }
  },
  data() {
    return {
      activeItemId: null
    }
  },
  computed: {
    ...mapState(useCategoryStore, ['categoryTrees']),
    activeItem() {
      if (!this.activeItemId || !this.categoryTrees) return null;

      // 1. Object.values()로 객체 안의 배열들을 추출하고, .flat()으로 하나의 배열 만듦
      const allParents = Object.values(this.categoryTrees).flat();
      
      for (const parent of allParents) {
        const foundChild = parent.children?.find(child => child.id == this.activeItemId);
        if (foundChild) {
          return { ...foundChild, parentName: parent.name };
        }
      }

      return null;
    }
  },
  methods: {
    ...mapActions(useManualContentStore, ['fetchContent']),
    handleItemSelect(itemId) {
      this.activeItemId = itemId;
    },
    // 메인으로 돌아가는 라우팅 메서드
    goToMainPage() {
      this.$router.push('/');
    }
  },
  watch: {
    activeItemId: {
      handler(newId) {
        if (newId) {
          this.fetchContent('P1', newId);
        }
      }
    },
    // section prop이 바뀔 때 activeItemId를 초기화
    section: {
        handler() {
            this.activeItemId = null;
        },
        immediate: true
    },
    // categoryId prop이 있을 때 해당 카테고리를 활성화
    categoryId: {
        handler(newCategoryId) {
            if (newCategoryId) {
                this.activeItemId = newCategoryId;
            }
        },
        immediate: true
    }
  }
}
</script>

<style scoped>
.guide-layout {
  display: flex;
  height: calc(100vh - 60px); /* 예시: 전체 화면 높이에서 헤더 높이(60px)를 뺀 값 */
}

/* ManualSidebar 컴포넌트에 직접 적용될 스타일 */
.guide-layout :deep(.manual-sidebar-component) { /* 사이드바 컴포넌트의 최상위 클래스명으로 가정 */
  width: 280px; /* 사이드바 너비 고정 */
  flex-shrink: 0; /* 사이드바가 찌그러지지 않도록 방지 */
  overflow-y: auto; /* 사이드바 내용이 길 경우 자체 스크롤 */
  height: 100%;
}

.main-content {
  flex: 1; /* ✨ 1. 남은 공간을 모두 차지하도록 설정 */
  min-width: 0; /* ✨ 2. 콘텐츠가 커져도 사이드바를 밀어내지 않도록 설정 (가장 중요!) */
  overflow-y: auto; /* ✨ 3. 이 영역이 스크롤되도록 하여 내부 sticky가 동작하게 함 (가장 중요!) */
  height: 100%;
}

.back-to-main {
  padding: 16px 32px;
  border-bottom: 1px solid var(--border-color);
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: #6c757d;
  font-size: 14px;
}
.back-button:hover {
  color: var(--text-color);
}
</style>