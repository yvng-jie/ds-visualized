<template>
  <div class="visualizer">
    <div class="controls">
      <div class="input-group">
        <input
          v-model="inputValue"
          type="number"
          :placeholder="t('Number', '数字')"
          class="input"
          @keyup.enter="insert"
        />
        <button class="btn btn-primary" @click="insert">insert</button>
        <button class="btn btn-danger" @click="extract">extract</button>
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
        <strong>{{ heap.length }}</strong>
      </span>
      <span>
        {{ t('Min:', '最小值:') }}
        <strong>{{ heap.length > 0 ? heap[0] : t('Empty', '空') }}</strong>
      </span>
      <span class="log" v-if="lastOp">
        {{ lastOp }}
      </span>
    </div>
    <div class="status-bar">
      <span style="font-size: 11px; color: var(--vp-c-text-3); font-family: monospace">
        [{{ heap.join(', ') || t('empty', '空') }}]
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from './composables/useI18n.js'
import { useAnimation } from './composables/useAnimation.js'
import { COLORS, drawEmptyMessage, drawText } from './visualizer-utils.js'

const { t } = useI18n()
const { animating, speed } = useAnimation()

const canvas = ref(null)
const inputValue = ref('')
const lastOp = ref('')
const canvasWidth = 600
const canvasHeight = 340

const defaultData = [3, 8, 5, 12, 10, 7]
const heap = ref([...defaultData])

const NODE_R = 22
const LEVEL_H = 70

function getLayout() {
  const positions = []
  if (heap.value.length === 0) return positions

  function getLevel(n) {
    let level = 0
    while (n > 0) {
      n = Math.floor((n - 1) / 2)
      level++
    }
    return level
  }

  for (let i = 0; i < heap.value.length; i++) {
    const level = getLevel(i)
    const levelMaxNodes = Math.pow(2, level)

    // Calculate x position based on the level and position within level
    const posInLevel = i - (Math.pow(2, level) - 1)
    const totalWidth = canvasWidth - 40
    const levelWidth = totalWidth * 0.9
    const step = levelWidth / (levelMaxNodes + 1)

    const x = 20 + (posInLevel + 1) * step
    const y = 40 + level * LEVEL_H

    positions.push({ x, y, level })
  }

  return positions
}

function draw(highlightIdx = -1) {
  const ctx = canvas.value?.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)

  if (heap.value.length === 0) {
    drawEmptyMessage(ctx, t('Empty heap', '空堆'), canvasWidth, canvasHeight)
    return
  }

  const positions = getLayout()

  // Draw edges
  for (let i = 0; i < heap.value.length; i++) {
    const left = i * 2 + 1
    const right = i * 2 + 2
    const parent = positions[i]

    if (left < heap.value.length) {
      ctx.beginPath()
      ctx.moveTo(parent.x, parent.y + NODE_R)
      ctx.lineTo(positions[left].x, positions[left].y - NODE_R)
      ctx.strokeStyle = COLORS.muted
      ctx.lineWidth = 2
      ctx.stroke()
    }
    if (right < heap.value.length) {
      ctx.beginPath()
      ctx.moveTo(parent.x, parent.y + NODE_R)
      ctx.lineTo(positions[right].x, positions[right].y - NODE_R)
      ctx.strokeStyle = COLORS.muted
      ctx.lineWidth = 2
      ctx.stroke()
    }
  }

  // Draw nodes
  for (let i = 0; i < heap.value.length; i++) {
    const pos = positions[i]
    const isHighlighted = i === highlightIdx

    // Node circle
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, NODE_R, 0, Math.PI * 2)
    if (isHighlighted) {
      ctx.fillStyle = '#f59e0b'
    } else if (i === 0) {
      ctx.fillStyle = '#22c55e' // root
    } else {
      const gradient = ctx.createRadialGradient(pos.x - 4, pos.y - 4, 2, pos.x, pos.y, NODE_R)
      gradient.addColorStop(0, '#3b82f6')
      gradient.addColorStop(1, '#2563eb')
      ctx.fillStyle = gradient
    }
    ctx.fill()
    ctx.strokeStyle = isHighlighted ? '#d97706' : '#1e40af'
    ctx.lineWidth = isHighlighted ? 3 : 2
    ctx.stroke()

    drawText(ctx, String(heap.value[i]), pos.x, pos.y, COLORS.white, 'bold 14px monospace')

    // Index label
    ctx.fillStyle = COLORS.muted
    ctx.font = '10px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText(`[${i}]`, pos.x, pos.y + NODE_R + 4)
  }

  // Legend
  ctx.fillStyle = COLORS.text
  ctx.font = '11px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText(
    t('Min-Heap: parent ≤ children. Root = minimum element.', '最小堆：父节点 ≤ 子节点。根节点为最小值。'),
    canvasWidth / 2,
    canvasHeight - 25,
  )
}

function insert() {
  if (animating.value) return
  const val = parseInt(inputValue.value)
  if (isNaN(val)) {
    lastOp.value = t('Please enter a valid number', '请输入有效的数字')
    return
  }
  inputValue.value = ''

  heap.value.push(val)
  let i = heap.value.length - 1

  // Sift up animation (simplified)
  while (i > 0) {
    const parent = Math.floor((i - 1) / 2)
    if (heap.value[parent] <= heap.value[i]) break
    ;[heap.value[parent], heap.value[i]] = [heap.value[i], heap.value[parent]]
    i = parent
  }

  lastOp.value = ` insert(${val})`
  draw(i)
}

async function extract() {
  if (animating.value) return
  if (heap.value.length === 0) {
    lastOp.value = t('Heap is empty', '堆为空')
    draw()
    return
  }

  animating.value = true
  const min = heap.value[0]
  const last = heap.value.pop()

  if (heap.value.length > 0) {
    heap.value[0] = last
    let i = 0

    // Sift down
    while (true) {
      let smallest = i
      const left = i * 2 + 1
      const right = i * 2 + 2

      if (left < heap.value.length && heap.value[left] < heap.value[smallest]) {
        smallest = left
      }
      if (right < heap.value.length && heap.value[right] < heap.value[smallest]) {
        smallest = right
      }
      if (smallest === i) break
      ;[heap.value[i], heap.value[smallest]] = [heap.value[smallest], heap.value[i]]
      i = smallest
    }

    lastOp.value = `extract() ${min}`
    draw(i)
  } else {
    lastOp.value = `extract() ${min}`
    draw()
  }

  await new Promise((r) => setTimeout(r, speed.value))
  animating.value = false
}

function reset() {
  heap.value = [...defaultData]
  lastOp.value = t('Reset to initial data', '已恢复初始示例数据')
  draw()
}

onMounted(() => {
  lastOp.value = t('Try insert/extract. Watch the sift-up/sift-down!', '尝试 insert/extract。观察上浮/下沉过程！')
  draw()
})
</script>

<style scoped>
.speed-control {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}
</style>
