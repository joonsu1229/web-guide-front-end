<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="footer-content">
        <!-- 워크쓰루 정보 -->
        <div class="footer-section">
          <h3 class="footer-title">워크쓰루</h3>
          <p class="footer-description">
            스마트 그룹웨어 솔루션으로<br>
            업무 효율성을 극대화합니다
          </p>
        </div>

        <!-- 바로가기 링크 -->
        <div class="footer-section">
          <h4 class="footer-subtitle">바로가기</h4>
          <div class="footer-links">
            <a href="#" class="footer-link" @click="goToHomepage">
              <svg class="footer-icon" viewBox="0 0 24 24" fill="none">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              홈페이지
            </a>
            <a href="#" class="footer-link" @click="goToBlog">
              <svg class="footer-icon" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <polyline points="10,9 9,9 8,9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              블로그
            </a>
            <a href="#" class="footer-link" @click="goToYoutube">
              <svg class="footer-icon" viewBox="0 0 24 24" fill="none">
                <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <polygon points="9.75,15.02 15.5,11.75 9.75,8.48" fill="currentColor"/>
              </svg>
              유튜브
            </a>
          </div>
        </div>

        <!-- 가이드 정보 -->
        <div class="footer-section">
          <h4 class="footer-subtitle">웹 가이드</h4>
          <p class="footer-text">
            워크쓰루 사용법과 팁을<br>
            쉽고 빠르게 확인하세요
          </p>
        </div>
      </div>

      <!-- 하단 정보 -->
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p class="copyright">
            © {{ currentYear }} 워크쓰루. All rights reserved.
          </p>
          <div class="footer-meta">
            <span class="version">v{{ version }}</span>
            <span class="separator">|</span>
            <span class="last-updated">최종 업데이트: {{ lastUpdated }}</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  data() {
    return {
      version: '1.0.0',
      lastUpdated: '2025-09-20'
    }
  },
  computed: {
    currentYear() {
      return new Date().getFullYear()
    }
  },
  methods: {
    goToHomepage() {
      window.open('https://www.workthrough.co.kr', '_blank')
    },
    goToBlog() {
      window.open('https://blog.workthrough.co.kr', '_blank')
    },
    goToYoutube() {
      window.open('https://youtube.com/@workthrough', '_blank')
    }
  }
}
</script>

<style scoped>
.app-footer {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 40px;
  padding: 50px 0 30px;
}

.footer-section {
  display: flex;
  flex-direction: column;
}

.footer-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 16px 0;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.footer-subtitle {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: rgba(255, 255, 255, 0.95);
}

.footer-description {
  font-size: 16px;
  line-height: 1.6;
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
}

.footer-text {
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-link {
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.footer-link:hover {
  color: white;
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.footer-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding: 20px 0;
  margin-top: 20px;
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.copyright {
  margin: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.footer-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.separator {
  color: rgba(255, 255, 255, 0.4);
}

.version {
  background: rgba(255, 255, 255, 0.15);
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }

  .footer-section:first-child {
    grid-column: span 2;
  }
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 30px;
    padding: 40px 0 20px;
  }

  .footer-section:first-child {
    grid-column: span 1;
    text-align: center;
  }

  .footer-title {
    font-size: 24px;
  }

  .footer-bottom-content {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .footer-links {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .footer-container {
    padding: 0 16px;
  }

  .footer-content {
    padding: 30px 0 15px;
  }

  .footer-links {
    flex-direction: column;
  }
}
</style>