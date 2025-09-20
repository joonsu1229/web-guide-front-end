import { createRouter, createWebHistory } from 'vue-router'
import SearchView from '@/views/SearchView.vue'
import DocumentView from '@/views/DocumentView.vue'
import AnalyticsView from '@/views/AnalyticsView.vue'
import JobManagement from '@/views/JobManagement.vue'
import Manual from '@/views/Manual.vue'
import ManualDetailView from '@/views/ManualDetailView.vue' 

const routes = [
    {
    path: '/',
    name: 'Manual',
    component: Manual,
    meta: {
      title: '사용자 매뉴얼',
      icon: 'document'
    }
  },
  {
    path: '/guide/:section',
    name: 'ManualDetail',
    component: ManualDetailView,
    props: true
  },
  {
    path: '/guide/:section/:categoryId',
    name: 'ManualDetailWithCategory',
    component: ManualDetailView,
    props: true
  },  
  {
    path: '/JobManagement',
    name: 'JobManagement',
    component: JobManagement,
    meta: {
      title: '채용정보 관리',
      icon: 'document'
    }
  },
  {
    path: '/search',
    name: 'Search',
    component: SearchView,
    meta: {
      title: '검색',
      icon: 'search'
    }
  },
  {
    path: '/documents',
    name: 'Documents',
    component: DocumentView,
    meta: {
      title: '매뉴얼 관리',
      icon: 'document'
    }
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: AnalyticsView,
    meta: {
      title: '분석',
      icon: 'analytics'
    }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router