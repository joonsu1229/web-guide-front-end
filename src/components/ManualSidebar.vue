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

<script setup>
import { ref, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { usePortalMenuStore } from '@/stores/usePortalMenuStore';
import { useCategoryStore } from '@/stores/useCategoryStore';
import CategoryItem from './CategoryItem.vue';

// --- Props & Emits ---
const props = defineProps({
  activeSection: { type: String, default: null },
  isDark: { type: Boolean, default: false },
  initialActiveMenu: { type: String, default: null },
  forceMenuOpen: { type: Boolean, default: false }
});
const emit = defineEmits(['section-change']);

// --- Stores ---
const portalMenuStore = usePortalMenuStore();
const { banners: portalMenus } = storeToRefs(portalMenuStore);

const categoryStore = useCategoryStore();
const { categoryTrees, loading, hasError } = storeToRefs(categoryStore);

// --- Refs ---
const collapsedSections = ref({});
const lastToggledSection = ref(null);

// --- Methods ---
const selectSection = (sectionId) => {
  emit('section-change', sectionId);
};

const toggleSection = (sectionKey) => {
  collapsedSections.value[sectionKey] = !collapsedSections.value[sectionKey];
  lastToggledSection.value = sectionKey;

  // 섹션을 열 때 카테고리 트리 로드
  if (!collapsedSections.value[sectionKey]) {
    categoryStore.fetchCategoryTree('P1', sectionKey);
  }
};

// --- Watchers & Lifecycle ---

// watchEffect will re-run whenever any of its dependencies change.
// This elegantly solves the race condition.
watchEffect(() => {
  // 1. Ensure portalMenus are loaded before doing anything.
  if (portalMenus.value.length === 0) {
    // Set default collapsed state to empty while menus are loading.
    collapsedSections.value = {};
    return;
  }

  // 2. Initialize all sections to be collapsed by default.
  const newCollapsedState = {};
  portalMenus.value.forEach(menu => {
    newCollapsedState[menu.section] = true; // true = collapsed
  });

  // 3. If forceMenuOpen is true and we have a menu title, open the target section.
  if (props.forceMenuOpen && props.initialActiveMenu) {
    const targetMenu = portalMenus.value.find(menu => menu.title === props.initialActiveMenu);
    if (targetMenu) {
      newCollapsedState[targetMenu.section] = false; // false = open
      // Also fetch the category tree for the opened section.
      categoryStore.fetchCategoryTree('P1', targetMenu.section);
    }
  }
  
  // 4. Update the reactive state.
  collapsedSections.value = newCollapsedState;
});
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