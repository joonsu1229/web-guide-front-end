<template>
  <div class="search-bar-root">
    <n-input-group class="search-container">
      <n-input
        v-model:value="searchQuery"
        :loading="isLoading"
        size="large"
        round
        placeholder="궁금한 것을 검색해보세요"
        clearable
        @keydown.enter="handleSearch"
      >
        <template #prefix>
          <div class="search-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19S2 15.194 2 10.5S5.806 2 10.5 2S19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
        </template>
      </n-input>
    </n-input-group>

    <n-drawer v-model:show="showDrawer" :width="600" placement="right">
      <n-drawer-content :title="`'${currentQuery}'에 대한 검색 결과`" closable>
        <div v-if="hasResults">
          <div
            v-for="result in searchResults"
            :key="result.document.id"
            class="result-content-card"
            v-html="renderMarkdown(result.document.contentBody)"
          ></div>
        </div>
        <div v-else class="empty-container">
           <n-empty size="large" description="표시할 검색 결과가 없습니다." />
        </div>
        <template #footer>
          <n-button @click="closeDrawer">닫기</n-button>
        </template>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useSearchStore } from '@/stores/searchStore';
import { storeToRefs } from 'pinia';
import { NDrawer, NDrawerContent, NButton, NSpin, NEmpty, NInput, NInputGroup } from 'naive-ui';

const searchStore = useSearchStore();
const { hasResults, searchResults, isLoading, currentQuery } = storeToRefs(searchStore);

const searchQuery = ref('');
const showDrawer = ref(false);

const handleSearch = async () => {
  if (!searchQuery.value.trim() || isLoading.value) return;
  
  // 검색을 실행합니다. `isLoading` 상태가 true로 변경됩니다.
  await searchStore.performSearch(searchQuery.value);

  // 검색이 완료되면 `isLoading`은 false가 되고, 결과창을 엽니다.
  showDrawer.value = true;
};

const closeDrawer = () => {
  showDrawer.value = false;
};

// Markdown 렌더링 함수
const renderMarkdown = (text) => {
  if (!text || typeof text !== 'string') return '';
  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^\* (.*$)/gm, '<li>$1</li>')
    .replace(/^- (.*$)/gm, '<li>$1</li>');
  
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>').replace(/<\/ul>\s*<ul>/g, '');
  
  return html.split(/\n\n+/).map(p => {
    if (p.match(/<(h1|h2|h3|ul|li)/)) {
      return p.replace(/\n/g, '<br>');
    }
    return `<p>${p.replace(/\n/g, '<br>')}</p>`;
  }).join('').replace(/<p><\/p>/g, '');
};
</script>

<style scoped>
.search-container {
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border-radius: 50px;
}

/* Naive UI Input 컴포넌트 커스텀 */
:deep(.n-input) {
  --n-border-radius: 50px !important;
  --n-padding-left: 45px !important;
}

.search-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
}

.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

/* Drawer 내부 컨텐츠 스타일 */
:deep(.result-content-card) {
  line-height: 1.75;
  color: #333;
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
}
:deep(.result-content-card:last-child) {
  border-bottom: none;
}
:deep(.result-content-card h1) {
  font-size: 1.6em;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}
:deep(.result-content-card h2) {
  font-size: 1.3em;
  font-weight: 600;
  margin: 24px 0 12px;
}
:deep(.result-content-card p) {
  margin-bottom: 16px;
  color: #555;
}
:deep(.result-content-card ul) {
  list-style-type: disc;
  margin-bottom: 16px;
  padding-left: 24px;
}
:deep(.result-content-card li) {
  margin-bottom: 8px;
}
:deep(.result-content-card strong) {
  font-weight: 600;
  color: #000;
}
</style>