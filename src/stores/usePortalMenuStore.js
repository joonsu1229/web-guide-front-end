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

      if (Array.isArray(menu.tags)) {
        // 이미 배열인 경우
        tagsArray = menu.tags.map(tag => tag.trim())
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

  async function createPortalMenu(menuDto) {
    loading.value = true
    error.value = null
    try {
      const data = await portalMenuAPI.createPortalMenu(menuDto)
      await fetchPortalMenus(menuDto.portalId || 'P1')
      return data
    } catch (err) {
      error.value = err.message || '메뉴 생성 중 오류가 발생했습니다.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updatePortalMenu(id, menuDto) {
    loading.value = true
    error.value = null
    try {
      const data = await portalMenuAPI.updatePortalMenu(id, menuDto)
      await fetchPortalMenus(menuDto.portalId || 'P1')
      return data
    } catch (err) {
      error.value = err.message || '메뉴 수정 중 오류가 발생했습니다.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deletePortalMenu(id, portalId) {
    loading.value = true
    error.value = null
    try {
      await portalMenuAPI.deletePortalMenu(id, portalId)
      await fetchPortalMenus(portalId)
    } catch (err) {
      error.value = err.message || '메뉴 삭제 중 오류가 발생했습니다.'
      throw err
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
    fetchPortalMenus,
    createPortalMenu,
    updatePortalMenu,
    deletePortalMenu
  }
})