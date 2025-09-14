<template>
  <div class="manual-container" :class="{ 'dark-mode': isDarkMode }">
    <div v-if="showMainPage" class="main-page">
      <div class="hero-section">
        <div class="hero-content animate-fade-in">
          <div class="hero-header">
            <h1 class="hero-title animate-slide-up">워크쓰루 매뉴얼</h1>
          </div>
          <p class="hero-subtitle animate-slide-up delay-1">기업 협업 환경에 최적화된 그룹웨어, 워크쓰루</p>
          <div class="animate-slide-up delay-2">
            <SearchBar @search="handleSearch" :isDark="isDarkMode" />
          </div>
        </div>
      </div>

      <div class="scroll-reveal" ref="notice">
        <NoticeBanner :isDark="isDarkMode" />
      </div>
      <div class="scroll-reveal" ref="banners">
        <GuideBanners @banner-select="handleBannerSelect" :isDark="isDarkMode" />
      </div>
      <div class="scroll-reveal" ref="faq">
        <FrequentlyAskedQuestions :isDark="isDarkMode" />
      </div>
    </div>

    <div v-else class="guide-content">
      <ManualSidebar
        :activeSection="activeSection"
        @section-change="handleSectionChange"
        :isDark="isDarkMode"
      />
      <ManualContent :activeSection="activeSection" :isDark="isDarkMode" />
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
import FrequentlyAskedQuestions from '@/components/FrequentlyAskedQuestions.vue'

export default {
  name: 'Manual',
  props: {
    isDark: {
      type: Boolean,
      default: false
    }
  },
  components: {
    ManualSidebar,
    ManualContent,
    SearchBar,
    NoticeBanner,
    GuideBanners,
    FrequentlyAskedQuestions
  },
  data() {
    return {
      activeSection: 'overview',
      showMainPage: true
    }
  },
  computed: {
    isDarkMode() {
      return this.isDark
    }
  },
  mounted() {
    this.setupScrollAnimations()
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
    },
    setupScrollAnimations() {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      }, observerOptions)

      // Observe scroll-reveal elements
      this.$nextTick(() => {
        const scrollElements = document.querySelectorAll('.scroll-reveal')
        scrollElements.forEach(el => observer.observe(el))
      })
    }
  }
}
</script>

<style scoped>
.manual-container {
  min-height: 100vh;
  background-color: #ffffff;
  transition: all 0.3s ease;
}

.manual-container.dark-mode {
  background-color: #1a1d21;
  color: #e9ecef;
}

.main-page {
  width: 100%;
}

.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 0 60px;
  text-align: center;
  transition: all 0.3s ease;
}

.manual-container.dark-mode .hero-section {
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px 10px;
}

.hero-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  margin: 0;
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

.manual-container.dark-mode .back-button {
  background: #343a40;
  border-color: #495057;
  color: #e9ecef;
}

.manual-container.dark-mode .back-button:hover {
  background: #495057;
  border-color: #6c757d;
  color: #fff;
}

/* Animation Classes */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-fade-in {
  animation: fadeIn 1s ease-out;
}

.animate-slide-up {
  animation: slideUp 0.8s ease-out;
}

.animate-slide-up.delay-1 {
  animation-delay: 0.2s;
  animation-fill-mode: both;
  opacity: 0;
}

.animate-slide-up.delay-2 {
  animation-delay: 0.4s;
  animation-fill-mode: both;
  opacity: 0;
}

.scroll-reveal {
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.8s cubic-bezier(0.17, 0.67, 0.5, 1.03);
}

.scroll-reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .guide-content {
    flex-direction: column;
  }

  .hero-section {
    padding: 60px 0 40px;
  }

  .hero-header {
    flex-direction: column;
    gap: 12px;
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