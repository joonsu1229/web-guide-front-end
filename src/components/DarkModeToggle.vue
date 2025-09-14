<template>
  <button
    @click="toggleDarkMode"
    class="dark-mode-toggle"
    :class="{ 'dark': isDark }"
    :title="isDark ? '라이트 모드로 전환' : '다크 모드로 전환'"
  >
    <div class="toggle-track">
      <div class="toggle-thumb" :class="{ 'active': isDark }">
        <svg v-if="isDark" class="icon moon-icon" width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M21 12.79A9 9 0 1 1 11.21 3A7 7 0 0 0 21 12.79Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <svg v-else class="icon sun-icon" width="14" height="14" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
          <path
            d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </div>
    </div>
  </button>
</template>

<script>
export default {
  name: 'DarkModeToggle',
  props: {
    isDark: {
      type: Boolean,
      default: false
    }
  },
  emits: ['toggle'],
  methods: {
    toggleDarkMode() {
      this.$emit('toggle')
    }
  }
}
</script>

<style scoped>
.dark-mode-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 20px;
  transition: all 0.3s ease;
  position: relative;
}

.dark-mode-toggle:hover {
  background: rgba(0, 0, 0, 0.05);
}

.dark-mode-toggle.dark:hover {
  background: rgba(255, 255, 255, 0.1);
}

.toggle-track {
  width: 50px;
  height: 24px;
  background: #e9ecef;
  border-radius: 12px;
  position: relative;
  transition: all 0.3s ease;
  border: 1px solid #dee2e6;
}

.dark-mode-toggle.dark .toggle-track {
  background: #495057;
  border-color: #6c757d;
}

.toggle-thumb {
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: #ffc107;
}

.toggle-thumb.active {
  transform: translateX(26px);
  background: #343a40;
  color: #ffd43b;
}

.icon {
  transition: all 0.2s ease;
}

.sun-icon {
  color: #ffc107;
}

.moon-icon {
  color: #ffd43b;
}

@media (max-width: 768px) {
  .toggle-track {
    width: 44px;
    height: 22px;
  }

  .toggle-thumb {
    width: 18px;
    height: 18px;
  }

  .toggle-thumb.active {
    transform: translateX(22px);
  }
}
</style>