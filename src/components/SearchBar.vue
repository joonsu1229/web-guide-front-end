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

    <n-drawer v-model:show="showDrawer" :width="650" placement="right">
      <n-drawer-content closable>
        <template #header>
          <div class="drawer-header">
            <div class="search-query">
              <n-icon size="18" class="search-header-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19S2 15.194 2 10.5S5.806 2 10.5 2S19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </n-icon>
              <span>'{{ currentQuery }}'에 대한 검색 결과</span>
            </div>
            <div v-if="hasResults" class="result-count">
              <n-tag type="info" size="small" round>
                총 {{ searchResults.length }}개 결과
              </n-tag>
            </div>
          </div>
        </template>

        <div v-if="hasResults" class="results-container">
          <div
            v-for="(result, index) in searchResults"
            :key="result.document.id"
            class="result-card"
          >
            <div class="result-header">
              <div class="result-info">
                <n-tag type="success" size="tiny" round>{{ index + 1 }}</n-tag>
              </div>
              <n-button
                size="small"
                type="primary"
                ghost
                round
                @click="navigateToDocument(result.document)"
                class="navigate-button"
              >
                <template #icon>
                  <n-icon>
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </n-icon>
                </template>
                문서 보기
              </n-button>
            </div>
            <div class="result-content" v-html="renderMarkdown(result.document.contentBody)"></div>
          </div>
        </div>

        <div v-else class="empty-container">
          <n-empty size="large" description="표시할 검색 결과가 없습니다.">
            <template #icon>
              <n-icon size="48" color="#d9d9d9">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19S2 15.194 2 10.5S5.806 2 10.5 2S19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </n-icon>
            </template>
          </n-empty>
        </div>

        <template #footer>
          <div class="drawer-footer">
            <n-button @click="closeDrawer" type="primary" round>
              <template #icon>
                <n-icon>
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </n-icon>
              </template>
              닫기
            </n-button>
          </div>
        </template>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSearchStore } from '@/stores/searchStore';
import { useUtilStore } from '@/stores/useUtilStore';
import { storeToRefs } from 'pinia';
import { NDrawer, NDrawerContent, NButton, NSpin, NEmpty, NInput, NInputGroup, NIcon, NTag } from 'naive-ui';

const searchStore = useSearchStore();
const utilStore = useUtilStore();
const { hasResults, searchResults, isLoading, currentQuery } = storeToRefs(searchStore);
const router = useRouter();

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

const navigateToDocument = async (document) => {
  const categoryId = document.categoryId || document.category_id;
  if (!categoryId) {
    console.error('문서에 categoryId가 없습니다:', document);
    return;
  }

  // flatCategoriesWithMenuTitle is a computed ref, so access with .value
  const categoryDetails = utilStore.flatCategoriesWithMenuTitle.find(
    cat => cat.id === categoryId
  );

  if (categoryDetails && categoryDetails.section) {
    console.log(`카테고리 정보 찾음:`, categoryDetails);
    
    router.push({
      path: `/guide/${categoryDetails.section}/${categoryId}`,
      query: {
        activeMenu: categoryDetails.menuTitle,
        menuOpen: 'true',
      },
    });
    
    showDrawer.value = false;

  } else {
    console.warn(`'${categoryId}'에 대한 카테고리 상세 정보를 찾을 수 없습니다. Fallback을 사용합니다.`);
    // Fallback to old method if details are not found
    router.push(`/guide/P1/${categoryId}`);
    showDrawer.value = false;
  }
};

// Markdown 렌더링 함수
const renderMarkdown = (text) => {
  if (!text || typeof text !== 'string') return '';

  let html = text
    // 코드 블록 (```)
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    // 인라인 코드 (`)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // 볼드 텍스트 (**)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // 이탤릭 텍스트 (*)
    .replace(/\*([^\*]+)\*/g, '<em>$1</em>')
    // 헤더들
    .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    // 리스트
    .replace(/^\* (.*$)/gm, '<li>$1</li>')
    .replace(/^- (.*$)/gm, '<li>$1</li>')
    .replace(/^\d+\. (.*$)/gm, '<li>$1</li>');

  // 연속된 li 태그를 ul로 감싸기
  html = html.replace(/(<li>.*?<\/li>\s*)+/gs, '<ul>$&</ul>');

  // 문단 분리 및 정리
  return html.split(/\n\s*\n/).map(section => {
    // 이미 HTML 태그가 있는 섹션은 그대로 유지
    if (section.match(/<(h[1-6]|ul|li|pre|code)/)) {
      return section.replace(/\n/g, ' ');
    }
    // 일반 텍스트는 p 태그로 감싸기
    return section.trim() ? `<p>${section.replace(/\n/g, '<br>')}</p>` : '';
  }).filter(p => p).join('');
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

/* Drawer 헤더 스타일 */
.drawer-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 4px 0;
}

.search-query {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.search-header-icon {
  color: #18a058;
}

.result-count {
  display: flex;
  justify-content: flex-start;
}

/* Drawer 푸터 스타일 */
.drawer-footer {
  display: flex;
  justify-content: center;
  padding: 8px 0;
}

/* 결과 컨테이너 스타일 */
.results-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-card {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.2s ease;
}

.result-card:hover {
  background: #f5f5f5;
  border-color: #d9d9d9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e8e8e8;
}

.result-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.navigate-button {
  flex-shrink: 0;
}

.result-score {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

/* 결과 콘텐츠 스타일 */
.result-content {
  line-height: 1.75;
  color: #333;
}

:deep(.result-content h1) {
  font-size: 1.5em;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 16px;
  color: #333;
}

:deep(.result-content h2) {
  font-size: 1.3em;
  font-weight: 600;
  margin: 20px 0 12px;
  color: #444;
}

:deep(.result-content h3) {
  font-size: 1.1em;
  font-weight: 600;
  margin: 16px 0 8px;
  color: #555;
}

:deep(.result-content p) {
  margin-bottom: 16px;
  color: #555;
}

:deep(.result-content ul) {
  list-style-type: disc;
  margin-bottom: 16px;
  padding-left: 24px;
}

:deep(.result-content li) {
  margin-bottom: 6px;
}

:deep(.result-content strong) {
  font-weight: 600;
  color: #000;
  background: rgba(24, 160, 88, 0.1);
  padding: 2px 4px;
  border-radius: 4px;
}

:deep(.result-content em) {
  font-style: italic;
  color: #666;
}

:deep(.result-content code) {
  background: #f5f5f5;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 2px 6px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9em;
  color: #d63384;
}

:deep(.result-content pre) {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  overflow-x: auto;
}

:deep(.result-content pre code) {
  background: none;
  border: none;
  padding: 0;
  color: #333;
  font-size: 0.85em;
  line-height: 1.4;
}

</style>