<template>
  <div class="search-container">
    <div class="search-wrapper">
      <div class="search-input-group">
        <div class="search-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19S2 15.194 2 10.5S5.806 2 10.5 2S19 5.806 19 10.5Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <input
          type="text"
          v-model="searchQuery"
          @input="handleSearch"
          @keyup.enter="performSearch"
          placeholder="궁금한 것을 검색해보세요"
          class="search-input"
        />
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="clear-button"
          type="button"
        >
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

      <div v-if="suggestions.length > 0 && showSuggestions" class="suggestions-dropdown">
        <ul class="suggestions-list">
          <li
            v-for="(suggestion, index) in suggestions"
            :key="index"
            class="suggestion-item"
            @click="selectSuggestion(suggestion)"
          >
            <div class="suggestion-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19S2 15.194 2 10.5S5.806 2 10.5 2S19 5.806 19 10.5Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <span class="suggestion-text">{{ suggestion }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  emits: ['search'],
  data() {
    return {
      searchQuery: '',
      showSuggestions: false,
      suggestions: [
        '채용정보 관리 방법',
        '문서 업로드하기',
        '검색 기능 사용법',
        '분석 리포트 생성',
        'API 연동 가이드',
        '시스템 설정 변경'
      ]
    }
  },
  methods: {
    handleSearch() {
      this.showSuggestions = this.searchQuery.length > 0
    },
    performSearch() {
      if (this.searchQuery.trim()) {
        this.$emit('search', this.searchQuery.trim())
        this.showSuggestions = false
      }
    },
    selectSuggestion(suggestion) {
      this.searchQuery = suggestion
      this.showSuggestions = false
      this.$emit('search', suggestion)
    },
    clearSearch() {
      this.searchQuery = ''
      this.showSuggestions = false
    }
  },
  mounted() {
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.showSuggestions = false
      }
    })
  }
}
</script>

<style scoped>
.search-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
}

.search-wrapper {
  position: relative;
}

.search-input-group {
  position: relative;
  display: flex;
  align-items: center;
  background: #fff;
  border: 2px solid #e9ecef;
  border-radius: 50px;
  padding: 0 20px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.search-input-group:focus-within {
  border-color: #007BFF;
  box-shadow: 0 4px 16px rgba(0, 123, 255, 0.15);
}

.search-icon {
  color: #6c757d;
  margin-right: 12px;
  display: flex;
  align-items: center;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 16px 0;
  font-size: 16px;
  color: #495057;
  background: transparent;
}

.search-input::placeholder {
  color: #adb5bd;
}

.clear-button {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  transition: all 0.2s ease;
}

.clear-button:hover {
  background-color: #f8f9fa;
  color: #495057;
}

.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  margin-top: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
}

.suggestions-list {
  list-style: none;
  margin: 0;
  padding: 8px 0;
}

.suggestion-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.suggestion-item:hover {
  background-color: #f8f9fa;
}

.suggestion-icon {
  color: #6c757d;
  margin-right: 12px;
  display: flex;
  align-items: center;
}

.suggestion-text {
  color: #495057;
  font-size: 14px;
}

@media (max-width: 768px) {
  .search-container {
    max-width: 100%;
    padding: 0 16px;
  }

  .search-input {
    font-size: 16px;
    padding: 14px 0;
  }

  .search-input-group {
    padding: 0 16px;
  }
}
</style>