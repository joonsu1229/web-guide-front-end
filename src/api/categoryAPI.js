// src/api/categoryAPI.js

import apiClient from './index'

export const categoryAPI = {
  /**
   * 특정 포탈과 섹션에 해당하는 카테고리 트리를 가져온다.
   * @param {string} portalId - 조회할 포탈의 ID
   * @param {string} section - 조회할 메뉴의 섹션 키
   * @returns {Promise<Array>} Category DTO 배열 (계층 구조)
   */
  async getCategoryTree(portalId, section) {
    // GET /api/categories?portalId=P1&section=approval
    const response = await apiClient.get('/categories', {
      params: { portalId, section }
    })
    return response.data
  },

  /**
   * 카테고리 목록을 조회한다 (section 파라미터 있으면 섹션별 / 없으면 전체 카테고리 반환)
   * @param {string} portalId - 조회할 포탈의 ID
   * @param {string} [section] - 조회할 섹션 (선택사항)
   * @returns {Promise<Array>} Category DTO 배열
   */
  async getCategories(portalId, section) {
    const params = { portalId }
    if (section) {
      params.section = section
    }

    const response = await apiClient.get('/categories', { params })
    return response.data
  },

  /**
   * 카테고리를 생성한다.
   * @param {Object} categoryDto - 생성할 카테고리 정보
   * @returns {Promise<Object>} 생성된 Category DTO
   */
  async createCategory(categoryDto) {
    const response = await apiClient.post('/categories', categoryDto)
    return response.data
  },

  /**
   * 카테고리를 수정한다.
   * @param {number|string} id - 수정할 카테고리 ID
   * @param {string} portalId - 포탈 ID
   * @param {Object} categoryDto - 수정할 카테고리 정보
   * @returns {Promise<Object>} 수정된 Category DTO
   */
  async updateCategory(id, portalId, categoryDto) {
    const response = await apiClient.put(`/categories/${id}`, categoryDto, {
      params: { portalId }
    })
    return response.data
  },

  /**
   * 카테고리를 비활성화한다.
   * @param {number|string} id - 비활성화할 카테고리 ID
   * @param {string} portalId - 포탈 ID
   * @returns {Promise<void>}
   */
  async deactivateCategory(id, portalId) {
    await apiClient.post(`/categories/${id}/deactivate`, null, {
      params: { portalId }
    })
  },

  /**
   * 카테고리를 삭제한다.
   * @param {number|string} id - 삭제할 카테고리 ID
   * @param {string} portalId - 포탈 ID
   * @returns {Promise<void>}
   */
  async deleteCategory(id, portalId) {
    await apiClient.delete(`/categories/${id}`, {
      params: { portalId }
    })
  }
}