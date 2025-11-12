import apiClient from './index'

export const searchAPI = {
  // 하이브리드 검색
  async search(query, category = '', limit = 10) {
    const params = { query, limit }
    if (category) params.category = category

    const response = await apiClient.get('/search', { params })
    return response.data
  },


  // 카테고리별 검색
  async searchByCategory(category, limit = 10) {
    const response = await apiClient.get(`/search/category/${category}`, {
      params: { limit }
    })
    return response.data
  }
}