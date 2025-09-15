import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { portalMenuAPI } from '@/api/portalMenuAPI'

export const usePortalMenuStore = defineStore('portalMenu', () => {
  const banners = ref([])
  const loading = ref(false)
  const error = ref(null)

  const isLoading = computed(() => loading.value)
  const hasError = computed(() => error.value !== null)

  async function fetchPortalMenus(portalId) {
    loading.value = true
    error.value = null
    try {
      const data = await portalMenuAPI.getPortalMenus(portalId)
      
      const transformedData = data.map(menu => {
        let tagsArray = []
        // menu.tags가 실제 문자열이고, 빈 문자열이 아닐 때만 split을 실행하도록 수정
        if (typeof menu.tags === 'string' && menu.tags.length > 0) {
          tagsArray = menu.tags.split(',').map(tag => tag.trim())
        }
        return {
          ...menu,
          tags: tagsArray
        }
      })

      banners.value = transformedData
    } catch (err) {
      error.value = err.message || '메뉴 정보를 불러오는 중 오류가 발생했습니다.'
      banners.value = []
    } finally {
      loading.value = false
    }
  }

  return {
    banners,
    loading,
    error,
    isLoading,
    hasError,
    fetchPortalMenus
  }
})