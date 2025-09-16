<template>
  <div class="guide-layout">
    <ManualSidebar
      :currentSection="section"
      :activeItemId="activeItemId"
      @section-change="handleItemSelect"
    />
    <main class="main-content">
      <div class="back-to-main">
        <button @click="goToMainPage" class="back-button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          메인으로 돌아가기
        </button>
      </div>
      <ManualContent 
        :activeItem="activeItem" 
      />
    </main>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useCategoryStore } from '@/stores/useCategoryStore'
import { useManualContentStore } from '@/stores/useManualContentStore'

import ManualSidebar from '@/components/ManualSidebar.vue'
import ManualContent from '@/components/ManualContent.vue'

export default {
  name: 'GuideDetailView',
  components: {
    ManualSidebar,
    ManualContent
  },
  props: {
    section: { type: String, required: true }
  },
  data() {
    return {
      activeItemId: null
    }
  },
  computed: {
    ...mapState(useCategoryStore, ['categoryTree']),
    activeItem() {
      if (!this.activeItemId || !this.categoryTree) return null;
      for (const parent of this.categoryTree) {
        const foundChild = parent.children?.find(child => child.id === this.activeItemId);
        if (foundChild) {
          return { ...foundChild, parentName: parent.name };
        }
      }
      return null;
    }
  },
  methods: {
    ...mapActions(useManualContentStore, ['fetchContent']),
    handleItemSelect(itemId) {
      this.activeItemId = itemId;
    },
    // 메인으로 돌아가는 라우팅 메서드
    goToMainPage() {
      this.$router.push('/');
    }
  },
  watch: {
    activeItemId: {
      handler(newId) {
        if (newId) {
          this.fetchContent('P1', newId);
        }
      }
    },
    // section prop이 바뀔 때 activeItemId를 초기화
    section: {
        handler() {
            this.activeItemId = null;
        },
        immediate: true
    }
  }
}
</script>

<style scoped>
.guide-layout { display: flex; }
.main-content { flex-grow: 1; padding: 0; }
</style>