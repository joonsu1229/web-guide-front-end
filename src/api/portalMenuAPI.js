// src/api/portalMenuAPI.js

import apiClient from './index' // 기존에 사용하던 apiClient를 그대로 활용

export const portalMenuAPI = {
  /**
   * 특정 포탈의 메인 메뉴 목록을 가져온다.
   * @param {string} portalId - 조회할 포탈의 ID
   * @returns {Promise<Array>} PortalMenu DTO 배열
   */
  async getPortalMenus(portalId) {
    // GET /api/portal-menus?portalId=P1
    const response = await apiClient.get('/portal-menus', {
      params: { portalId }
    })
    return response.data
  }
}