<template>
  <div class="manual-container" :class="{ 'dark-mode': isDark }" ref="containerRef">
    <div class="main-page">
      <div class="hero-section">
        <div class="banner-slider">
          <div
            v-for="(slide, index) in slides"
            :key="index"
            class="slide"
            :class="{ active: currentSlide === index }"
            :style="{ backgroundImage: `url(${slide.image})` }"
          >
            <div class="hero-content animate-fade-in">
              <div class="hero-header">
                <h1 class="hero-title animate-slide-up">{{ slide.title }}</h1>
              </div>
              <p class="hero-subtitle animate-slide-up delay-1">{{ slide.subtitle }}</p>
              <div class="animate-slide-up delay-2" v-if="index !== 0">
              </div>
            </div>
          </div>
        </div>

        <!-- 고정 검색바 -->
        <div class="fixed-search-bar">
          <SearchBar @search="handleSearch" :isDark="isDark" />
        </div>

        <!-- Navigation Dots -->
        <div class="slider-dots">
          <button
            v-for="(slide, index) in slides"
            :key="index"
            class="dot"
            :class="{ active: currentSlide === index }"
            @click="goToSlide(index)"
          >
            <span class="dot-number">{{ index + 1 }}</span>
          </button>
        </div>

        <!-- Navigation Arrows -->
        <button class="slider-arrow prev" @click="prevSlide">❮</button>
        <button class="slider-arrow next" @click="nextSlide">❯</button>
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
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router' // useRouter import
import SearchBar from '@/components/SearchBar.vue'
import NoticeBanner from '@/components/NoticeBanner.vue'
import GuideBanners from '@/components/GuideBanners.vue'
import FrequentlyAskedQuestions from '@/components/FrequentlyAskedQuestions.vue'
import imageBanner01 from '@/assets/image-banner01.png'
import imageBanner02 from '@/assets/image-banner02.png'

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
const currentSlide = ref(0)

const slides = ref([
  {
    title: ' ',
    subtitle: '',
    image: imageBanner01,
    buttonText: '',
    action: ''
  },
  {
    title: '',
    subtitle: '',
    image: imageBanner02,
    buttonText: '',
    action: ''
  },
  {
    title: '',
    subtitle: '',
    image: imageBanner01,
    buttonText: '',
    action: ''
  }
])
let slideInterval = null

// --- Handlers ---

// 배너를 클릭하면 showMainPage를 바꾸는 대신, router.push로 페이지를 이동시킴
function handleBannerSelect(section) {
  // 배너 제목을 기준으로 메뉴 매핑
  const menuMapping = {
    'getting-started': '시작하기',
    'portal': '포탈(Portal)',
    'approval': '전자결재',
    'e-hr': 'e-HR',
    'board': '게시판',
    'reserve': '업무지원',
    'mobile': '모바일',
    'contract': '전자계약',
    'ai': 'AI'
  }

  const menuTitle = menuMapping[section]

  // 쿼리 파라미터로 활성 메뉴 정보 전달
  router.push({
    path: `/guide/${section}`,
    query: {
      activeMenu: menuTitle,
      menuOpen: 'true'
    }
  })
}

function handleSearch(query) {
  console.log('검색어:', query)
  // 검색 시에도 검색 결과 페이지로 라우팅하는 로직으로 변경 가능
  router.push(`/guide/search-results?q=${query}`)
}

function handleBannerAction(action) {
  switch(action) {
    case 'project-management':
      router.push('/guide/project-management')
      break
    case 'communication':
      router.push('/guide/communication')
      break
    default:
      break
  }
}

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length
  resetInterval()
}

function prevSlide() {
  currentSlide.value = currentSlide.value === 0 ? slides.value.length - 1 : currentSlide.value - 1
  resetInterval()
}

function goToSlide(index) {
  currentSlide.value = index
  resetInterval()
}

function startSlideShow() {
  slideInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slides.value.length
  }, 5000) // 5초마다 자동 슬라이드
}

function resetInterval() {
  if (slideInterval) {
    clearInterval(slideInterval)
  }
  startSlideShow()
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
  startSlideShow()
})

onUnmounted(() => {
  if (slideInterval) {
    clearInterval(slideInterval)
  }
})
</script>

<style scoped>
.manual-container { min-height: 100vh; background-color: #ffffff; transition: all 0.3s ease; }
.manual-container.dark-mode { background-color: #1a1d21; color: #e9ecef; }
.main-page { width: 100%; }
.hero-section {
  position: relative;
  height: 500px;
  overflow: hidden;
  color: white;
  text-align: center;
}

.banner-slider {
  position: relative;
  width: 100%;
  height: 90%;
}

.slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0;
  transition: opacity 0.8s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slide.active {
  opacity: 1;
}


.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.slider-dots {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 8px;
  z-index: 3;
}

.dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.8);
  background: rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.dot-number {
  color: white;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.dot.active {
  background: rgba(255, 255, 255, 0.9);
  border-color: white;
  transform: scale(1.1);
}

.dot.active .dot-number {
  color: #333;
}

.dot:hover {
  background: rgba(255, 255, 255, 0.6);
  transform: scale(1.05);
}

.slider-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 24px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slider-arrow:hover {
  background: rgba(255, 255, 255, 0.3);
}

.slider-arrow.prev {
  left: 20px;
}

.slider-arrow.next {
  right: 20px;
}

.cta-button {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  color: white;
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
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
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.hero-subtitle {
  font-size: 20px;
  margin: 0 0 40px 0;
  opacity: 0.9;
  font-weight: 300;
}
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

.fixed-search-bar {
  position: absolute;
  top: 70%;
  left: 35%;
  transform: translate(-50%, -50%);
  z-index: 10;
  width: 55%;
  max-width: 400px;
  animation: slideUp 0.8s ease-out 0.4s both;
}
</style>