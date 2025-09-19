// src/components/ManualSidebar.vue

<template>
  <div class="sidebar" :class="{ 'dark-mode': isDark }">
    <nav class="sidebar-nav">
      <div v-if="portalMenuStore.isLoading" class="nav-section-title">
        메뉴 로딩 중...
      </div>
      <div v-else-if="portalMenuStore.hasError" class="nav-section-title">
        오류: {{ portalMenuStore.error }}
      </div>

      <div v-for="menu in portalMenus" :key="menu.section" class="nav-section">
        <h3
          class="nav-section-title collapsible"
          @click="toggleSection(menu.section)"
        >
          <span
            class="toggle-icon"
            :class="{ expanded: !collapsedSections[menu.section] }"
            >&gt;</span
          >
          {{ menu.title }}
        </h3>
        <ul class="nav-list" v-show="!collapsedSections[menu.section]">
          <li v-if="loading && lastToggledSection === menu.section" class="nav-item status">
            - 로딩 중...
          </li>
          <li v-else-if="hasError && lastToggledSection === menu.section" class="nav-item status">
            - 오류 발생
          </li>
          <CategoryItem
            v-for="category in categoryTrees[menu.section]"
            :key="category.id"
            :category="category"
            :active-section="activeSection"
            @section-change="selectSection"
          />
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { usePortalMenuStore } from '@/stores/usePortalMenuStore';
import { useCategoryStore } from '@/stores/useCategoryStore';
import CategoryItem from './CategoryItem.vue';

export default {
  name: 'ManualSidebar',
  components: {
    CategoryItem
  },
  props: {
    activeSection: {
      type: String,
      default: null
    },
    isDark: {
      type: Boolean,
      default: false
    },
    initialActiveMenu: {
      type: String,
      default: null
    },
    forceMenuOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['section-change'],
  data() {
    return {
      collapsedSections: {},
      portalMenuStore: usePortalMenuStore(), // portalMenuStore의 isLoading을 직접 사용하기 위해 data에 선언
      lastToggledSection: null
    }
  },
  computed: {
    ...mapState(usePortalMenuStore, {
      portalMenus: 'banners' 
    }),
    // ✅ useCategoryStore의 state들을 컴포넌트의 computed 속성으로 연결
    ...mapState(useCategoryStore, [
      'categoryTrees', 
      'loading', // 'this.loading'으로 접근 가능
      'hasError'
    ])
  },
  methods: {
    ...mapActions(useCategoryStore, ['fetchCategoryTree']),

    selectSection(sectionId) {
      this.$emit('section-change', sectionId);
    },    
    
    toggleSection(sectionKey) {
      this.collapsedSections[sectionKey] = !this.collapsedSections[sectionKey];
      this.lastToggledSection = sectionKey;

      if (!this.collapsedSections[sectionKey]) {
        this.fetchCategoryTree('P1', sectionKey);
      }
    },
    
    initializeCollapsedState() {
      const state = {};
      const menus = [...this.portalMenus].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

      // 기본적으로 모든 메뉴를 닫힌 상태로 설정
      for (const menu of menus) {
        state[menu.section] = true; // true = 닫힌 상태
      }

      // 배너에서 온 경우 해당 메뉴만 열기
      if (this.$route.query.menuOpen === 'true' && this.$route.query.activeMenu) {
        const targetMenu = this.portalMenus.find(menu => menu.title === this.$route.query.activeMenu);
        if (targetMenu) {
          state[targetMenu.section] = false; // false = 열린 상태
          console.log('초기화 시 특정 메뉴 열기:', targetMenu.title, targetMenu.section);
        }
      }

      this.collapsedSections = state;
      console.log('메뉴 초기화 완료:', state);
    },

    handleInitialActiveMenu() {
      if (this.forceMenuOpen && this.initialActiveMenu && this.portalMenus.length > 0) {
        // 배너에서 전달된 메뉴 제목으로 해당 메뉴의 section을 찾기
        const targetMenu = this.portalMenus.find(menu => menu.title === this.initialActiveMenu);
        if (targetMenu) {
          // 해당 메뉴를 열기 (Vue.set 대신 직접 할당)
          this.collapsedSections = {
            ...this.collapsedSections,
            [targetMenu.section]: false
          };
          // 카테고리 데이터도 미리 로드
          this.fetchCategoryTree('P1', targetMenu.section);
          console.log('메뉴 열림:', targetMenu.title, targetMenu.section);
        }
      }
    },

    forceOpenMenu(menuTitle) {
      const targetMenu = this.portalMenus.find(menu => menu.title === menuTitle);
      if (targetMenu) {
        console.log('강제로 메뉴 열기:', menuTitle, targetMenu.section);
        // 강제로 상태 업데이트
        const newState = { ...this.collapsedSections };
        newState[targetMenu.section] = false;
        this.collapsedSections = newState;
        this.fetchCategoryTree('P1', targetMenu.section);
        console.log('메뉴 상태 업데이트 완료:', this.collapsedSections);
      }
    }
  },
  async created() {
    await this.portalMenuStore.fetchPortalMenus('P1');
    this.initializeCollapsedState();
  },
  watch: {
    collapsedSections: {
      handler(newVal) {
        console.log('collapsedSections 변경됨:', newVal);
      },
      deep: true
    },
    '$route.query': {
      handler(newQuery) {
        console.log('쿼리 변경됨:', newQuery);
        if (newQuery.menuOpen === 'true' && newQuery.activeMenu && this.portalMenus.length > 0) {
          this.$nextTick(() => {
            this.forceOpenMenu(newQuery.activeMenu);
          });
        }
      }
    },
    portalMenus: {
      handler() {
        console.log('portalMenus 로드됨:', this.portalMenus.length);
        if (this.portalMenus.length > 0 && this.$route.query.menuOpen === 'true' && this.$route.query.activeMenu) {
          this.$nextTick(() => {
            this.forceOpenMenu(this.$route.query.activeMenu);
          });
        }
      }
    }
  }
}
</script>

<style scoped>
/* 스타일은 이전과 동일 */
.sidebar {
  width: 280px;
  background: var(--card-bg);
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
  position: sticky;
  top: 0;
  height: 100vh;
}

.sidebar-nav {
  padding: 24px 0;
}

.nav-section {
  margin-bottom: 4px;
}

.nav-section-title {
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nav-section-title.collapsible {
  cursor: pointer;
  padding: 10px 24px;
  margin: 0;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  user-select: none;
}

.nav-section-title.collapsible:hover {
  background-color: var(--hover-bg);
  color: var(--text-color);
}

.toggle-icon {
  margin-right: 8px;
  font-size: 12px;
  transition: transform 0.2s ease;
  display: inline-block;
  width: 12px;
}

.toggle-icon.expanded {
  transform: rotate(90deg);
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  padding: 8px 24px;
  cursor: pointer;
  color: #6c757d;
  font-size: 14px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
}

.nav-item.status {
  color: #adb5bd;
  font-style: italic;
  cursor: default;
}

.nav-item:hover {
  background-color: var(--hover-bg);
  color: var(--text-color);
}

.nav-item.active {
  background-color: #e3f2fd;
  color: #1976d2;
  border-right: 3px solid #1976d2;
  font-weight: 500;
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
  }
}
</style>