<template>
  <div class="notice-view" :class="{ 'dark-mode': isDark }">
    <!-- Header Section -->
    <div class="notice-header">
      <h1 class="page-title">공지사항</h1>
      <p class="page-description">워크쓰루 서비스 관련 공지사항을 확인하세요</p>
    </div>

    <!-- Content Section -->
    <div class="notice-content">
      <!-- Sidebar Categories -->
      <aside class="notice-sidebar">
        <div class="category-list">
          <button
            v-for="category in categoriesWithCounts"
            :key="category.key"
            class="category-item"
            :class="{ 'active': selectedCategory === category.key }"
            @click="selectCategory(category.key)"
          >
            <n-icon :size="18" class="category-icon">
              <component :is="category.icon" />
            </n-icon>
            <span>{{ category.label }}</span>
            <n-badge
              :value="category.count"
              :max="99"
              type="info"
              size="small"
              class="category-badge"
            />
          </button>
        </div>
      </aside>

      <!-- Main Notice List -->
      <main class="notice-main">
        <!-- Search Bar -->
        <div class="search-section">
          <n-input
            v-model:value="searchQuery"
            placeholder="검색어를 입력하세요."
            clearable
            @input="handleSearch"
          >
            <template #prefix>
              <n-icon :size="16">
                <SearchOutline />
              </n-icon>
            </template>
          </n-input>
        </div>

        <!-- Notice List -->
        <div class="notice-list">
          <div
            v-for="notice in filteredNotices"
            :key="notice.id"
            class="notice-item"
            @click="openNotice(notice)"
          >
            <div class="notice-header-info">
              <span class="notice-category" :class="`category-${notice.category}`">
                {{ getCategoryLabel(notice.category) }}
              </span>
              <span class="notice-date">{{ formatDate(notice.date) }}</span>
            </div>
            <h3 class="notice-title">{{ notice.title }}</h3>
            <p class="notice-summary">{{ notice.summary }}</p>
            <div class="notice-meta">
              <span class="notice-views">조회수 {{ notice.views }}</span>
              <n-icon v-if="notice.isNew" :size="16" class="new-icon">
                <FlashOutline />
              </n-icon>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination-section">
          <n-pagination
            v-model:page="currentPage"
            :page-count="totalPages"
            :page-size="pageSize"
            :item-count="totalNotices"
            show-size-picker
            :page-sizes="[9, 15, 30, 50]"
            show-quick-jumper
            @update:page="handlePageChange"
            @update:page-size="handlePageSizeChange"
          >
            <template #prefix="{ itemCount }">
              총 {{ itemCount }}개
            </template>
          </n-pagination>
        </div>

        <!-- Empty State -->
        <div v-if="filteredNotices.length === 0 && !isLoading" class="empty-state">
          <n-icon :size="48" class="empty-icon">
            <DocumentTextOutline />
          </n-icon>
          <h3>공지사항이 없습니다</h3>
          <p>{{ searchQuery ? '검색 결과가 없습니다.' : '등록된 공지사항이 없습니다.' }}</p>
        </div>
      </main>
    </div>

    <!-- Notice Detail Modal -->
    <n-modal
      v-model:show="showDetailModal"
      :mask-closable="true"
      preset="card"
      :title="selectedNotice?.title"
      style="width: 90%; max-width: 800px; max-height: 80vh;"
    >
      <div v-if="selectedNotice" class="notice-detail">
        <div class="notice-detail-header">
          <span class="notice-category" :class="`category-${selectedNotice.category}`">
            {{ getCategoryLabel(selectedNotice.category) }}
          </span>
          <span class="notice-date">{{ formatDate(selectedNotice.date) }}</span>
        </div>
        <div class="notice-content-body" v-html="selectedNotice.content"></div>
        <div class="notice-detail-footer">
          <span>조회수 {{ selectedNotice.views }}</span>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  SearchOutline,
  DocumentTextOutline,
  FlashOutline,
  NotificationsOutline,
  SettingsOutline,
  CalendarOutline,
  BuildOutline,
  MegaphoneOutline,
  InformationCircleOutline
} from '@vicons/ionicons5'

const props = defineProps({
  isDark: {
    type: Boolean,
    default: false
  }
})

// Reactive data
const selectedCategory = ref('all')
const searchQuery = ref('')
const isLoading = ref(false)
const showDetailModal = ref(false)
const selectedNotice = ref(null)
const currentPage = ref(1)
const pageSize = ref(9)

