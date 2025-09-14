<template>
  <n-config-provider :theme="theme">
    <n-global-style />
    <n-message-provider>
      <div class="min-h-screen app-container" :class="{ 'dark-mode': isDarkMode }">
        <!-- Header -->
        <header class="header-container" :class="{ 'dark-mode': isDarkMode }">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
              <!-- Logo -->
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <h1 class="text-2xl font-bold text-gray-900">
                    <img src="/jsai_logo.png" alt="GUIDE" style="width: 100px; height: 80px; vertical-align: middle;">
                  </h1>
                </div>
              </div>

              <!-- Navigation and Dark Mode Toggle -->
              <div class="flex items-center space-x-4">
                <nav class="hidden md:flex space-x-8">
                  <router-link
                    v-for="route in routes"
                    :key="route.name"
                    :to="{ name: route.name }"
                    class="nav-link"
                    :class="{ 'nav-link-active': $route.name === route.name }"
                  >
                    <n-icon :size="18" class="mr-2">
                      <component :is="getIcon(route.meta.icon)" />
                    </n-icon>
                    {{ route.meta.title }}
                  </router-link>
                </nav>

                <!-- Dark Mode Toggle -->
                <DarkModeToggle
                  :isDark="isDarkMode"
                  @toggle="toggleDarkMode"
                  class="ml-4"
                />

                <!-- Mobile menu button -->
                <div class="md:hidden">
                  <n-button
                    quaternary
                    circle
                    @click="mobileMenuOpen = !mobileMenuOpen"
                  >
                    <template #icon>
                      <n-icon :size="20">
                        <MenuOutline v-if="!mobileMenuOpen" />
                        <CloseOutline v-else />
                      </n-icon>
                    </template>
                  </n-button>
                </div>
              </div>
            </div>
          </div>

          <!-- Mobile menu -->
          <div v-show="mobileMenuOpen" class="md:hidden mobile-menu-container" :class="{ 'dark-mode': isDarkMode }">
            <div class="px-2 pt-2 pb-3 space-y-1">
              <router-link
                v-for="route in routes"
                :key="route.name"
                :to="{ name: route.name }"
                class="mobile-nav-link"
                :class="{ 'mobile-nav-link-active': $route.name === route.name }"
                @click="mobileMenuOpen = false"
              >
                <n-icon :size="18" class="mr-3">
                  <component :is="getIcon(route.meta.icon)" />
                </n-icon>
                {{ route.meta.title }}
              </router-link>

              <!-- Mobile Dark Mode Toggle -->
              <div class="flex items-center justify-between px-3 py-2 mt-4 border-t" :class="isDarkMode ? 'border-gray-600' : 'border-gray-200'">
                <span class="text-sm font-medium">다크 모드</span>
                <DarkModeToggle
                  :isDark="isDarkMode"
                  @toggle="toggleDarkMode"
                />
              </div>
            </div>
          </div>
        </header>

        <!-- Main Content -->
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <router-view v-slot="{ Component }">
            <transition name="page-fade" mode="out-in">
              <component :is="Component" :isDark="isDarkMode" />
            </transition>
          </router-view>
        </main>

        <!-- Footer -->
        <footer class="footer-container" :class="{ 'dark-mode': isDarkMode }">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="flex flex-col md:flex-row justify-between items-center">
              <div class="text-sm text-gray-500">
                © 2024 HybridSearch. Spring Boot + Vue.js로 구현된 하이브리드 검색 시스템
              </div>
              <div class="flex items-center space-x-4 mt-4 md:mt-0">
                <n-tag size="small" type="info">Java 21</n-tag>
                <n-tag size="small" type="success">Spring Boot</n-tag>
                <n-tag size="small" type="warning">Vue 3</n-tag>
                <n-tag size="small" type="error">LangChain</n-tag>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  SearchOutline,
  DocumentTextOutline,
  BarChartOutline,
  MenuOutline,
  CloseOutline
} from '@vicons/ionicons5'
import DarkModeToggle from '@/components/DarkModeToggle.vue'

const router = useRouter()
const theme = ref(null)
const mobileMenuOpen = ref(false)
const isDarkMode = ref(false)

onMounted(() => {
  const savedDarkMode = localStorage.getItem('darkMode')
  if (savedDarkMode !== null) {
    isDarkMode.value = JSON.parse(savedDarkMode)
  } else {
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  applyDarkMode()
})

const routes = computed(() =>
  router.getRoutes().filter(route => route.meta?.title)
)

const getIcon = (iconName) => {
  const icons = {
    search: SearchOutline,
    document: DocumentTextOutline,
    analytics: BarChartOutline
  }
  return icons[iconName] || SearchOutline
}

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('darkMode', JSON.stringify(isDarkMode.value))
  applyDarkMode()
}

const applyDarkMode = () => {
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark-mode')
  } else {
    document.documentElement.classList.remove('dark-mode')
  }
}
</script>

<style scoped>
/* App Container Styles */
.app-container {
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: all 0.3s ease;
}

.app-container.dark-mode {
  background-color: #1a1d21;
  color: #e9ecef;
}

/* Header Styles */
.header-container {
  background-color: var(--card-bg);
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.header-container.dark-mode {
  background-color: #2d3748;
  border-bottom-color: #4a5568;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* Footer Styles */
.footer-container {
  background-color: var(--card-bg);
  border-top: 1px solid var(--border-color);
  margin-top: 3rem;
  transition: all 0.3s ease;
}

.footer-container.dark-mode {
  background-color: #2d3748;
  border-top-color: #4a5568;
}

/* Navigation Styles */
.nav-link {
  @apply flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200;
  color: var(--text-color);
  opacity: 0.8;
}

.nav-link:hover {
  background-color: var(--hover-bg);
  opacity: 1;
}

.nav-link-active {
  @apply text-primary-600 bg-primary-50;
  opacity: 1;
}

.dark-mode .nav-link-active {
  @apply text-blue-400;
  background-color: rgba(59, 130, 246, 0.1);
}

.mobile-nav-link {
  @apply flex items-center px-3 py-2 text-base font-medium rounded-md;
  color: var(--text-color);
  opacity: 0.8;
}

.mobile-nav-link:hover {
  background-color: var(--hover-bg);
  opacity: 1;
}

.mobile-nav-link-active {
  @apply text-primary-600 bg-primary-50;
  opacity: 1;
}

.dark-mode .mobile-nav-link-active {
  @apply text-blue-400;
  background-color: rgba(59, 130, 246, 0.1);
}

/* Logo Styles */
.dark-mode h1 {
  color: #e9ecef;
}

/* Mobile Menu Styles */
.mobile-menu-container {
  border-top: 1px solid var(--border-color);
  background-color: var(--card-bg);
  transition: all 0.3s ease;
}

.mobile-menu-container.dark-mode {
  border-top-color: #4a5568;
  background-color: #2d3748;
}

/* Footer Text Styles */
.dark-mode .text-gray-500 {
  color: #9ca3af;
}

/* Page Transition Styles */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.3s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}
</style>