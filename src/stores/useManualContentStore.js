// src/stores/useManualContentStore.js

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { manualContentAPI } from '@/api/manualContentAPI' // import 이름 변경

export const useManualContentStore = defineStore('manualContent', () => { // 스토어 ID 변경
  const currentContent = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchContent(portalId, categoryId) {
    if (!categoryId) {
      currentContent.value = null
      return
    }
    loading.value = true
    error.value = null
    try {
      // API 객체 이름 변경
      currentContent.value = await manualContentAPI.getContent(portalId, categoryId)
    } catch (err) {
      error.value = '콘텐츠를 불러오지 못했습니다.'
      currentContent.value = null
    } finally {
      loading.value = false
    }
  }

  return { currentContent, loading, error, fetchContent }
})