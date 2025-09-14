<template>
  <div class="notice-banner" v-if="!isDismissed" :class="{ 'dark-mode': isDark }">
    <div class="notice-content">
      <div class="notice-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <div class="notice-text">
        <span class="notice-badge">공지</span>
        <p class="notice-message">
          웹 가이드 시스템이 새롭게 업데이트되었습니다.
          <a href="#" class="notice-link" @click.prevent="showDetails">자세히 보기</a>
        </p>
      </div>
      <button class="notice-close" @click="dismissNotice" type="button">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M18 6L6 18M6 6L18 18"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NoticeBanner',
  props: {
    isDark: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isDismissed: false
    }
  },
  methods: {
    dismissNotice() {
      this.isDismissed = true
      localStorage.setItem('notice-dismissed', 'true')
    },
    showDetails() {
      alert('새로운 기능과 개선사항을 확인하세요!')
    }
  },
  mounted() {
    const dismissed = localStorage.getItem('notice-dismissed')
    if (dismissed === 'true') {
      this.isDismissed = true
    }
  }
}
</script>

<style scoped>
.notice-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px;
  margin-bottom: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.notice-banner.dark-mode {
  background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
  box-shadow: 0 4px 12px rgba(74, 85, 104, 0.4);
}

.notice-content {
  display: flex;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  gap: 12px;
}

.notice-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.9);
}

.notice-text {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}

.notice-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex-shrink: 0;
}

.notice-message {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.95);
}

.notice-link {
  color: white;
  text-decoration: underline;
  font-weight: 500;
  margin-left: 4px;
}

.notice-link:hover {
  text-decoration: none;
}

.notice-close {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.notice-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

@media (max-width: 768px) {
  .notice-banner {
    margin: 0 16px 24px;
    padding: 14px;
  }

  .notice-content {
    gap: 8px;
  }

  .notice-text {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .notice-message {
    font-size: 13px;
  }
}
</style>