// Sample data - 실제 환경에서는 API에서 가져옴
const allNotices = ref([
  {
    id: 1,
    category: 'update',
    title: '워크쓰루 정기 업데이트 소식',
    summary: '새로운 기능과 개선사항이 포함된 업데이트가 출시되었습니다.',
    content: '<p>새로운 기능과 개선사항이 포함된 업데이트가 출시되었습니다. 자세한 내용을 확인해보세요.</p>',
    date: '2025.09.09',
    views: 1247,
    isNew: true
  },
  {
    id: 2,
    category: 'update',
    title: '워크쓰루 비정기 업데이트 소식',
    summary: '시스템 기능 개선 및 버그 수정 업데이트입니다.',
    content: '<p>시스템 기능이 개선되었습니다.</p>',
    date: '2025.09.04',
    views: 892,
    isNew: true
  },
  {
    id: 3,
    category: 'update',
    title: '워크쓰루 코어 비정기 업데이트 소식',
    summary: '코어 시스템의 안정성 개선 업데이트입니다.',
    content: '<p>코어 시스템이 더욱 안정적으로 개선되었습니다.</p>',
    date: '2025.09.02',
    views: 623,
    isNew: false
  },
  {
    id: 4,
    category: 'update',
    title: '워크쓰루 제휴, 법인카드 연동&전자세금계산서 신규 신청 제한 안내',
    summary: '제휴 서비스 관련 신규 신청 제한 안내입니다.',
    content: '<p>제휴 서비스의 신규 신청이 일시적으로 제한됩니다.</p>',
    date: '2025.08.21',
    views: 1456,
    isNew: false
  },
  {
    id: 5,
    category: 'event',
    title: '[교육] 워크쓰루 사용자 무료 교육 안내 | 25년 9월 12일(금), 25일(목)',
    summary: '워크쓰루 사용자를 위한 무료 교육 프로그램을 안내드립니다.',
    content: '<p>무료 교육 프로그램에 참여해보세요.</p>',
    date: '2025.08.20',
    views: 734,
    isNew: false
  },
  {
    id: 6,
    category: 'service',
    title: '워크쓰루 서비스 이용약관 업데이트',
    summary: '서비스 이용약관이 개정되었습니다.',
    content: '<p>서비스 이용약관이 개정되었습니다. 변경된 내용을 확인해주세요.</p>',
    date: '2025.08.15',
    views: 456,
    isNew: false
  },
  {
    id: 7,
    category: 'maintenance',
    title: '정기 서버 점검 안내',
    summary: '서버 점검으로 인한 서비스 일시 중단 안내입니다.',
    content: '<p>정기 서버 점검이 예정되어 있습니다.</p>',
    date: '2025.08.10',
    views: 789,
    isNew: false
  },
  {
    id: 8,
    category: 'announcement',
    title: '워크쓰루 고객지원센터 운영시간 변경',
    summary: '고객지원센터 운영시간이 변경되었습니다.',
    content: '<p>고객지원센터 운영시간이 변경되었습니다.</p>',
    date: '2025.08.05',
    views: 321,
    isNew: false
  },
  {
    id: 9,
    category: 'event',
    title: '워크쓰루 1주년 기념 이벤트',
    summary: '워크쓰루 1주년을 기념한 특별 이벤트를 진행합니다.',
    content: '<p>1주년 기념 이벤트에 참여해보세요.</p>',
    date: '2025.07.30',
    views: 1023,
    isNew: false
  },
  {
    id: 10,
    category: 'update',
    title: '워크쓰루 모바일 앱 업데이트',
    summary: '모바일 앱의 새로운 기능이 추가되었습니다.',
    content: '<p>모바일 앱이 업데이트되었습니다.</p>',
    date: '2025.07.25',
    views: 567,
    isNew: false
  },
  {
    id: 11,
    category: 'service',
    title: '워크쓰루 신규 기능 소개',
    summary: '새롭게 추가된 기능들을 소개합니다.',
    content: '<p>신규 기능들을 확인해보세요.</p>',
    date: '2025.07.20',
    views: 890,
    isNew: false
  },
  {
    id: 12,
    category: 'government',
    title: '공공기관 대상 특별 할인 안내',
    summary: '공공기관을 대상으로 한 특별 할인 혜택을 제공합니다.',
    content: '<p>공공기관 특별 할인 혜택을 확인해보세요.</p>',
    date: '2025.07.15',
    views: 234,
    isNew: false
  }
])

const categories = [
  { key: 'all', label: '전체', icon: DocumentTextOutline, count: 0 },
  { key: 'update', label: '업데이트', icon: FlashOutline, count: 0 },
  { key: 'service', label: '서비스', icon: SettingsOutline, count: 0 },
  { key: 'event', label: '이벤트', icon: CalendarOutline, count: 0 },
  { key: 'maintenance', label: '작업', icon: BuildOutline, count: 0 },
  { key: 'government', label: '공공기관', icon: MegaphoneOutline, count: 0 },
  { key: 'announcement', label: '공고', icon: InformationCircleOutline, count: 0 }
]

