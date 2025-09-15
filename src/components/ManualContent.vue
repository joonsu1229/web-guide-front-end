<template>
  <div class="manual-content-component">
    <div v-if="activeItem" class="content-wrapper">
      <div class="breadcrumb">
        <span>가이드</span>
        <span class="separator">></span>
        <span>{{ activeItem.parentName }}</span>
        <span class="separator">></span>
        <span>{{ activeItem.name }}</span>
      </div>
      <div class="content-layout">
        <div class="content-area" ref="contentAreaRef">
          <div v-if="loading" class="status-message">본문 로딩 중...</div>
          <div v-else-if="error" class="status-message error">{{ error }}</div>
          <section v-else-if="currentContent" class="content-section">
            <h1>{{ activeItem.name }}</h1>
            <p v-if="activeItem.description" class="content-section-description">{{ activeItem.description }}</p>
            <div class="content-body" v-html="currentContent.contentBody"></div>
          </section>
          <div v-else class="status-message">
            선택된 항목에 대한 콘텐츠가 없습니다.
          </div>
        </div>
        <aside class="toc-sidebar" v-if="tocItems.length > 0">
          <div class="toc-container">
            <h4 class="toc-title">이 페이지의 목차</h4>
            <nav class="toc-nav">
              <ul class="toc-list">
                <li
                  v-for="item in tocItems"
                  :key="item.id"
                  class="toc-item"
                  :style="{ 'padding-left': item.tagName === 'h3' ? '1.5rem' : '0.75rem' }"
                  :class="{ active: activeAnchor === item.id }"
                >
                  <a :href="`#${item.id}`" class="toc-link" @click.prevent="scrollToSection(item.id)">
                    {{ item.text }}
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </aside>
      </div>
    </div>
    <div v-else class="placeholder">
      가이드 내용을 보려면 왼쪽 메뉴에서 항목을 선택해주세요.
    </div>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useManualContentStore } from '@/stores/useManualContentStore'

export default {
  name: 'ManualContent',
  props: {
    activeItem: { type: Object, default: null }
  },
  data() {
    return {
      tocItems: [],
      activeAnchor: ''
    }
  },
  computed: {
    ...mapState(useManualContentStore, ['currentContent', 'loading', 'error'])
  },
  methods: {
    extractTocItems() {
      this.tocItems = [];
      this.$nextTick(() => {
        if (this.$refs.contentAreaRef) {
          const headings = this.$refs.contentAreaRef.querySelectorAll('.content-body h2, .content-body h3');
          headings.forEach((heading, index) => {
            const id = `toc-anchor-${index}`;
            heading.id = id;
            this.tocItems.push({
              id: id,
              text: heading.textContent.trim(),
              tagName: heading.tagName.toLowerCase()
            });
          });
        }
      });
    },
    scrollToSection(id) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    handleScroll() {
      if (this.tocItems.length === 0) return;
      const scrollPosition = window.scrollY + 150;
      let currentActiveId = '';
      for (let i = this.tocItems.length - 1; i >= 0; i--) {
        const item = this.tocItems[i];
        const element = document.getElementById(item.id);
        if (element && element.offsetTop <= scrollPosition) {
          currentActiveId = item.id;
          break;
        }
      }
      this.activeAnchor = currentActiveId;
    }
  },
  watch: {
    currentContent: {
      handler(newContent) {
        if (newContent) {
          this.extractTocItems();
        } else {
          this.tocItems = [];
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }
}
</script>

<style scoped>
.main-content {
  flex: 1;
  padding: 0;
  overflow-y: auto;
}

.breadcrumb {
  background: var(--card-bg);
  padding: 16px 32px;
  border-bottom: 1px solid var(--border-color);
  font-size: 14px;
  color: #6c757d;
}

.separator {
  margin: 0 8px;
  color: #dee2e6;
}

.content-layout {
  display: flex;
  position: relative;
}

.content-area {
  flex: 1;
  padding: 32px;
  max-width: calc(100% - 250px);
}

.toc-sidebar {
  width: 250px;
  position: sticky;
  top: 80px;
  height: fit-content;
  margin-left: 32px;
  flex-shrink: 0;
}

.toc-container {
  background: var(--card-bg);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.toc-title {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.toc-nav {
  margin: 0;
}

.toc-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.toc-item {
  margin-bottom: 4px;
}

.toc-link {
  display: block;
  padding: 6px 12px;
  color: #6c757d;
  text-decoration: none;
  font-size: 14px;
  border-radius: 4px;
  transition: all 0.2s ease;
  line-height: 1.4;
}

.toc-link:hover {
  background-color: var(--hover-bg);
  color: var(--text-color);
}

.toc-item.active .toc-link {
  background-color: #e3f2fd;
  color: #1976d2;
  font-weight: 500;
  border-left: 3px solid #1976d2;
  padding-left: 9px;
}

.content-section {
  background: var(--card-bg);
  border-radius: 8px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.content-section h1 {
  margin: 0 0 24px 0;
  color: var(--text-color);
  font-size: 28px;
  font-weight: 700;
}

.content-section h3 {
  margin: 24px 0 12px 0;
  color: var(--text-color);
  font-size: 18px;
  font-weight: 600;
}

.content-body p {
  line-height: 1.6;
  color: #6c757d;
  margin-bottom: 16px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.feature-card {
  background: #f8f9fa;
  padding: 24px;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 32px;
  margin-bottom: 16px;
}

.feature-card h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #495057;
}

.feature-card p {
  margin: 0;
  font-size: 14px;
  color: #6c757d;
  line-height: 1.5;
}

.step-guide {
  margin-top: 24px;
}

.step {
  display: flex;
  margin-bottom: 24px;
  align-items: flex-start;
}

.step-number {
  width: 32px;
  height: 32px;
  background: #1976d2;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  margin-right: 16px;
  flex-shrink: 0;
}

.step-content h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #495057;
}

.step-content p {
  margin: 0;
  color: #6c757d;
  line-height: 1.5;
}

.feature-list {
  margin: 16px 0;
  padding-left: 20px;
}

.feature-list li {
  margin-bottom: 8px;
  color: #6c757d;
  line-height: 1.5;
}

@media (max-width: 1024px) {
  .content-layout {
    flex-direction: column;
  }

  .content-area {
    max-width: 100%;
    padding: 32px 16px;
  }

  .toc-sidebar {
    width: 100%;
    position: relative;
    top: auto;
    margin-left: 0;
    order: -1;
    margin-bottom: 24px;
  }

  .toc-container {
    margin: 0 16px;
  }
}

@media (max-width: 768px) {
  .content-area {
    padding: 16px;
  }

  .content-section {
    padding: 24px 16px;
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }

  .toc-container {
    margin: 0 8px;
    padding: 16px;
  }
}
</style>