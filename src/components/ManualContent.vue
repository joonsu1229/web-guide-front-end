<template>
  <div class="manual-content-component">
    <div v-if="activeItem" class="content-wrapper">
      <div class="breadcrumb ml-10">
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
            <div class="content-header">
              <h1>{{ activeItem.name }}</h1>
              <div class="header-actions">
                <button
                  class="bookmark-btn"
                  @click="toggleBookmark"
                  :class="{ 'bookmarked': isCurrentBookmarked }"
                  :title="isCurrentBookmarked ? '북마크에서 제거' : '북마크에 추가'"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M19 21L12 16L5 21V5a2 2 0 012-2h10a2 2 0 012 2v16z"
                      :stroke="isCurrentBookmarked ? 'none' : 'currentColor'"
                      :fill="isCurrentBookmarked ? 'currentColor' : 'none'"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
                <button
                  class="copy-link-btn"
                  @click="copyCurrentUrl"
                  :title="getTooltipMessage"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
            <div class="content-body" v-html="renderedContentBody"></div>
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
import { useBookmarkStore } from '@/stores/bookmarkStore'
import { marked } from 'marked'; // marked 라이브러리 import 예시

export default {
  name: 'ManualContent',
  props: {
    activeItem: { type: Object, default: null }
  },
  data() {
    return {
      tocItems: [],
      activeAnchor: '',
      copyMessage: '링크 복사'
    }
  },
  computed: {
    ...mapState(useManualContentStore, ['currentContent', 'loading', 'error']),

    bookmarkStore() {
      return useBookmarkStore()
    },

    isCurrentBookmarked() {
      return this.activeItem ? this.bookmarkStore.isBookmarked(this.activeItem.id) : false
    },

    renderedContentBody() {
      const content = this.currentContent?.contentBody;
      if (!content) {
        return '';
      }

      // 1. API를 거치며 텍스트가 된 '\\n'을 실제 줄바꿈 문자로 변환
      const unescapedString = content.replace(/\\n/g, '\n');

      // 2. marked 라이브러리로 마크다운을 HTML로 변환
      // { breaks: true } 옵션은 단순 줄바꿈(\n)을 <br> 태그
      return marked.parse(unescapedString, { breaks: true });
    },

    getTooltipMessage() {
      if (this.copyMessage === '복사됨!') {
        return '링크가 클립보드에 복사되었습니다!';
      } else if (this.copyMessage === '복사 실패') {
        return '링크 복사에 실패했습니다. 다시 시도해주세요.';
      } else {
        return '이 매뉴얼의 링크를 복사하여 다른 사람과 공유하세요';
      }
    }
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
    },
    async copyCurrentUrl() {
      try {
        // 현재 라우트에서 section을 가져오기
        const currentSection = this.$route.params.section;
        const categoryId = this.activeItem?.id;

        // categoryId가 있으면 해당 카테고리로 직접 이동할 수 있는 URL 생성
        let shareUrl;
        if (categoryId && currentSection) {
          shareUrl = `${window.location.origin}/guide/${currentSection}/${categoryId}`;
        } else {
          shareUrl = window.location.href;
        }

        await navigator.clipboard.writeText(shareUrl);
        this.copyMessage = '복사됨!';
        setTimeout(() => {
          this.copyMessage = '링크 복사';
        }, 2000);
      } catch (err) {
        console.error('클립보드 복사 실패:', err);
        this.copyMessage = '복사 실패';
        setTimeout(() => {
          this.copyMessage = '링크 복사';
        }, 2000);
      }
    },

    toggleBookmark() {
      if (!this.activeItem) return;

      const item = {
        id: this.activeItem.id,
        name: this.activeItem.name,
        parentName: this.activeItem.parentName,
        section: this.$route.params.section || 'P1',
        description: this.currentContent?.contentBody?.substring(0, 100) || ''
      };

      const wasBookmarked = this.isCurrentBookmarked;
      const success = this.bookmarkStore.toggleBookmark(item);

      if (success) {
        // 토스트 메시지나 알림으로 피드백 제공
        const message = wasBookmarked ? '북마크에서 제거되었습니다.' : '북마크에 추가되었습니다.';
        console.log(message);
        // TODO: 실제 토스트 알림으로 교체
      }
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
/* --- 1. 기본 레이아웃 및 여백 --- */
.content-layout {
  display: flex;
  position: relative;
  gap: 32px;
}
.content-area {
  flex: 1;
  min-width: 0;
}
.toc-sidebar {
  width: 250px;
  flex-shrink: 0;
  position: sticky;
  top: 80px;
  height: fit-content;
}

/* --- 2. 상단 경로(Breadcrumb) 디자인 --- */
.breadcrumb {
  padding: 12px 0;
  margin-bottom: 24px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.breadcrumb span:not(.separator) { color: #868e96; }
.breadcrumb span:last-child { color: var(--text-color); font-weight: 500; }
.breadcrumb .separator { color: #ced4da; }

/* --- 3. 콘텐츠 섹션 --- */
.content-section {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 40px;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}
.content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.content-section h1 {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.3;
  margin: 0;
  letter-spacing: -0.5px;
  color: var(--text-color);
  flex: 1;
}

.copy-link-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.copy-link-btn:hover {
  background: #e9ecef;
  color: #1976d2;
  border-color: #1976d2;
  transform: scale(1.05);
}

.copy-link-btn:active {
  transform: scale(0.95);
}

.bookmark-btn {
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6c757d;
  padding: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.bookmark-btn:hover {
  background: #e9ecef;
  color: #ffc107;
  border-color: #ffc107;
  transform: scale(1.05);
}

.bookmark-btn.bookmarked {
  background: #fff3cd;
  color: #ffc107;
  border-color: #ffc107;
}

.bookmark-btn.bookmarked:hover {
  background: #ffeaa7;
  color: #b8860b;
  border-color: #b8860b;
}

.bookmark-btn:active {
  transform: scale(0.95);
}
.content-section-description {
  font-size: 16px;
  color: #6c757d;
  margin-top: -16px;
  margin-bottom: 32px;
}

/* --- 4. v-html 마크다운 콘텐츠 스타일 (여백 수정) --- */
.content-body {
  overflow-wrap: break-word;
}

/* ✨ 여기가 핵심 수정 부분입니다 ✨ */
.content-body :deep(h2) {
  margin-top: 1em;    /* 섹션 구분을 위해 위쪽 여백은 유지 */
  margin-bottom: 0.1em; /* 제목과 아래 내용 사이 간격은 축소 */
  font-size: 16px;
  font-weight: 600;
  padding-bottom: 0.4em;
  border-bottom: 1px solid var(--border-color);
  scroll-margin-top: 90px;
}
.content-body :deep(h3) {
  margin-top: 2em;      /* h2보다 위쪽 여백 축소 */
  margin-bottom: 0.6em; /* 제목과 아래 내용 사이 간격은 축소 */
  font-size: 20px;
  font-weight: 600;
  scroll-margin-top: 90px;
}
.content-body :deep(p),
.content-body :deep(ul),
.content-body :deep(ol),
.content-body :deep(blockquote) {
  margin-bottom: 1.2em; /* 단락 간의 기본 간격 통일 */
}
.content-body :deep(h1) { display: none; }
/* (이하 다른 스타일은 이전과 동일) */

.content-body :deep(p) { line-height: 1.7; color: #495057; }
.content-body :deep(img) { max-width: 100%; display: block; margin: 2.5em auto; border-radius: 8px; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08); border: 1px solid var(--border-color); }
.content-body :deep(ul),
.content-body :deep(ol) { padding-left: 1.8em; }
.content-body :deep(li) { margin-bottom: 0.6em; line-height: 1.7; color: #495057; }
.content-body :deep(a) { color: #1976d2; text-decoration: none; border-bottom: 1px solid #a0cff1; transition: all 0.2s ease; font-weight: 500; }
.content-body :deep(a:hover) { color: #1565c0; background-color: #e3f2fd; }
.content-body :deep(code) { background-color: #f1f3f5; padding: 0.2em 0.5em; border-radius: 4px; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; font-size: 0.9em; color: #343a40; }
.content-body :deep(blockquote) { padding: 1em 1.5em; border-left: 4px solid #a0cff1; background-color: #f8f9fa; color: #6c757d; }
.content-body :deep(hr) { border: none; border-top: 1px solid var(--border-color); margin: 3em 0; }

/* --- 5. 목차(TOC) 사이드바 --- */
.toc-container { background: transparent; border: none; padding: 0; box-shadow: none; }
.toc-title { margin: 0 0 16px 8px; font-size: 14px; font-weight: 600; color: #343a40; letter-spacing: 0.5px; }
.toc-list { list-style: none; margin: 0; padding: 0; }
.toc-item { margin-bottom: 4px; }
.toc-link { display: block; padding: 8px 12px; color: #868e96; text-decoration: none; font-size: 14px; border-radius: 6px; transition: all 0.2s ease; border-left: 3px solid transparent; }
.toc-link:hover { background-color: var(--hover-bg); color: var(--text-color); }
.toc-item.active .toc-link { background-color: #e3f2fd; color: #1976d2; font-weight: 600; border-left: 3px solid #1976d2; }

/* --- 6. 반응형 디자인 --- */
@media (max-width: 1024px) {
  .content-layout { flex-direction: column; gap: 24px; }
  .content-area { max-width: 100%; }
  .toc-sidebar { width: 100%; position: relative; top: auto; margin-left: 0; margin-bottom: 0; order: -1; }
}
@media (max-width: 768px) {
  .content-section { padding: 24px 16px; }
}
</style>