// Computed properties
const filteredAllNotices = computed(() => {
  let notices = allNotices.value

  // Category filter
  if (selectedCategory.value !== 'all') {
    notices = notices.filter(notice => notice.category === selectedCategory.value)
  }

  // Search filter
  if (searchQuery.value) {
    notices = notices.filter(notice =>
      notice.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      notice.summary.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  return notices
})

const filteredNotices = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return filteredAllNotices.value.slice(startIndex, endIndex)
})

const totalNotices = computed(() => {
  return filteredAllNotices.value.length
})

const totalPages = computed(() => {
  return Math.ceil(totalNotices.value / pageSize.value)
})

// Methods
const selectCategory = (categoryKey) => {
  selectedCategory.value = categoryKey
  currentPage.value = 1
}

const handleSearch = () => {
  currentPage.value = 1
}

const handlePageChange = (page) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handlePageSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

const openNotice = (notice) => {
  selectedNotice.value = notice
  showDetailModal.value = true
  // 조회수 증가 (실제 환경에서는 API 호출)
  notice.views += 1
}

const getCategoryLabel = (categoryKey) => {
  return categories.find(cat => cat.key === categoryKey)?.label || '기타'
}

const formatDate = (dateString) => {
  return dateString
}

// Computed property for categories with updated counts
const categoriesWithCounts = computed(() => {
  return categories.map(category => ({
    ...category,
    count: category.key === 'all'
      ? allNotices.value.length
      : allNotices.value.filter(notice => notice.category === category.key).length
  }))
})

</script>

<style scoped>
.notice-view {
  min-height: 100vh;
  background-color: #f8fafc;
  transition: all 0.3s ease;
}

.notice-view.dark-mode {
  background-color: #1a1d21;
}

.notice-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 2rem;
  text-align: center;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-description {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

.notice-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
}

.notice-sidebar {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  height: fit-content;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.dark-mode .notice-sidebar {
  background: #2d3748;
  border-color: #4a5568;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  font-size: 0.9rem;
  color: #64748b;
}

.category-item:hover {
  background: #f1f5f9;
  color: #334155;
}

.category-item.active {
  background: #3b82f6;
  color: white;
}

.dark-mode .category-item {
  color: #cbd5e0;
}

.dark-mode .category-item:hover {
  background: #4a5568;
  color: #e2e8f0;
}

.dark-mode .category-item.active {
  background: #3b82f6;
  color: white;
}

.notice-main {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.dark-mode .notice-main {
  background: #2d3748;
  border-color: #4a5568;
}

.search-section {
  margin-bottom: 2rem;
}

.notice-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.notice-item {
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f8fafc;
}

.notice-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.dark-mode .notice-item {
  background: #1a202c;
  border-color: #4a5568;
}

.dark-mode .notice-item:hover {
  border-color: #3b82f6;
}

.notice-header-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.notice-category {
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.category-update {
  background: #dbeafe;
  color: #1d4ed8;
}

.category-service {
  background: #d1fae5;
  color: #065f46;
}

.category-event {
  background: #fed7d7;
  color: #c53030;
}

.category-maintenance {
  background: #fef3c7;
  color: #d97706;
}

.category-government {
  background: #e0e7ff;
  color: #5b21b6;
}

.category-announcement {
  background: #f3e8ff;
  color: #7c3aed;
}

.notice-date {
  font-size: 0.875rem;
  color: #64748b;
}

.dark-mode .notice-date {
  color: #a0aec0;
}

.notice-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #1e293b;
  line-height: 1.4;
}

.dark-mode .notice-title {
  color: #f7fafc;
}

.notice-summary {
  font-size: 0.9rem;
  color: #64748b;
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

.dark-mode .notice-summary {
  color: #a0aec0;
}

.notice-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notice-views {
  font-size: 0.8rem;
  color: #94a3b8;
}

.dark-mode .notice-views {
  color: #718096;
}

.new-icon {
  color: #f59e0b;
}

.category-badge {
  margin-left: auto;
}

.pagination-section {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  padding: 1rem 0;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #64748b;
}

.dark-mode .empty-state {
  color: #a0aec0;
}

.empty-icon {
  margin-bottom: 1rem;
  opacity: 0.5;
}

.notice-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.dark-mode .notice-detail-header {
  border-bottom-color: #4a5568;
}

.notice-content-body {
  line-height: 1.6;
  color: #374151;
  margin-bottom: 1.5rem;
}

.dark-mode .notice-content-body {
  color: #d1d5db;
}

.notice-detail-footer {
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  font-size: 0.875rem;
  color: #64748b;
}

.dark-mode .notice-detail-footer {
  border-top-color: #4a5568;
  color: #a0aec0;
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
  .notice-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .notice-sidebar {
    order: 2;
  }

  .notice-main {
    order: 1;
  }

  .category-list {
    flex-direction: row;
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .notice-content {
    padding: 1rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .notice-header {
    padding: 2rem 1rem;
  }

  .notice-item {
    padding: 1rem;
  }

  .notice-header-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>