<template>
  <div class="bookmark-list-component">
    <!-- 헤더 -->
    <div class="bookmark-header">
      <h3 class="bookmark-title">
        <n-icon size="20" class="bookmark-icon">
          <BookmarkOutline />
        </n-icon>
        북마크 ({{ bookmarkStore.bookmarkCount }})
      </h3>
      <div class="bookmark-controls">
        <n-input
          v-model:value="searchQuery"
          size="small"
          placeholder="북마크 검색..."
          clearable
          class="search-input"
        >
          <template #prefix>
            <n-icon size="16">
              <SearchOutline />
            </n-icon>
          </template>
        </n-input>
        <n-select
          v-model:value="sortBy"
          size="small"
          :options="sortOptions"
          style="width: 120px;"
        />
      </div>
    </div>

    <!-- 북마크 목록 -->
    <div class="bookmark-content">
      <div v-if="filteredBookmarks.length === 0" class="empty-state">
        <n-empty size="medium" description="북마크가 없습니다.">
          <template #icon>
            <n-icon size="48" color="#d9d9d9">
              <BookmarkOutline />
            </n-icon>
          </template>
        </n-empty>
      </div>

      <div v-else class="bookmark-grid">
        <div
          v-for="bookmark in filteredBookmarks"
          :key="bookmark.id"
          class="bookmark-card"
          @click="navigateToBookmark(bookmark)"
        >
          <div class="bookmark-card-header">
            <div class="bookmark-category">{{ bookmark.parentName }}</div>
            <n-button
              size="tiny"
              quaternary
              circle
              @click.stop="removeBookmark(bookmark.id)"
              class="remove-btn"
            >
              <template #icon>
                <n-icon size="14">
                  <CloseOutline />
                </n-icon>
              </template>
            </n-button>
          </div>

          <div class="bookmark-card-body">
            <h4 class="bookmark-name">{{ bookmark.name }}</h4>
            <p v-if="bookmark.description" class="bookmark-description">
              {{ truncateText(bookmark.description, 80) }}
            </p>
            <div class="bookmark-meta">
              <span class="bookmark-date">
                {{ formatDate(bookmark.createdAt) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBookmarkStore } from '@/stores/bookmarkStore'
import { BookmarkOutline, SearchOutline, CloseOutline } from '@vicons/ionicons5'

const router = useRouter()
const bookmarkStore = useBookmarkStore()

const searchQuery = ref('')
const sortBy = ref('createdAt')

const sortOptions = [
  { label: '최근 추가순', value: 'createdAt' },
  { label: '이름순', value: 'name' },
  { label: '카테고리순', value: 'category' }
]

const filteredBookmarks = computed(() => {
  let bookmarks = bookmarkStore.searchBookmarks(searchQuery.value)
  return bookmarkStore.sortBookmarks(sortBy.value).filter(bookmark =>
    searchQuery.value ? bookmarks.includes(bookmark) : true
  )
})

const navigateToBookmark = (bookmark) => {
  router.push(bookmark.url)
}

const removeBookmark = (bookmarkId) => {
  bookmarkStore.removeBookmark(bookmarkId)
}

const truncateText = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return '오늘'
  if (diffDays === 2) return '어제'
  if (diffDays <= 7) return `${diffDays - 1}일 전`

  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
.bookmark-list-component {
  max-width: 800px;
  margin: 0 auto;
}

.bookmark-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--border-color);
}

.bookmark-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--text-color);
}

.bookmark-icon {
  color: #ffc107;
}

.bookmark-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-input {
  width: 240px;
}

.bookmark-content {
  min-height: 200px;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}

.bookmark-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.bookmark-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.bookmark-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border-color: #ffc107;
}

.bookmark-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.bookmark-category {
  background: #e3f2fd;
  color: #1565c0;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.remove-btn {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.bookmark-card:hover .remove-btn {
  opacity: 1;
}

.remove-btn:hover {
  background: #ffebee;
  color: #d32f2f;
}

.bookmark-card-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bookmark-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
  line-height: 1.4;
}

.bookmark-description {
  font-size: 13px;
  color: #666;
  margin: 0;
  line-height: 1.4;
}

.bookmark-meta {
  display: flex;
  justify-content: flex-end;
}

.bookmark-date {
  font-size: 11px;
  color: #999;
}

/* 다크 모드 지원 */
.dark-mode .bookmark-category {
  background: #1e3a8a;
  color: #bfdbfe;
}

.dark-mode .bookmark-description {
  color: #9ca3af;
}

.dark-mode .bookmark-date {
  color: #6b7280;
}
</style>