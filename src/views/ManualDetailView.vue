<template>
  <div class="guide-layout">
    <ManualSidebar
      :currentSection="section"
      :activeItemId="activeItemId"
      @item-select="handleItemSelect"
    />
    <main class="main-content">
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
    section: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      activeItemId: null
    }
  },
  computed: {
    // Category 스토어에서 categoryTree 상태를 가져옴
    ...mapState(useCategoryStore, ['categoryTree']),

    // activeItemId를 기반으로 현재 선택된 카테고리의 전체 데이터를 찾음
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
    // ManualContent 스토어에서 fetchContent 액션을 가져옴
    ...mapActions(useManualContentStore, ['fetchContent']),
    
    // ManualSidebar에서 item-select 이벤트가 발생했을 때 호출됨
    handleItemSelect(itemId) {
      this.activeItemId = itemId;
    }
  },
  watch: {
    // activeItemId가 변경될 때마다 콘텐츠를 불러오는 API 호출
    activeItemId: {
      handler(newId) {
        if (newId) {
          this.fetchContent('P1', newId);
        }
      }
    }
  }
}
</script>

<style scoped>
.guide-layout { display: flex; }
.main-content { flex-grow: 1; padding: 0; }
</style>