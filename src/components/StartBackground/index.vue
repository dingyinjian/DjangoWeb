<template>
  <div class="stars">
    <div
      v-for="(star, index) in starsCount"
      :key="index"
      class="star"
      ref="starRefs"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUpdate } from 'vue'

// 配置参数
const starsCount = 1200
const distance = 800

// 引用所有 star 元素
const starRefs = ref([])

// 初始化星星
const initStars = () => {
  const stars = starRefs.value
  if (!stars || stars.length === 0) return

  stars.forEach(item => {
    const speed = 0.2 + Math.random() * 1
    const thisDistance = distance + Math.random() * 300

    // 设置 3D 变换属性
    item.style.transformOrigin = `0 0 ${thisDistance}px`
    item.style.transform = `
      translate3d(0, 0, -${thisDistance}px)
      rotateY(${Math.random() * 360}deg)
      rotateX(${Math.random() * -50}deg)
      scale(${speed}, ${speed})
    `.replace(/\s+/g, ' ') // 清理多余空格
  })
}

// 组件挂载后初始化
onMounted(() => {
  initStars()
})

// 注意：由于 v-for 中使用 ref，需要在每次更新前清空引用
// 否则 starRefs.value 可能不是最新数组
onBeforeUpdate(() => {
  starRefs.value = []
})
</script>

<style scoped>
@keyframes rotate {
  0% {
    transform: perspective(600px) rotateZ(20deg) rotateX(-40deg) rotateY(0);
  }
  100% {
    transform: perspective(600px) rotateZ(20deg) rotateX(-40deg) rotateY(-360deg);
  }
}

.stars {
  transform: perspective(500px);
  transform-style: preserve-3d;
  position: absolute;
  perspective-origin: 50% 100%;
  left: 50%;
  animation: rotate 90s infinite linear;
  bottom: -200px;
}

.star {
  width: 2px;
  height: 2px;
  background: #f7f7b8;
  position: absolute;
  top: 0;
  left: 0;
  backface-visibility: hidden;
}
</style>