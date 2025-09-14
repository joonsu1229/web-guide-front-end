<template>
  <main class="main-content" :class="{ 'dark-mode': isDark }">
    <div class="breadcrumb">
      <span>사용자 매뉴얼</span>
      <span class="separator">></span>
      <span>{{ getBreadcrumbText() }}</span>
    </div>

    <div class="content-layout">
      <div class="content-area">
      <section v-if="activeSection === 'overview'" class="content-section">
        <h1>개요</h1>
        <div class="content-body">
          <p>웹 가이드 시스템에 오신 것을 환영합니다. 이 시스템은 효율적인 채용 정보 관리와 문서 관리를 위한 통합 플랫폼입니다.</p>

          <div class="feature-grid">
            <div class="feature-card">
              <div class="feature-icon">📋</div>
              <h3>채용정보 관리</h3>
              <p>채용 공고, 지원자 관리, 면접 일정 등을 체계적으로 관리할 수 있습니다.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">📄</div>
              <h3>문서 관리</h3>
              <p>각종 문서의 업로드, 분류, 검색 기능을 제공합니다.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">🔍</div>
              <h3>고급 검색</h3>
              <p>키워드, 필터, 정렬 기능을 통한 정확한 정보 검색이 가능합니다.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">📊</div>
              <h3>분석 및 통계</h3>
              <p>데이터 시각화를 통한 인사이트를 제공합니다.</p>
            </div>
          </div>
        </div>
      </section>

      <section v-else-if="activeSection === 'getting-started'" class="content-section">
        <h1>시작 가이드</h1>
        <div class="content-body">
          <div class="step-guide">
            <div class="step">
              <div class="step-number">1</div>
              <div class="step-content">
                <h3>시스템 접속</h3>
                <p>웹 브라우저를 통해 시스템에 접속합니다. 권장 브라우저는 Chrome, Firefox, Safari입니다.</p>
              </div>
            </div>

            <div class="step">
              <div class="step-number">2</div>
              <div class="step-content">
                <h3>메뉴 탐색</h3>
                <p>상단 네비게이션을 통해 원하는 기능에 접근할 수 있습니다.</p>
              </div>
            </div>

            <div class="step">
              <div class="step-number">3</div>
              <div class="step-content">
                <h3>데이터 입력</h3>
                <p>각 섹션에서 필요한 정보를 입력하고 저장합니다.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-else-if="activeSection === 'job-management'" class="content-section">
        <h1>채용정보 관리</h1>
        <div class="content-body">
          <h3>주요 기능</h3>
          <ul class="feature-list">
            <li>채용 공고 작성 및 관리</li>
            <li>지원자 정보 관리</li>
            <li>면접 일정 관리</li>
            <li>채용 프로세스 트래킹</li>
          </ul>

          <h3>사용 방법</h3>
          <p>좌측 메뉴에서 "채용정보 관리"를 클릭하여 해당 페이지로 이동할 수 있습니다. 새로운 채용 공고를 등록하거나 기존 정보를 수정할 수 있습니다.</p>
        </div>
      </section>

      <section v-else-if="activeSection === 'document-management'" class="content-section">
        <h1>문서 관리</h1>
        <div class="content-body">
          <h3>지원되는 파일 형식</h3>
          <ul class="feature-list">
            <li>PDF 문서</li>
            <li>Microsoft Office 파일 (Word, Excel, PowerPoint)</li>
            <li>이미지 파일 (JPG, PNG, GIF)</li>
            <li>텍스트 파일</li>
          </ul>

          <h3>문서 업로드</h3>
          <p>드래그 앤 드롭 또는 파일 선택을 통해 문서를 업로드할 수 있습니다. 업로드된 문서는 자동으로 분류되며 검색 가능합니다.</p>
        </div>
      </section>

      <section v-else-if="activeSection === 'search'" class="content-section">
        <h1>검색 기능</h1>
        <div class="content-body">
          <h3>검색 유형</h3>
          <ul class="feature-list">
            <li>키워드 검색</li>
            <li>고급 필터 검색</li>
            <li>카테고리별 검색</li>
            <li>날짜 범위 검색</li>
          </ul>

          <h3>검색 팁</h3>
          <p>정확한 검색 결과를 위해 구체적인 키워드를 사용하고, 필터 옵션을 활용하시기 바랍니다.</p>
        </div>
      </section>

      <section v-else-if="activeSection === 'analytics'" class="content-section">
        <h1>분석 및 통계</h1>
        <div class="content-body">
          <h3>제공되는 분석</h3>
          <ul class="feature-list">
            <li>채용 현황 통계</li>
            <li>문서 사용률 분석</li>
            <li>사용자 활동 분석</li>
            <li>시스템 성능 지표</li>
          </ul>

          <h3>리포트 생성</h3>
          <p>필요한 데이터를 선택하여 PDF나 Excel 형태의 리포트를 생성할 수 있습니다.</p>
        </div>
      </section>

      <section v-else-if="activeSection === 'api'" class="content-section">
        <h1>API 연동</h1>
        <div class="content-body">
          <h3>REST API</h3>
          <p>시스템은 RESTful API를 제공하여 외부 시스템과의 연동을 지원합니다.</p>

          <h3>인증 방법</h3>
          <p>API 키 또는 JWT 토큰을 통한 인증이 가능합니다.</p>
        </div>
      </section>

      <section v-else-if="activeSection === 'settings'" class="content-section">
        <h1>설정 관리</h1>
        <div class="content-body">
          <h3>시스템 설정</h3>
          <ul class="feature-list">
            <li>사용자 권한 관리</li>
            <li>시스템 환경 설정</li>
            <li>알림 설정</li>
            <li>백업 설정</li>
          </ul>
        </div>
      </section>
      </div>

      <div class="toc-sidebar" v-if="tocItems.length > 0">
        <div class="toc-container">
          <h4 class="toc-title">목차</h4>
          <nav class="toc-nav">
            <ul class="toc-list">
              <li
                v-for="item in tocItems"
                :key="item.id"
                class="toc-item"
                :class="{ active: activeAnchor === item.id }"
              >
                <a
                  :href="`#${item.id}`"
                  class="toc-link"
                  @click.prevent="scrollToSection(item.id)"
                >
                  {{ item.text }}
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'ManualContent',
  props: {
    activeSection: {
      type: String,
      default: 'overview'
    },
    isDark: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tocItems: [],
      activeAnchor: ''
    }
  },
  watch: {
    activeSection: {
      handler() {
        this.$nextTick(() => {
          this.extractTocItems()
          this.addScrollListener()
        })
      },
      immediate: true
    }
  },
  mounted() {
    this.extractTocItems()
    this.addScrollListener()
  },
  beforeUnmount() {
    this.removeScrollListener()
  },
  methods: {
    getBreadcrumbText() {
      const sectionMap = {
        'overview': '개요',
        'getting-started': '시작 가이드',
        'job-management': '채용정보 관리',
        'document-management': '문서 관리',
        'search': '검색 기능',
        'analytics': '분석 및 통계',
        'api': 'API 연동',
        'settings': '설정 관리'
      }
      return sectionMap[this.activeSection] || '개요'
    },
    extractTocItems() {
      this.tocItems = []
      this.$nextTick(() => {
        const headings = this.$el.querySelectorAll('.content-section h3')
        headings.forEach((heading, index) => {
          const id = `heading-${index}`
          heading.id = id
          this.tocItems.push({
            id: id,
            text: heading.textContent.trim()
          })
        })
      })
    },
    scrollToSection(id) {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    },
    addScrollListener() {
      window.addEventListener('scroll', this.handleScroll)
    },
    removeScrollListener() {
      window.removeEventListener('scroll', this.handleScroll)
    },
    handleScroll() {
      if (this.tocItems.length === 0) return

      const scrollPosition = window.scrollY + 100
      let activeId = ''

      for (let i = this.tocItems.length - 1; i >= 0; i--) {
        const element = document.getElementById(this.tocItems[i].id)
        if (element && element.offsetTop <= scrollPosition) {
          activeId = this.tocItems[i].id
          break
        }
      }

      if (activeId !== this.activeAnchor) {
        this.activeAnchor = activeId
      }
    }
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