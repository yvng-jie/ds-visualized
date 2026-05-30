<template>
  <div class="visualizer">
    <div class="controls">
      <div class="input-group">
        <input v-model="inputValue" type="text" :placeholder="t('Value', '值')" class="input" @keyup.enter="enqueue" />
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
      <button class="btn btn-secondary" @click="reset">{{ t('Reset', '重置') }}</button>
    </div>
    <div class="canvas-wrapper">
      <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
    </div>
    <div class="status-bar">
      <span
        >{{ t('Size:', '大小:') }} <strong>{{ count }}</strong></span
      >
      <span
        >{{ t('Capacity:', '容量:') }} <strong>{{ CAPACITY }}</strong></span
      >
      <span
        >{{ t('Front:', '队首:') }} <strong>{{ frontIdx }}</strong></span
      >
      <span
        >{{ t('Rear:', '队尾:') }} <strong>{{ rearIdx }}</strong></span
      >
      <span class="log" v-if="lastOp">{{ lastOp }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from './composables/useI18n.js'
import { COLORS, drawText } from './visualizer-utils.js'

const { t } = useI18n()

const canvas = ref(null)
const inputValue = ref('')
const speed = ref(300)
const lastOp = ref('')
const canvasWidth = 560
const canvasHeight = 340
const CAPACITY = 7

const items = ref(new Array(CAPACITY).fill(null))
const front = ref(-1)
const rear = ref(-1)
const count = ref(0)
const frontIdx = ref('-')
const rearIdx = ref('-')

let animating = false

function draw(highlightIdx = -1) {
  const ctx = canvas.value?.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)

  const cellSize = 56
  const gap = 6
  const totalW = CAPACITY * (cellSize + gap)
  const startX = (canvasWidth - totalW) / 2
  const startY = 80

  // Title
  ctx.fillStyle = COLORS.text
  ctx.font = '13px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'bottom'
  ctx.fillText(
    t('Circular Buffer (front/rear pointers wrap around)', '环形缓冲区（front/rear 指针循环）'),
    canvasWidth / 2,
    startY - 12,
  )

  for (let i = 0; i < CAPACITY; i++) {
    const x = startX + i * (cellSize + gap)
    const val = items.value[i]
    const isHighlighted = i === highlightIdx

    // Cell
    ctx.fillStyle = isHighlighted ? '#fef3c7' : '#f8fafc'
    ctx.strokeStyle = isHighlighted ? COLORS.accent : COLORS.muted
    ctx.lineWidth = isHighlighted ? 3 : 1
    ctx.beginPath()
    ctx.roundRect(x, startY, cellSize, cellSize, 6)
    ctx.fill()
    ctx.stroke()

    // Value or empty
    if (val !== null) {
      drawText(ctx, String(val), x + cellSize / 2, startY + cellSize / 2, '#1e293b', 'bold 16px monospace')
    } else {
      ctx.fillStyle = '#cbd5e1'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('∅', x + cellSize / 2, startY + cellSize / 2)
    }

    // Index
    ctx.fillStyle = COLORS.text
    ctx.font = '11px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText(`[${i}]`, x + cellSize / 2, startY + cellSize + 6)

    // Front marker
    if (i === front.value) {
      ctx.fillStyle = '#3b82f6'
      ctx.font = 'bold 12px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'bottom'
      ctx.fillText('↑ front', x + cellSize / 2, startY - 4)
    }

    // Rear marker
    if (i === rear.value) {
      ctx.fillStyle = '#f59e0b'
      ctx.font = 'bold 11px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'bottom'
      ctx.fillText('↑ rear', x + cellSize / 2, startY - 4)
    }
  }

  // Wrap-around arrow
  if (count.value > 0) {
    ctx.strokeStyle = COLORS.muted
    ctx.lineWidth = 1.5
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    const wrapY = startY + cellSize + 30
    ctx.moveTo(startX + totalW - 10, wrapY)
    ctx.lineTo(startX + totalW + 20, wrapY)
    ctx.lineTo(startX + 20, wrapY)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = COLORS.text
    ctx.font = '10px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText(t('wrap around →', '循环 →'), startX + totalW / 2, wrapY + 4)
  }
}

function enqueue() {
  if (animating) return
  if (count.value >= CAPACITY) {
    lastOp.value = t('⚠️ Queue is full', '⚠️ 队列已满')
    return
  }
  const val = inputValue.value.trim()
  if (!val) {
    lastOp.value = t('⚠️ Please enter a value', '⚠️ 请输入值')
    return
  }
  inputValue.value = ''

  if (count.value === 0) {
    front.value = 0
    rear.value = 0
  } else {
    rear.value = (rear.value + 1) % CAPACITY
  }

  items.value[rear.value] = val
  count.value++
  frontIdx.value = front.value
  rearIdx.value = rear.value
  lastOp.value = `✅ enqueue(${val}) → [${rear.value}]`
  draw(rear.value)
}

async function dequeue() {
  if (animating) return
  if (count.value === 0) {
    lastOp.value = t('⚠️ Queue is empty', '⚠️ 队列为空')
    return
  }
  animating = true
  const val = items.value[front.value]
  items.value[front.value] = null

  if (front.value === rear.value) {
    front.value = -1
    rear.value = -1
  } else {
    front.value = (front.value + 1) % CAPACITY
  }

  count.value--
  frontIdx.value = front.value === -1 ? '-' : front.value
  rearIdx.value = rear.value === -1 ? '-' : rear.value
  lastOp.value = `⏏️ dequeue() → ${val}`
  draw(front.value === -1 ? -1 : (front.value - 1 + CAPACITY) % CAPACITY)
  await new Promise((r) => setTimeout(r, speed.value))
  animating = false
}

function reset() {
  for (let i = 0; i < CAPACITY; i++) items.value[i] = null
  front.value = -1
  rear.value = -1
  count.value = 0
  frontIdx.value = '-'
  rearIdx.value = '-'
  lastOp.value = t('↻ Reset', '↻ 已重置')
  draw()
}

onMounted(() => {
  lastOp.value = t(
    'Try enqueue/dequeue — watch front/rear wrap around!',
    '尝试 enqueue/dequeue — 观察 front/rear 循环！',
  )
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
.speed-control {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
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
