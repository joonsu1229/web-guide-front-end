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
            <!-- 시작하기: 플레이 버튼 -->
            <svg v-if="banner.title === '시작하기'" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polygon points="10,8 16,12 10,16"/>
            </svg>

            <!-- 포탈: 홈 -->
            <svg v-else-if="banner.title === '포탈(Portal)'" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9,22 9,12 15,12 15,22"/>
            </svg>

            <!-- 전자결재: 게시판 -->
            <svg v-else-if="banner.title === '전자결재'" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
              <path d="m9 14 2 2 4-4"/>
            </svg>

            <!-- e-HR: 사용자 -->
            <svg v-else-if="banner.title === 'e-HR'" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>

            <!-- 게시판: 메모패드 -->
            <svg v-else-if="banner.title === '게시판'" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" x2="8" y1="13" y2="13"/>
              <line x1="16" x2="8" y1="17" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>

            <!-- 업무지원: 메시지서클 -->
            <svg v-else-if="banner.title === '업무지원'" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>

            <!-- 모바일: 스마트폰 화면 -->
            <svg v-else-if="banner.title === '모바일'" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/>
              <path d="M9 9h6"/>
              <path d="M9 12h6"/>
              <path d="M9 15h4"/>
              <circle cx="12" cy="18.5" r="0.5"/>
            </svg>

            <!-- 전자계약: 파일체크 -->
            <svg v-else-if="banner.title === '전자계약'" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              <polyline points="14,2 14,8 20,8"/>
              <path d="m9 15 2 2 4-4"/>
            </svg>

            <!-- AI: 뇌/CPU -->
            <svg v-else-if="banner.title === 'AI'" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect width="16" height="16" x="4" y="4" rx="2"/>
              <rect width="6" height="6" x="9" y="9" rx="1"/>
              <path d="m15 2 3 3-3 3"/>
              <path d="m9 22-3-3 3-3"/>
              <path d="M2 15l3-3-3-3"/>
              <path d="m22 9-3 3 3 3"/>
            </svg>

            <!-- 기본: 바차트 -->
            <svg v-else width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" x2="12" y1="20" y2="10"/>
              <line x1="18" x2="18" y1="20" y2="4"/>
              <line x1="6" x2="6" y1="20" y2="16"/>
            </svg>
          </div>
          <div class="banner-content">
            <h3 class="banner-title">
              {{ banner.title }}
              <span v-if="banner.title === '전자계약' || banner.title === 'AI'" class="new-badge">NEW</span>
            </h3>
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
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <path
        d="M12 2L13.09 8.26L22 9L13.09 15.74L12 22L10.91 15.74L2 9L10.91 8.26L12 2Z"
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

const PortalIcon = {
  template: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z" fill="currentColor"/>
    </svg>
  `
}

const ApprovalIcon = {
  template: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `
}

const HRIcon = {
  template: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <circle
        cx="12"
        cy="7"
        r="4"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `
}

const BoardIcon = {
  template: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 12H15M9 16H15M17 21H7C6.46957 21 5.96086 20.7893 5.58579 20.4142C5.21071 20.0391 5 19.5304 5 19V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H12.586C12.8512 3.00019 13.1055 3.10561 13.293 3.293L18.707 8.707C18.8944 8.89449 18.9998 9.14881 19 9.414V19C19 19.5304 18.7893 20.0391 18.4142 20.4142C18.0391 20.7893 17.5304 21 17 21Z"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `
}

const SupportIcon = {
  template: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `
}

const MobileIcon = {
  template: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <rect
        x="5"
        y="2"
        width="14"
        height="20"
        rx="2"
        ry="2"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <line
        x1="12"
        y1="18"
        x2="12.01"
        y2="18"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `
}

const ContractIcon = {
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
        d="M14 2V8H20M16 13H8M16 17H8"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10 9H8"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `
}

const AIIcon = {
  template: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L2 7L12 12L22 7L12 2Z"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M2 17L12 22L22 17"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M2 12L12 17L22 12"
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
    AnalyticsIcon,
    PortalIcon,
    ApprovalIcon,
    HRIcon,
    BoardIcon,
    SupportIcon,
    MobileIcon,
    ContractIcon,
    AIIcon
  },
  emits: ['banner-select'],
  
  computed: {
    ...mapState(usePortalMenuStore, [
      'banners',
      'isLoading',
      'hasError',
      'error'
    ]),

    mappedBanners() {
      if (!this.banners || this.banners.length === 0) {
        return []
      }

      return this.banners.map(banner => {
        const iconName = this.getIconByTitle(banner.title)
        const iconComponent = this.getIconComponent(iconName)
        console.log(`Title: ${banner.title}, Icon: ${iconName}`, iconComponent) // 디버깅용
        return {
          ...banner,
          icon: iconComponent
        }
      })
    }
  },
  
  methods: {
    ...mapActions(usePortalMenuStore, ['fetchPortalMenus']),

    getIconByTitle(title) {
      const iconMap = {
        '시작하기': 'RocketIcon',
        '포탈(Portal)': 'PortalIcon',
        '전자결재': 'ApprovalIcon',
        'e-HR': 'HRIcon',
        '게시판': 'BoardIcon',
        '업무지원': 'SupportIcon',
        '모바일': 'MobileIcon',
        '전자계약': 'ContractIcon',
        'AI': 'AIIcon'
      }

      return iconMap[title] || 'AnalyticsIcon' // 기본값으로 AnalyticsIcon 사용
    },

    getIconComponent(iconName) {
      // 직접 컴포넌트 객체를 반환
      switch(iconName) {
        case 'RocketIcon': return RocketIcon
        case 'PortalIcon': return PortalIcon
        case 'ApprovalIcon': return ApprovalIcon
        case 'HRIcon': return HRIcon
        case 'BoardIcon': return BoardIcon
        case 'SupportIcon': return SupportIcon
        case 'MobileIcon': return MobileIcon
        case 'ContractIcon': return ContractIcon
        case 'AIIcon': return AIIcon
        case 'DocumentIcon': return DocumentIcon
        case 'SearchIcon': return SearchIcon
        default: return AnalyticsIcon
      }
    },

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
  background: transparent;
  border-radius: 12px;
  opacity: 0.9;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.banner-icon svg {
  color: currentColor;
  stroke: currentColor;
}

.banner-content {
  flex: 1;
}

.banner-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.new-badge {
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(255, 107, 107, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 2px 4px rgba(255, 107, 107, 0.3);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(255, 107, 107, 0.4);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 2px 4px rgba(255, 107, 107, 0.3);
  }
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