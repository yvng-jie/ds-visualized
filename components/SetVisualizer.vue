<template>
  <div class="visualizer">
    <div class="controls">
      <div class="input-group">
        <input v-model="inputValue" type="text" :placeholder="t('Value', '值')" class="input" @keyup.enter="add" />
        <button class="btn btn-primary" @click="add">add</button>
        <button class="btn btn-danger" @click="remove">remove</button>
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
        <strong>{{ setValues.length }}</strong>
      </span>
      <span>
        {{ t('Values:', '元素:') }}
        <strong>{{ setValues.length > 0 ? setValues.join(', ') : t('Empty', '空') }}</strong>
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
import { COLORS, drawText, drawEmptyMessage } from './visualizer-utils.js'

const { t } = useI18n()

const canvas = ref(null)
const inputValue = ref('')
const lastOp = ref('')
const canvasWidth = 500
const canvasHeight = 300

const defaultData = ['A', 'B', 'C']
const setValues = ref([...defaultData])

const animating = false

function draw(highlightValue = null) {
  const ctx = canvas.value?.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)

  if (setValues.value.length === 0) {
    drawEmptyMessage(ctx, t('∅ Empty set', '∅ 空集合'), canvasWidth, canvasHeight)
    return
  }

  // Draw a large rounded rect representing the set
  const padding = 40
  const cols = Math.min(setValues.value.length, 5)
  const rows = Math.ceil(setValues.value.length / cols)
  const cellW = 70
  const cellH = 50
  const totalW = cols * cellW
  const totalH = rows * cellH

  const startX = Math.max(padding, (canvasWidth - totalW) / 2)
  const startY = Math.max(padding, (canvasHeight - totalH) / 2)

  // Set boundary box
  ctx.strokeStyle = COLORS.muted
  ctx.lineWidth = 2
  ctx.setLineDash([6, 4])
  ctx.beginPath()
  ctx.roundRect(startX - 15, startY - 15, totalW + 30, totalH + 30, 12)
  ctx.stroke()
  ctx.setLineDash([])

  ctx.fillStyle = '#f0f9ff40'
  ctx.fill()

  // "Set" label
  ctx.fillStyle = COLORS.text
  ctx.font = 'bold 13px sans-serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'bottom'
  ctx.fillText(t('Set { ... }', '集合 { ... }'), startX, startY - 20)

  for (let i = 0; i < setValues.value.length; i++) {
    const col = i % cols
    const row = Math.floor(i / cols)
    const x = startX + col * cellW + cellW / 2
    const y = startY + row * cellH + cellH / 2
    const isHighlighted = setValues.value[i] === highlightValue

    // Circle
    ctx.beginPath()
    ctx.arc(x, y, 18, 0, Math.PI * 2)
    if (isHighlighted) {
      ctx.fillStyle = '#22c55e'
    } else {
      ctx.fillStyle = COLORS.secondary
    }
    ctx.fill()
    ctx.strokeStyle = isHighlighted ? '#16a34a' : COLORS.secondaryDark
    ctx.lineWidth = isHighlighted ? 3 : 2
    ctx.stroke()

    drawText(ctx, String(setValues.value[i]), x, y, COLORS.white, 'bold 14px monospace')
  }
}

function add() {
  if (animating) return
  const val = inputValue.value.trim()
  if (!val) {
    lastOp.value = t('⚠️ Please enter a value', '⚠️ 请输入要添加的值')
    return
  }
  inputValue.value = ''

  if (setValues.value.includes(val)) {
    lastOp.value = t(`⚠️ ${val} already exists`, `⚠️ ${val} 已存在`)
    draw()
    return
  }

  setValues.value.push(val)
  lastOp.value = `✅ add(${val})`
  draw(val)
}

function remove() {
  if (animating) return
  const val = inputValue.value.trim()
  if (!val) {
    lastOp.value = t('⚠️ Enter value to remove', '⚠️ 请输入要移除的值')
    return
  }
  inputValue.value = ''

  const idx = setValues.value.indexOf(val)
  if (idx === -1) {
    lastOp.value = t(`⚠️ ${val} not found`, `⚠️ ${val} 不存在`)
    draw()
    return
  }

  setValues.value.splice(idx, 1)
  lastOp.value = `🗑️ remove(${val})`
  draw()
}

function reset() {
  setValues.value = [...defaultData]
  lastOp.value = t('↻ Reset to initial data', '↻ 已恢复初始示例数据')
  draw()
}

onMounted(() => {
  lastOp.value = t('Try adding/removing elements', '点击 add/remove 试试')
  draw()
})
</script>

<style scoped></style>
