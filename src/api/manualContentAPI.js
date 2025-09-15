// src/api/manualContentAPI.js

import apiClient from './index'

export const manualContentAPI = {
  /**
   * categoryId로 콘텐츠의 현재 버전을 가져온다.
   * @param {string} portalId 
   * @param {number} categoryId 
   * @returns {Promise<Object>} GuideContent DTO
   */
  async getContent(portalId, categoryId) {
    const response = await apiClient.get('/contents', {
      params: { portalId, categoryId }
    })
    return response.data
  }
}