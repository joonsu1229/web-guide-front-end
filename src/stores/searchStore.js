import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { searchAPI } from '@/api/search'

export const useSearchStore = defineStore('search', () => {
  // State
  const searchResults = ref([])
  const loading = ref(false)
  const error = ref(null)
  const currentQuery = ref('')
  const searchType = ref('hybrid')
  const selectedCategory = ref('')
  const searchHistory = ref([])
  const totalResults = ref(0)
  const searchTime = ref(0)

  // Search options
  const searchOptions = ref({
    useFuzzy: false,
    usePhrase: false,
    limit: 10
  })

  // Boolean search options
  const booleanOptions = ref({
    mustHave: [],
    shouldHave: [],
    mustNotHave: []
  })

  // Computed
  const hasResults = computed(() => searchResults.value && searchResults.value.length > 0)
  const isLoading = computed(() => loading.value)
  const hasError = computed(() => error.value !== null)

  // Categories
  const categories = ref([
    { label: '전체', value: '' },
    { label: '기술', value: 'technology' },
    { label: '데이터베이스', value: 'database' },
    { label: 'AI', value: 'ai' }
  ])

  // Actions
  const performSearch = async (query, type = 'search') => {
    console.log(`[Search Store] 검색 시작. Query: "${query}"`);
    if (!query.trim()) return

    loading.value = true
    error.value = null
    currentQuery.value = query
    searchType.value = type

    const startTime = Date.now()

    try {
      console.log('[Search Store] API를 호출합니다 (searchAPI.search)');
      const results = await searchAPI.search(query, selectedCategory.value, searchOptions.value.limit)
      
      console.log('[Search Store] API가 반환한 원본 결과:', results);

      // API 결과가 유효한 배열인지 확인
      if (Array.isArray(results)) {
        searchResults.value = results
        totalResults.value = results.length
        console.log(`[Search Store] 검색 완료. 상태에 결과 ${results.length}개를 저장했습니다.`);
      } else {
        console.error('[Search Store] 에러: API 결과가 배열이 아닙니다.', results);
        throw new Error('검색 결과 형식이 올바르지 않습니다.');
      }

      searchTime.value = Date.now() - startTime
      addToHistory(query, type)

    } catch (err) {
      console.error('[Search Store] 검색 작업 중 에러가 발생했습니다:', err);
      error.value = err.message || '검색 중 오류가 발생했습니다.'
      searchResults.value = []
      totalResults.value = 0
    } finally {
      loading.value = false
      console.log('[Search Store] 검색 프로세스를 종료합니다.');
    }
  }

  const searchByCategory = async (category) => {
    loading.value = true
    error.value = null
    selectedCategory.value = category

    try {
      const results = await searchAPI.searchByCategory(category, searchOptions.value.limit)
      searchResults.value = results
      totalResults.value = results.length
      currentQuery.value = `카테고리: ${category}`
      searchType.value = 'category'
    } catch (err) {
      error.value = err.message || '카테고리 검색 중 오류가 발생했습니다.'
      searchResults.value = []
      totalResults.value = 0
    } finally {
      loading.value = false
    }
  }

  const addToHistory = (query, type) => {
    const historyItem = {
      query,
      type,
      category: selectedCategory.value,
      timestamp: new Date(),
      results: totalResults.value
    }
    searchHistory.value = searchHistory.value.filter(item => 
      !(item.query === query && item.type === type && item.category === selectedCategory.value)
    )
    searchHistory.value.unshift(historyItem)
    if (searchHistory.value.length > 20) {
      searchHistory.value = searchHistory.value.slice(0, 20)
    }
  }

  const clearResults = () => {
    searchResults.value = []
    currentQuery.value = ''
    error.value = null
    totalResults.value = 0
    searchTime.value = 0
    console.log('[Search Store] 검색 결과를 초기화했습니다.');
  }

  const clearHistory = () => {
    searchHistory.value = []
  }

  const setCategory = (category) => {
    selectedCategory.value = category
  }

  const setSearchOptions = (options) => {
    searchOptions.value = { ...searchOptions.value, ...options }
  }

  const setBooleanOptions = (options) => {
    booleanOptions.value = { ...booleanOptions.value, ...options }
  }

  const highlightText = (text, query) => {
    if (!query || !text) return text
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    return text.replace(regex, '<span class="search-highlight">$1</span>')
  }

  return {
    searchResults, loading, error, currentQuery, searchType, selectedCategory, searchHistory,
    totalResults, searchTime, searchOptions, booleanOptions, categories, hasResults, isLoading,
    hasError, performSearch, searchByCategory, clearResults, clearHistory, setCategory,
    setSearchOptions, setBooleanOptions, highlightText
  }
})