import apiClient from './index'

export const noticeSearchAPI = {

  /* ------------------------------------------------------
    1) 공지 카테고리 목록 (DB 기반)
    GET /api/notice/categories
  ------------------------------------------------------ */
  async fetchCategories() {
    const response = await apiClient.get('/notice/categories')
    return response.data
  },

  /* ------------------------------------------------------
    2) 공지 검색 (키워드 + 카테고리)
    GET /api/notice/search?keyword=&category=&limit=
  ------------------------------------------------------ */
  async search(keyword = '', category = '', limit = 50) {
    const params = { keyword, limit }
    if (category && category !== 'all') params.category = category

    const response = await apiClient.get('/notice/search', { params })
    return response.data
  },

  /* ------------------------------------------------------
    3) 카테고리별 검색
       사실 search() 와 동일하지만 
       Vue에서 category 클릭 시 간편 호출용
  ------------------------------------------------------ */
  async searchByCategory(category, limit = 50) {
    const params = { category, limit }
    const response = await apiClient.get('/notice/search', { params })
    return response.data
  },

  /* ------------------------------------------------------
    4) 공지 상세 조회
    GET /api/notice/{id}
  ------------------------------------------------------ */
  async getDetail(id) {
    const response = await apiClient.get(`/notice/${id}`)
    return response.data
  }
}
