<template>
  <li
    class="nav-item"
    :class="{ active: activeSection === String(category.id) }"
    @click.stop="$emit('section-change', String(category.id))"
    :style="{ paddingLeft: 24 + category.depth * 16 + 'px' }"
  >
    <span>{{ category.name }}</span>
  </li>
  <template v-if="category.children && category.children.length > 0">
    <CategoryItem
      v-for="child in category.children"
      :key="child.id"
      :category="child"
      :active-section="activeSection"
      @section-change="(id) => $emit('section-change', id)"
    />
  </template>
</template>

<script>
export default {
  name: 'CategoryItem', // 재귀 호출을 위해 name 속성 명시
  props: {
    category: {
      type: Object,
      required: true,
    },
    activeSection: {
      type: String,
      default: null,
    },
  },
  emits: ['section-change'],
};
</script>

<style scoped>
/* 스타일은 ManualSidebar.vue에서 가져옵니다. */
.nav-item {
  padding: 8px 24px;
  cursor: pointer;
  color: #6c757d;
  font-size: 14px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
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
</style>