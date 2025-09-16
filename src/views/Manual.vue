<template>
  <div class="manual-container" :class="{ 'dark-mode': isDark }" ref="containerRef">
    <div class="main-page">
      <div class="hero-section">
        <div class="hero-content animate-fade-in">
          <div class="hero-header">
            <h1 class="hero-title animate-slide-up">워크쓰루 매뉴얼</h1>
          </div>
          <p class="hero-subtitle animate-slide-up delay-1">기업 협업 환경에 최적화된 그룹웨어, 워크쓰루</p>
          <div class="animate-slide-up delay-2">
            <SearchBar @search="handleSearch" :isDark="isDark" />
          </div>
        </div>
      </div>

      <div class="scroll-reveal">
        <NoticeBanner :isDark="isDark" />
      </div>
      <div class="scroll-reveal">
        <GuideBanners @banner-select="handleBannerSelect" :isDark="isDark" />
      </div>
      <div class="scroll-reveal">
        <FrequentlyAskedQuestions :isDark="isDark" />
      </div>
    </div>

    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router' // useRouter import
import SearchBar from '@/components/SearchBar.vue'
import NoticeBanner from '@/components/NoticeBanner.vue'
import GuideBanners from '@/components/GuideBanners.vue'
import FrequentlyAskedQuestions from '@/components/FrequentlyAskedQuestions.vue'

// --- Props ---
const props = defineProps({
  isDark: {
    type: Boolean,
    default: false
  }
})

// --- 핵심 수정사항 ---
const router = useRouter() // 라우터 인스턴스 사용

// --- State ---
const containerRef = ref(null)

// --- Handlers ---

// 배너를 클릭하면 showMainPage를 바꾸는 대신, router.push로 페이지를 이동시킴
function handleBannerSelect(section) {
  router.push(`/guide/${section}`)
}

function handleSearch(query) {
  console.log('검색어:', query)
  // 검색 시에도 검색 결과 페이지로 라우팅하는 로직으로 변경 가능
  router.push(`/guide/search-results?q=${query}`)
}

// --- Lifecycle & Effects ---
function setupScrollAnimations() {
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

  if (containerRef.value) {
    const scrollElements = containerRef.value.querySelectorAll('.scroll-reveal')
    scrollElements.forEach(el => observer.observe(el))
  }
}

onMounted(() => {
  setupScrollAnimations()
})
</script>

<style scoped>
.manual-container { min-height: 100vh; background-color: #ffffff; transition: all 0.3s ease; }
.manual-container.dark-mode { background-color: #1a1d21; color: #e9ecef; }
.main-page { width: 100%; }
.hero-section { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 80px 0 60px; text-align: center; }
.manual-container.dark-mode .hero-section { background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%); }
.hero-content { max-width: 800px; margin: 0 auto; padding: 0 20px 10px; }
.hero-header { display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
.hero-title { font-size: 48px; font-weight: 700; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.hero-subtitle { font-size: 20px; margin: 0 0 40px 0; opacity: 0.9; font-weight: 300; }
.guide-content { display: flex; min-height: 100vh; }
.back-to-main { position: fixed; top: 20px; left: 20px; z-index: 1000; }
.back-button { background: #fff; border: 1px solid #e9ecef; border-radius: 50px; padding: 12px 20px; display: flex; align-items: center; gap: 8px; color: #495057; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.back-button:hover { background: #f8f9fa; border-color: #dee2e6; color: #212529; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
.manual-container.dark-mode .back-button { background: #343a40; border-color: #495057; color: #e9ecef; }
.manual-container.dark-mode .back-button:hover { background: #495057; border-color: #6c757d; color: #fff; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fadeIn 1s ease-out; }
.animate-slide-up { animation: slideUp 0.8s ease-out; }
.animate-slide-up.delay-1 { animation-delay: 0.2s; animation-fill-mode: both; opacity: 0; }
.animate-slide-up.delay-2 { animation-delay: 0.4s; animation-fill-mode: both; opacity: 0; }
.scroll-reveal { opacity: 0; transform: translateY(50px); transition: all 0.8s cubic-bezier(0.17, 0.67, 0.5, 1.03); }
.scroll-reveal.visible { opacity: 1; transform: translateY(0); }
</style>