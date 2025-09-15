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
  }
}