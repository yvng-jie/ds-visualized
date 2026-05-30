<template>
  <div class="visualizer">
    <div class="controls">
      <div class="input-group">
        <input v-model="inputValue" type="text" :placeholder="t('Value', '值')" class="input" @keyup.enter="addBack" />
        <button class="btn btn-primary" @click="addFront">addFront</button>
        <button class="btn btn-primary" @click="addBack">addBack</button>
        <button class="btn btn-danger" @click="removeFront">removeFront</button>
        <button class="btn btn-danger" @click="removeBack">removeBack</button>
      </div>
      <button class="btn btn-secondary" @click="reset">
        {{ t('Reset', '重置') }}
      </button>
    </div>
    <div class="canvas-wrapper">
      <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
    </div>
    <div class="status-bar">
      <span>
        {{ t('Size:', '大小:') }}
        <strong>{{ items.length }}</strong>
      </span>
      <span>
        {{ t('Front:', '前端:') }}
        <strong>{{ items.length > 0 ? items[0] : t('Empty', '空') }}</strong>
      </span>
      <span>
        {{ t('Back:', '后端:') }}
        <strong>{{ items.length > 0 ? items[items.length - 1] : t('Empty', '空') }}</strong>
      </span>
      <span class="log" v-if="lastOp">
        {{ lastOp }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from './composables/useI18n.js'
import { COLORS, drawText, drawIndex, drawEmptyMessage } from './visualizer-utils.js'

const { t } = useI18n()

const canvas = ref(null)
const inputValue = ref('')
const lastOp = ref('')
const canvasWidth = 600
const canvasHeight = 200
const MAX_ITEMS = 10

const defaultData = ['A', 'B', 'C']
const items = ref([...defaultData])

let animating = false

function draw() {
  const ctx = canvas.value?.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvasWidth, canvasHeight)

  if (items.value.length === 0) {
    drawEmptyMessage(ctx, t('Empty deque', '空双端队列'), canvasWidth, canvasHeight)
    return
  }

  const boxSize = 50
  const gap = 6
  const startY = 60
  const totalWidth = items.value.length * (boxSize + gap)
  const startX = Math.max(20, (canvasWidth - totalWidth) / 2)

  // Labels
  ctx.fillStyle = COLORS.text
  ctx.font = '12px sans-serif'
  ctx.textAlign = 'center'
  if (items.value.length > 0) {
    ctx.fillText(t('⬅ Front (removeFront)', '⬅ 前端(removeFront)'), startX + boxSize / 2, 40)
    ctx.fillText(t('Back (removeBack) ➡', '后端(removeBack) ➡'), startX + totalWidth - boxSize / 2, 40)
  }

  for (let i = 0; i < items.value.length; i++) {
    const x = startX + i * (boxSize + gap)

    // Box with gradient
    const gradient = ctx.createLinearGradient(x, startY, x + boxSize, startY + boxSize)
    gradient.addColorStop(0, '#0891b2')
    gradient.addColorStop(1, '#0e7490')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.roundRect(x, startY, boxSize, boxSize, 8)
    ctx.fill()

    // Value
    drawText(ctx, String(items.value[i]), x + boxSize / 2, startY + boxSize / 2)

    // Arrow between items
    if (i < items.value.length - 1) {
      ctx.fillStyle = COLORS.muted
      ctx.font = '16px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('↔', x + boxSize + gap / 2, startY + boxSize / 2)
    }
  }

  // Indices
  for (let i = 0; i < items.value.length; i++) {
    const x = startX + i * (boxSize + gap)
    drawIndex(ctx, `[${i}]`, x + boxSize / 2, startY + boxSize + 8)
  }
}

function addFront() {
  if (animating) return
  if (items.value.length >= MAX_ITEMS) {
    lastOp.value = t(`⚠️ Deque is full (max ${MAX_ITEMS} items)`, `⚠️ 双端队列已满（最多 ${MAX_ITEMS} 个元素）`)
    return
  }
  const val = inputValue.value.trim()
  if (!val) {
    lastOp.value = t('⚠️ Please enter a value', '⚠️ 请输入要添加的值')
    return
  }
  inputValue.value = ''
  items.value.unshift(val)
  lastOp.value = `✅ addFront(${val})`
  draw()
}

function addBack() {
  if (animating) return
  if (items.value.length >= MAX_ITEMS) {
    lastOp.value = t(`⚠️ Deque is full (max ${MAX_ITEMS} items)`, `⚠️ 双端队列已满（最多 ${MAX_ITEMS} 个元素）`)
    return
  }
  const val = inputValue.value.trim()
  if (!val) {
    lastOp.value = t('⚠️ Please enter a value', '⚠️ 请输入要添加的值')
    return
  }
  inputValue.value = ''
  items.value.push(val)
  lastOp.value = `✅ addBack(${val})`
  draw()
}

async function removeFront() {
  if (animating) return
  if (items.value.length === 0) {
    lastOp.value = t('⚠️ Deque is empty, cannot remove', '⚠️ 双端队列为空，无法移除')
    return
  }
  animating = true
  const val = items.value.shift()
  lastOp.value = `⏏️ removeFront() → ${val}`
  draw()
  await new Promise((r) => setTimeout(r, 300))
  animating = false
}

async function removeBack() {
  if (animating) return
  if (items.value.length === 0) {
    lastOp.value = t('⚠️ Deque is empty, cannot remove', '⚠️ 双端队列为空，无法移除')
    return
  }
  animating = true
  const val = items.value.pop()
  lastOp.value = `⏏️ removeBack() → ${val}`
  draw()
  await new Promise((r) => setTimeout(r, 300))
  animating = false
}

function reset() {
  items.value = [...defaultData]
  lastOp.value = t('↻ Reset to initial data', '↻ 已恢复初始示例数据')
  draw()
}

onMounted(() => {
  lastOp.value = t('Try adding/removing from both ends', '尝试从两端添加/移除元素')
  draw()
})
</script>

<style scoped>
.visualizer {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 16px;
  background: var(--vp-c-bg-soft);
  margin: 24px 0;
}
.controls {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 12px;
}
.input-group {
  display: flex;
  gap: 6px;
  align-items: center;
  flex-wrap: wrap;
}
.input {
  padding: 6px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  font-size: 13px;
  width: 100px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text);
}
.select {
  padding: 6px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  font-size: 13px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text);
}
.btn {
  padding: 6px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--vp-c-bg);
  color: var(--vp-c-text);
}
.btn-primary {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}
.btn-primary:hover {
  background: #2563eb;
}
.btn-danger {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
}
.btn-danger:hover {
  background: #dc2626;
}
.btn-secondary {
  background: var(--vp-c-bg);
  color: var(--vp-c-text);
  border-color: var(--vp-c-divider);
}
.btn-secondary:hover {
  background: var(--vp-c-bg-soft);
}
.canvas-wrapper {
  display: flex;
  justify-content: center;
}
canvas {
  max-width: 100%;
  height: auto;
}
.status-bar {
  display: flex;
  gap: 16px;
  margin-top: 12px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  flex-wrap: wrap;
}
.log {
  color: var(--vp-c-brand-1);
  font-weight: 500;
}
</style>
