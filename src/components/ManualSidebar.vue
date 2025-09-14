<template>
  <div class="sidebar" :class="{ 'dark-mode': isDark }">
    <nav class="sidebar-nav">
      <div class="nav-section">
        <h3 class="nav-section-title collapsible" @click="toggleSection('getting-started')">
          <span class="toggle-icon" :class="{ expanded: !collapsedSections['getting-started'] }">></span>
          시작하기
        </h3>
        <ul class="nav-list" v-show="!collapsedSections['getting-started']">
          <li class="nav-item" :class="{ active: activeSection === 'overview' }" @click="selectSection('overview')">
            <span>개요</span>
          </li>
          <li class="nav-item" :class="{ active: activeSection === 'getting-started' }" @click="selectSection('getting-started')">
            <span>시작 가이드</span>
          </li>
        </ul>
      </div>

      <div class="nav-section">
        <h3 class="nav-section-title collapsible" @click="toggleSection('main-features')">
          <span class="toggle-icon" :class="{ expanded: !collapsedSections['main-features'] }">></span>
          주요 기능
        </h3>
        <ul class="nav-list" v-show="!collapsedSections['main-features']">
          <li class="nav-item" :class="{ active: activeSection === 'job-management' }" @click="selectSection('job-management')">
            <span>채용정보 관리</span>
          </li>
          <li class="nav-item" :class="{ active: activeSection === 'document-management' }" @click="selectSection('document-management')">
            <span>문서 관리</span>
          </li>
          <li class="nav-item" :class="{ active: activeSection === 'search' }" @click="selectSection('search')">
            <span>검색 기능</span>
          </li>
          <li class="nav-item" :class="{ active: activeSection === 'analytics' }" @click="selectSection('analytics')">
            <span>분석 및 통계</span>
          </li>
        </ul>
      </div>

      <div class="nav-section">
        <h3 class="nav-section-title collapsible" @click="toggleSection('advanced-features')">
          <span class="toggle-icon" :class="{ expanded: !collapsedSections['advanced-features'] }">></span>
          고급 기능
        </h3>
        <ul class="nav-list" v-show="!collapsedSections['advanced-features']">
          <li class="nav-item" :class="{ active: activeSection === 'api' }" @click="selectSection('api')">
            <span>API 연동</span>
          </li>
          <li class="nav-item" :class="{ active: activeSection === 'settings' }" @click="selectSection('settings')">
            <span>설정 관리</span>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'ManualSidebar',
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
  emits: ['section-change'],
  data() {
    return {
      collapsedSections: {
        'getting-started': false,
        'main-features': false,
        'advanced-features': false
      }
    }
  },
  methods: {
    selectSection(section) {
      this.$emit('section-change', section)
    },
    toggleSection(section) {
      this.collapsedSections[section] = !this.collapsedSections[section]
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 280px;
  background: var(--card-bg);
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
  position: sticky;
  top: 0;
  height: 100vh;
}

.sidebar-nav {
  padding: 24px 0;
}

.nav-section {
  margin-bottom: 32px;
}

.nav-section-title {
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  margin: 0 0 12px 24px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nav-section-title.collapsible {
  cursor: pointer;
  padding: 8px 24px;
  margin: 0 0 4px 0;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  user-select: none;
}

.nav-section-title.collapsible:hover {
  background-color: var(--hover-bg);
  color: var(--text-color);
}

.toggle-icon {
  margin-right: 8px;
  font-size: 12px;
  transition: transform 0.2s ease;
  display: inline-block;
  width: 12px;
}

.toggle-icon.expanded {
  transform: rotate(90deg);
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  padding: 8px 24px;
  cursor: pointer;
  color: #6c757d;
  font-size: 14px;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background-color: var(--hover-bg);
  color: var(--text-color);
}

.nav-item.active {
  background-color: #e3f2fd;
  color: #1976d2;
  border-right: 3px solid #1976d2;
  font-weight: 500;
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
  }
}
</style>