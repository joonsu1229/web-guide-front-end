import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { noticeSearchAPI } from '@/api/noticeSearch'

export const useNoticeSearchStore = defineStore('noticeSearch', () => {

  const notices = ref([])
  const loading = ref(false)
  const error = ref(null)
  const selectedCategory = ref('all')
  const keyword = ref('')
  const total = ref(0)

  const searchOptions = ref({
    limit: 50
  })

  const hasResults = computed(() => notices.value.length > 0)

  /* --------------------------------------------------------
  * 공지 검색 (키워드 + 카테고리)
  -------------------------------------------------------- */
  const performSearch = async (query = '') => {
    loading.value = true
    keyword.value = query
    error.value = null

    try {
      const result = await noticeSearchAPI.search(
        query,
        selectedCategory.value === 'all' ? '' : selectedCategory.value,  // 🔥 fix
        searchOptions.value.limit
      )

      notices.value = result
      total.value = result.length

    } catch (err) {
      error.value = '공지 검색 중 오류 발생'
      notices.value = []
      total.value = 0
    } finally {
      loading.value = false
    }
  }

  /* --------------------------------------------------------
   * 카테고리 선택 검색 (API 호출)
  -------------------------------------------------------- */
  const searchByCategory = async (category) => {
    loading.value = true
    selectedCategory.value = category
    error.value = null

    try {
      const result = await noticeSearchAPI.search(
        keyword.value,
        category === 'all' ? '' : category,     // 🔥 fix
        searchOptions.value.limit
      )

      notices.value = result
      total.value = result.length

    } catch (err) {
      error.value = '카테고리 검색 오류'
      notices.value = []
    } finally {
      loading.value = false
    }
  }

  /* --------------------------------------------------------
   *상세 보기
  -------------------------------------------------------- */
  const getDetail = async (id) => {
    return await noticeSearchAPI.getDetail(id)
  }

  return {
    // state
    notices,
    loading,
    error,
    keyword,
    selectedCategory,
    total,
    searchOptions,

    // computed
    hasResults,

    // actions
    performSearch,
    searchByCategory,
    getDetail
  }
})
