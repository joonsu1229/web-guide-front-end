<template>
  <div class="workthrough-logo" @click="$emit('click')">
    <div class="logo-container">
      <div class="logo-icon">
        <img src="@/assets/walk-through.png" alt="워크쓰루" class="logo-image" />
      </div>
      <div class="logo-text">
        <span class="logo-title">워크쓰루</span>
        <span class="logo-subtitle">헬프센터</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WorkthroughLogo',
  emits: ['click']
}
</script>

<style scoped>
.workthrough-logo {
  cursor: pointer;
  user-select: none;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.logo-image {
  width: 36px;
  height: 36px;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.logo-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.logo-title {
  font-size: 24px;
  font-weight: 700;
  color: white;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo-subtitle {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.workthrough-logo:hover .logo-icon {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.workthrough-logo:hover .logo-title {
  color: rgba(255, 255, 255, 1);
}

.workthrough-logo:hover .logo-subtitle {
  color: rgba(255, 255, 255, 0.9);
}

.logo-icon,
.logo-title,
.logo-subtitle {
  transition: all 0.2s ease;
}

@media (max-width: 768px) {
  .logo-container {
    gap: 8px;
  }

  .logo-icon {
    width: 40px;
    height: 40px;
  }

  .logo-image {
    width: 28px;
    height: 28px;
  }

  .logo-title {
    font-size: 20px;
  }

  .logo-subtitle {
    font-size: 12px;
  }
}
</style>