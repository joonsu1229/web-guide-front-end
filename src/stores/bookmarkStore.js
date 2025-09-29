import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useBookmarkStore = defineStore('bookmark', () => {
  const bookmarks = ref([])

  // 로컬스토리지에서 북마크 로드
  const loadBookmarks = () => {
    try {
      const stored = localStorage.getItem('workthrough-bookmarks')
      if (stored) {
        bookmarks.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('북마크 로드 중 오류:', error)
      bookmarks.value = []
    }
  }

  // 로컬스토리지에 북마크 저장
  const saveBookmarks = () => {
    try {
      localStorage.setItem('workthrough-bookmarks', JSON.stringify(bookmarks.value))
    } catch (error) {
      console.error('북마크 저장 중 오류:', error)
    }
  }

  // 북마크 추가
  const addBookmark = (item) => {
    const bookmark = {
      id: item.id,
      name: item.name,
      parentName: item.parentName || '기타',
      section: item.section || 'P1',
      url: `/guide/${item.section || 'P1'}/${item.id}`,
      createdAt: new Date().toISOString(),
      description: item.description || ''
    }

    // 중복 체크
    if (!isBookmarked(item.id)) {
      bookmarks.value.unshift(bookmark) // 최신순으로 추가
      saveBookmarks()
      return true
    }
    return false
  }

  // 북마크 제거
  const removeBookmark = (itemId) => {
    const index = bookmarks.value.findIndex(bookmark => bookmark.id === itemId)
    if (index !== -1) {
      bookmarks.value.splice(index, 1)
      saveBookmarks()
      return true
    }
    return false
  }

  // 북마크 토글
  const toggleBookmark = (item) => {
    if (isBookmarked(item.id)) {
      return removeBookmark(item.id)
    } else {
      return addBookmark(item)
    }
  }

  // 북마크 여부 확인
  const isBookmarked = (itemId) => {
    return bookmarks.value.some(bookmark => bookmark.id === itemId)
  }

  // 북마크 개수
  const bookmarkCount = computed(() => bookmarks.value.length)

  // 카테고리별 북마크 그룹핑
  const bookmarksByCategory = computed(() => {
    const grouped = {}
    bookmarks.value.forEach(bookmark => {
      const category = bookmark.parentName || '기타'
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(bookmark)
    })
    return grouped
  })

  // 북마크 검색
  const searchBookmarks = (query) => {
    if (!query.trim()) return bookmarks.value

    const lowerQuery = query.toLowerCase()
    return bookmarks.value.filter(bookmark =>
      bookmark.name.toLowerCase().includes(lowerQuery) ||
      bookmark.parentName.toLowerCase().includes(lowerQuery) ||
      bookmark.description.toLowerCase().includes(lowerQuery)
    )
  }

  // 북마크 정렬
  const sortBookmarks = (sortBy = 'createdAt') => {
    const sorted = [...bookmarks.value]

    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name, 'ko'))
      case 'category':
        return sorted.sort((a, b) => a.parentName.localeCompare(b.parentName, 'ko'))
      case 'createdAt':
      default:
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
  }

  // 초기화 시 북마크 로드
  loadBookmarks()

  return {
    bookmarks,
    bookmarkCount,
    bookmarksByCategory,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
    searchBookmarks,
    sortBookmarks,
    loadBookmarks
  }
})