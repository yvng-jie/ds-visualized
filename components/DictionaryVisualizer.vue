<template>
  <div class="visualizer">
    <div class="controls">
      <div class="input-group">
        <input v-model="keyValue" type="text" :placeholder="t('Key', '键')" class="input" style="width: 80px" />
        <input
          v-model="valValue"
          type="text"
          :placeholder="t('Value', '值')"
          class="input"
          style="width: 80px"
          @keyup.enter="set"
        />
        <button class="btn btn-primary" @click="set">set</button>
        <button class="btn btn-danger" @click="remove">remove</button>
        <button class="btn btn-secondary" @click="get">get</button>
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
        <strong>{{ Object.keys(dict).length }}</strong>
      </span>
      <span class="log" v-if="lastOp">
        {{ lastOp }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from './composables/useI18n.js'
import { COLORS, drawText, drawEmptyMessage } from './visualizer-utils.js'

const { t } = useI18n()

const canvas = ref(null)
const keyValue = ref('')
const valValue = ref('')
const lastOp = ref('')
const canvasWidth = 600
const canvasHeight = 320

const defaultData = { name: 'Alice', age: '25', city: 'NYC' }
const dict = reactive({ ...defaultData })

let animating = false

function draw(highlightKey = null) {
  const ctx = canvas.value?.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)

  const entries = Object.entries(dict)
  if (entries.length === 0) {
    drawEmptyMessage(ctx, t('{} Empty dictionary', '{} 空字典'), canvasWidth, canvasHeight)
    return
  }

  const cellW = 120
  const cellH = 40
  const perRow = Math.min(entries.length, 4)
  const cols = perRow
  const rows = Math.ceil(entries.length / cols)
  const totalW = cols * cellW
  const startX = Math.max(20, (canvasWidth - totalW) / 2)
  const startY = Math.max(30, (canvasHeight - rows * (cellH + 10)) / 2)

  for (let i = 0; i < entries.length; i++) {
    const col = i % cols
    const row = Math.floor(i / cols)
    const x = startX + col * cellW
    const y = startY + row * (cellH + 10)
    const [key, value] = entries[i]
    const isHighlighted = key === highlightKey

    // Key box
    const keyGrad = ctx.createLinearGradient(x, y, x, y + cellH)
    keyGrad.addColorStop(0, '#3b82f6')
    keyGrad.addColorStop(1, '#2563eb')
    ctx.fillStyle = keyGrad
    ctx.beginPath()
    ctx.roundRect(x, y, cellW * 0.4, cellH, 6)
    ctx.fill()

    drawText(ctx, String(key), x + cellW * 0.2, y + cellH / 2, COLORS.white, 'bold 13px monospace')

    // Arrow
    ctx.fillStyle = COLORS.text
    ctx.font = '14px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('→', x + cellW * 0.45, y + cellH / 2)

    // Value box
    const valGrad = ctx.createLinearGradient(x + cellW * 0.5, y, x + cellW * 0.5, y + cellH)
    valGrad.addColorStop(0, '#22c55e')
    valGrad.addColorStop(1, '#16a34a')
    ctx.fillStyle = valGrad
    ctx.beginPath()
    ctx.roundRect(x + cellW * 0.5, y, cellW * 0.5, cellH, 6)
    ctx.fill()

    drawText(ctx, String(value), x + cellW * 0.75, y + cellH / 2, COLORS.white, 'bold 13px monospace')

    // Highlight border
    if (isHighlighted) {
      ctx.strokeStyle = COLORS.accent
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.roundRect(x - 2, y - 2, cellW + 4, cellH + 4, 8)
      ctx.stroke()
    }
  }
}

function set() {
  if (animating) return
  const k = keyValue.value.trim()
  const v = valValue.value.trim()
  if (!k) {
    lastOp.value = t('⚠️ Please enter a key', '⚠️ 请输入键')
    return
  }
  keyValue.value = ''
  valValue.value = ''

  dict[k] = v || ''
  lastOp.value = `✅ set(${k}: ${v || ''})`
  draw(k)
}

function remove() {
  if (animating) return
  const k = keyValue.value.trim()
  if (!k) {
    lastOp.value = t('⚠️ Enter key to remove', '⚠️ 请输入要移除的键')
    return
  }
  keyValue.value = ''

  if (!(k in dict)) {
    lastOp.value = t(`⚠️ Key "${k}" not found`, `⚠️ 键 "${k}" 不存在`)
    draw()
    return
  }
  delete dict[k]
  lastOp.value = `🗑️ remove(${k})`
  draw()
}

function get() {
  if (animating) return
  const k = keyValue.value.trim()
  if (!k) {
    lastOp.value = t('⚠️ Enter key to get', '⚠️ 请输入要查找的键')
    return
  }
  if (k in dict) {
    lastOp.value = `🔍 get(${k}) → ${dict[k]}`
    draw(k)
  } else {
    lastOp.value = t(`🔍 get(${k}) → undefined`, `🔍 get(${k}) → 未找到`)
    draw()
  }
}

function reset() {
  Object.assign(dict, defaultData)
  Object.keys(dict).forEach((k) => {
    if (!(k in defaultData)) delete dict[k]
  })
  lastOp.value = t('↻ Reset to initial data', '↻ 已恢复初始示例数据')
  draw()
}

onMounted(() => {
  lastOp.value = t('Try set/get/remove operations', '尝试 set/get/remove 操作')
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
