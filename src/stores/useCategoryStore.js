// src/stores/useCategoryStore.js

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { categoryAPI } from '@/api/categoryAPI'

export const useCategoryStore = defineStore('category', () => {
  const categoryTrees = ref({})
  const loading = ref(false) // ✅ `loading` 상태 변수 선언
  const error = ref(null)

  const isLoading = computed(() => loading.value)
  const hasError = computed(() => error.value !== null)

  async function fetchCategoryTree(portalId, section) {
    if (!section || categoryTrees.value[section]) {
      return
    }
    
    loading.value = true // API 호출 시작 시 true
    error.value = null
    try {
      const data = await categoryAPI.getCategoryTree(portalId, section)
      categoryTrees.value[section] = data
    } catch (err) {
      error.value = err.message || '카테고리 정보를 불러오는 중 오류가 발생했습니다.'
      categoryTrees.value[section] = []
    } finally {
      loading.value = false // API 호출 완료 시 false
    }
  }

  return {
    categoryTrees,
    loading, // 외부(컴포넌트)에서 사용할 수 있도록 반환
    error,
    isLoading,
    hasError,
    fetchCategoryTree
  }
})