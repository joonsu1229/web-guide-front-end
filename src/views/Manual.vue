<template>
  <div class="manual-container">
    <div v-if="showMainPage" class="main-page">
      <div class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">워크쓰루 가이드</h1>
          <p class="hero-subtitle">효율적인 업무 관리를 위한 통합 가이드</p>
          <SearchBar @search="handleSearch" />
        </div>
      </div>

      <NoticeBanner />
      <GuideBanners @banner-select="handleBannerSelect" />
    </div>

    <div v-else class="guide-content">
      <ManualSidebar
        :activeSection="activeSection"
        @section-change="handleSectionChange"
      />
      <ManualContent :activeSection="activeSection" />
    </div>

    <div class="back-to-main" v-if="!showMainPage">
      <button @click="goToMainPage" class="back-button">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M19 12H5M12 19L5 12L12 5"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        메인으로 돌아가기
      </button>
    </div>
  </div>
</template>

<script>
import ManualSidebar from '@/components/ManualSidebar.vue'
import ManualContent from '@/components/ManualContent.vue'
import SearchBar from '@/components/SearchBar.vue'
import NoticeBanner from '@/components/NoticeBanner.vue'
import GuideBanners from '@/components/GuideBanners.vue'

export default {
  name: 'Manual',
  components: {
    ManualSidebar,
    ManualContent,
    SearchBar,
    NoticeBanner,
    GuideBanners
  },
  data() {
    return {
      activeSection: 'overview',
      showMainPage: true
    }
  },
  methods: {
    handleSectionChange(section) {
      this.activeSection = section
    },
    handleBannerSelect(section) {
      this.activeSection = section
      this.showMainPage = false
    },
    handleSearch(query) {
      console.log('검색어:', query)
      this.activeSection = 'search'
      this.showMainPage = false
    },
    goToMainPage() {
      this.showMainPage = true
    }
  }
}
</script>

<style scoped>
.manual-container {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.main-page {
  width: 100%;
}

.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 0 60px;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 16px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.hero-subtitle {
  font-size: 20px;
  margin: 0 0 40px 0;
  opacity: 0.9;
  font-weight: 300;
}

.guide-content {
  display: flex;
  min-height: 100vh;
}

.back-to-main {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
}

.back-button {
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 50px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #495057;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.back-button:hover {
  background: #f8f9fa;
  border-color: #dee2e6;
  color: #212529;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .guide-content {
    flex-direction: column;
  }

  .hero-section {
    padding: 60px 0 40px;
  }

  .hero-title {
    font-size: 36px;
  }

  .hero-subtitle {
    font-size: 18px;
    margin-bottom: 32px;
  }

  .back-to-main {
    top: 16px;
    left: 16px;
  }

  .back-button {
    padding: 10px 16px;
    font-size: 13px;
  }
}
</style>