import apiClient from './index'

export const documentAPI = {
  // 모든 문서 조회
  async getAllDocuments() {
    return await apiClient.get('/contents')
  },

  // 특정 문서 조회
  async getDocument(id) {
    return await apiClient.get(`/contents/${id}`)
  },

  // 문서 생성
  async createDocument(documentData) {
    return await apiClient.post('/contents', documentData)
  },

  // 문서 수정
  async updateDocument(id, documentData) {
    return await apiClient.put(`/contents/${id}`, documentData)
  },

  // 문서 삭제
  async deleteDocument(id) {
    return await apiClient.delete(`/contents/${id}`)
  }
}