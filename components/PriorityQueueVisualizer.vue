<template>
  <div class="visualizer">
    <div class="controls">
      <div class="input-group">
        <input v-model="inputValue" type="text" :placeholder="t('Value', '值')" class="input" @keyup.enter="enqueue" />
        <select v-model.number="priorityValue" class="select priority-select">
          <option v-for="p in 5" :key="p" :value="p">{{ t('Priority', '优先级') }} {{ p }}</option>
        </select>
        <button class="btn btn-primary" @click="enqueue">enqueue</button>
        <button class="btn btn-danger" @click="dequeue">dequeue</button>
      </div>
      <div class="speed-control">
        <label>{{ t('Speed:', '速度:') }}</label>
        <select v-model.number="speed" class="select">
          <option :value="500">{{ t('Slow', '慢速') }}</option>
          <option :value="300">{{ t('Normal', '正常') }}</option>
          <option :value="100">{{ t('Fast', '快速') }}</option>
        </select>
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
        {{ t('Front:', '队首:') }}
        <strong>{{ items.length > 0 ? items[0].element : t('Empty', '空') }}</strong>
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
import { COLORS, drawIndex, drawEmptyMessage } from './visualizer-utils.js'

const { t } = useI18n()

const canvas = ref(null)
const inputValue = ref('')
const priorityValue = ref(3)
const speed = ref(300)
const lastOp = ref('')
const canvasWidth = 600
const canvasHeight = 260
const MAX_ITEMS = 10

const defaultData = [
  { element: 'A', priority: 3 },
  { element: 'B', priority: 1 },
  { element: 'C', priority: 2 },
]
const items = ref(defaultData.map((d) => ({ ...d })))

let animating = false

function drawQueue(highlightIdx = -1) {
  const ctx = canvas.value?.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvasWidth, canvasHeight)

  if (items.value.length === 0) {
    drawEmptyMessage(ctx, t('Empty queue', '空队列'), canvasWidth, canvasHeight)
    return
  }

  const boxWidth = 56
  const boxHeight = 56
  const gap = 6
  const startY = 50
  const totalWidth = items.value.length * (boxWidth + gap)
  const startX = Math.max(20, (canvasWidth - totalWidth) / 2)

  // Labels
  ctx.fillStyle = COLORS.text
  ctx.font = '12px sans-serif'
  ctx.textAlign = 'center'
  if (items.value.length > 0) {
    ctx.fillText(t('⬅ Front (dequeue)', '⬅ 队首(dequeue)'), startX + boxWidth / 2, 30)
    ctx.fillText(t('Rear (enqueue) ➡', '队尾(enqueue) ➡'), startX + totalWidth - boxWidth / 2, 30)
  }

  for (let i = 0; i < items.value.length; i++) {
    const x = startX + i * (boxWidth + gap)
    const item = items.value[i]
    const isHighlighted = i === highlightIdx

    // Box background based on priority
    const intensity = 0.3 + (item.priority / 5) * 0.7
    const r = Math.round(139 - intensity * 60)
    const g = Math.round(92 - intensity * 30)
    const b = Math.round(246 - intensity * 80)
    const color = `rgb(${r}, ${g}, ${b})`

    ctx.fillStyle = color
    ctx.beginPath()
    ctx.roundRect(x, startY, boxWidth, boxHeight, 8)
    ctx.fill()

    if (isHighlighted) {
      ctx.strokeStyle = COLORS.accent
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.roundRect(x, startY, boxWidth, boxHeight, 8)
      ctx.stroke()
    }

    // Element value
    ctx.fillStyle = COLORS.white
    ctx.font = 'bold 16px monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(String(item.element), x + boxWidth / 2, startY + boxHeight / 2 - 6)

    // Priority badge
    ctx.fillStyle = 'rgba(0,0,0,0.3)'
    ctx.beginPath()
    ctx.roundRect(x + boxWidth - 22, startY + boxHeight - 20, 20, 18, 4)
    ctx.fill()
    ctx.fillStyle = COLORS.white
    ctx.font = '11px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`P${item.priority}`, x + boxWidth - 12, startY + boxHeight - 11)

    // Arrow between items
    if (i < items.value.length - 1) {
      ctx.fillStyle = COLORS.muted
      ctx.font = '16px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('→', x + boxWidth + gap / 2, startY + boxHeight / 2)
    }
  }

  // Indices
  for (let i = 0; i < items.value.length; i++) {
    const x = startX + i * (boxWidth + gap)
    drawIndex(ctx, `[${i}]`, x + boxWidth / 2, startY + boxHeight + 8)
  }
}

function enqueue() {
  if (animating) return
  if (items.value.length >= MAX_ITEMS) {
    lastOp.value = t(`⚠️ Queue is full (max ${MAX_ITEMS} items)`, `⚠️ 队列已满（最多 ${MAX_ITEMS} 个元素）`)
    return
  }
  const val = inputValue.value.trim()
  if (!val) {
    lastOp.value = t('⚠️ Please enter a value to enqueue', '⚠️ 请输入要入队的值')
    return
  }
  inputValue.value = ''

  const newItem = { element: val, priority: priorityValue.value }

  // Insert sorted by priority
  let inserted = false
  for (let i = 0; i < items.value.length; i++) {
    if (newItem.priority < items.value[i].priority) {
      items.value.splice(i, 0, newItem)
      inserted = true
      lastOp.value = `✅ enqueue(${val}, p=${priorityValue.value}) → position ${i}`
      break
    }
  }
  if (!inserted) {
    items.value.push(newItem)
    lastOp.value = `✅ enqueue(${val}, p=${priorityValue.value}) → end`
  }

  drawQueue()
}

async function dequeue() {
  if (animating) return
  if (items.value.length === 0) {
    lastOp.value = t('⚠️ Queue is empty, cannot dequeue', '⚠️ 队列为空，无法 dequeue')
    return
  }
  animating = true
  const item = items.value.shift()
  lastOp.value = `⏏️ dequeue() → ${item.element} (p=${item.priority})`
  drawQueue()
  await new Promise((r) => setTimeout(r, speed.value))
  animating = false
}

function reset() {
  items.value = defaultData.map((d) => ({ ...d }))
  lastOp.value = t('↻ Reset to initial data', '↻ 已恢复初始示例数据')
  drawQueue()
}

onMounted(() => {
  lastOp.value = t('Try clicking enqueue/dequeue', '点击 enqueue/dequeue 试试')
  drawQueue()
})
</script>

<style scoped>
.priority-select {
  width: 100px;
}
.speed-control {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}
</style>
