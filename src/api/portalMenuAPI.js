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
  },

  /**
   * 포탈 메뉴를 생성한다.
   * @param {Object} menuDto - 생성할 메뉴 정보
   * @returns {Promise<Object>} 생성된 PortalMenu DTO
   */
  async createPortalMenu(menuDto) {
    const response = await apiClient.post('/portal-menus', menuDto)
    return response.data
  },

  /**
   * 포탈 메뉴를 수정한다.
   * @param {number|string} id - 수정할 메뉴 ID
   * @param {Object} menuDto - 수정할 메뉴 정보
   * @returns {Promise<Object>} 수정된 PortalMenu DTO
   */
  async updatePortalMenu(id, menuDto) {
    const response = await apiClient.put(`/portal-menus/${id}`, menuDto)
    return response.data
  },

  /**
   * 포탈 메뉴를 삭제한다.
   * @param {number|string} id - 삭제할 메뉴 ID
   * @param {string} portalId - 포탈 ID
   * @returns {Promise<void>}
   */
  async deletePortalMenu(id, portalId) {
    await apiClient.delete(`/portal-menus/${id}`, {
      params: { portalId }
    })
  }
}