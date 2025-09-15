<template>
  <div class="guide-banners" :class="{ 'dark-mode': isDark }">
    <div class="banner-container">
      <h2 class="banners-title">워크쓰루를 시작하셨나요?</h2>
      <p class="banners-subtitle">단계별 가이드로 쉽게 시작해보세요</p>

      <div v-if="isLoading" class="status-message">
        <p>가이드를 불러오는 중입니다...</p>
      </div>

      <div v-else-if="hasError" class="status-message error">
        <p>정보를 불러오지 못했습니다: {{ error }}</p>
      </div>

      <div v-else-if="banners && banners.length > 0" class="banners-grid">
        <div
          v-for="banner in banners"
          :key="banner.id"
          class="banner-card"
          :class="banner.className"
          @click="selectBanner(banner)"
        >
          <div class="banner-icon">
            <component :is="banner.icon" />
          </div>
          <div class="banner-content">
            <h3 class="banner-title">{{ banner.title }}</h3>
            <p class="banner-description">{{ banner.description }}</p>
            <div class="banner-tags">
              <span v-for="tag in banner.tags" :key="tag" class="banner-tag">
                {{ tag }}
              </span>
            </div>
          </div>
          <div class="banner-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      <div v-else class="status-message">
        <p>표시할 가이드가 없습니다.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { usePortalMenuStore } from '@/stores/usePortalMenuStore'

const RocketIcon = {
  template: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L13.09 8.26L22 9L13.09 15.74L12 22L10.91 15.74L2 9L10.91 8.26L12 2Z"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="currentColor"
      />
    </svg>
  `
}

const DocumentIcon = {
  template: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <path
        d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M14 2V8H20M16 13H8M16 17H8M10 9H8"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `
}

const SearchIcon = {
  template: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19S2 15.194 2 10.5S5.806 2 10.5 2S19 5.806 19 10.5Z"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `
}

const AnalyticsIcon = {
  template: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 3V21H21M7 14L12 9L16 13L21 8"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M21 8V13H16"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `
}

export default {
  name: 'GuideBanners',
  props: {
    isDark: {
      type: Boolean,
      default: false
    }
  },
  components: {
    RocketIcon,
    DocumentIcon,
    SearchIcon,
    AnalyticsIcon
  },
  emits: ['banner-select'],
  
  computed: {
    ...mapState(usePortalMenuStore, [
      'banners',
      'isLoading',
      'hasError',
      'error'
    ])
  },
  
  methods: {
    ...mapActions(usePortalMenuStore, ['fetchPortalMenus']),

    selectBanner(banner) {
      this.$emit('banner-select', banner.section)
    }
  },

  created() {
    this.fetchPortalMenus('P1');
  }
}
</script>

<style scoped>
.guide-banners {
  margin: 40px 0;
  background-color: #ffffff;
  padding: 40px 0;
  border-radius: 16px;
}

.banner-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.banners-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-color);
  text-align: center;
  margin: 0 0 8px 0;
  transition: color 0.3s ease;
}

.banners-subtitle {
  font-size: 18px;
  color: #6c757d;
  text-align: center;
  margin: 0 0 40px 0;
  transition: color 0.3s ease;
}

.guide-banners.dark-mode .banners-subtitle {
  color: #9ca3af;
}

.guide-banners.dark-mode {
  background-color: #2d3748;
}

.banners-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.banner-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #f1f3f4;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
}

.banner-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: currentColor;
  opacity: 0.8;
}

.banner-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
}

.banner-card:hover .banner-icon {
  transform: rotate(5deg) scale(1.1);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: rotate(5deg) scale(1.1);
  }
  50% {
    transform: rotate(5deg) scale(1.15);
  }
}

.guide-banners.dark-mode .banner-card {
  background: #374151;
  border-color: #4b5563;
}

.guide-banners.dark-mode .banner-tag {
  background: #1e3a8a;
  color: #93c5fd;
  border-color: #3b82f6;
}

.banner-primary {
  color: #007BFF;
}

.banner-success {
  color: #28a745;
}

.banner-info {
  color: #17a2b8;
}

.banner-warning {
  color: #ffc107;
}

.banner-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: currentColor;
  color: white;
  border-radius: 12px;
  opacity: 0.9;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.banner-content {
  flex: 1;
}

.banner-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 8px 0;
}

.banner-description {
  font-size: 14px;
  color: #6c757d;
  line-height: 1.5;
  margin: 0 0 12px 0;
  transition: color 0.3s ease;
}

.guide-banners.dark-mode .banner-description {
  color: #9ca3af;
}

.banner-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.banner-tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid #bbdefb;
}

.banner-arrow {
  color: #adb5bd;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.banner-card:hover .banner-arrow {
  color: currentColor;
  transform: translateX(4px);
}

.status-message {
  text-align: center;
  padding: 40px 0;
  font-size: 18px;
  color: #6c757d;
}
.status-message.error {
  color: #dc3545;
}
.guide-banners.dark-mode .status-message {
  color: #9ca3af;
}
.guide-banners.dark-mode .status-message.error {
  color: #f87171;
}

@media (max-width: 768px) {
  .banner-container {
    padding: 0 16px;
  }

  .banners-title {
    font-size: 28px;
  }

  .banners-subtitle {
    font-size: 16px;
  }

  .banners-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .banner-card {
    padding: 20px;
    gap: 16px;
  }

  .banner-icon {
    width: 40px;
    height: 40px;
  }

  .banner-title {
    font-size: 18px;
  }

  .banner-description {
    font-size: 13px;
  }
}
</style>