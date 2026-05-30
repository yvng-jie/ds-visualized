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
          @keyup.enter="put"
        />
        <button class="btn btn-primary" @click="put">put</button>
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
        <strong>{{ itemCount }}</strong>
      </span>
      <span>
        {{ t('Buckets:', '桶数:') }}
        <strong>{{ TABLE_SIZE }}</strong>
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
const keyValue = ref('')
const valValue = ref('')
const lastOp = ref('')
const canvasWidth = 600
const canvasHeight = 380
const TABLE_SIZE = 7

function hashFunc(str) {
  let hashCode = 0
  for (let i = 0; i < str.length; i++) {
    hashCode = 37 * hashCode + str.charCodeAt(i)
  }
  return hashCode % TABLE_SIZE
}

// storage[bucketIndex] = [{ key, value }, ...]
const storage = ref(Array.from({ length: TABLE_SIZE }, () => []))
const itemCount = ref(0)

const defaultData = [
  ['name', 'Alice'],
  ['age', '25'],
  ['city', 'NYC'],
]

let animating = false

function draw(highlightBucket = -1) {
  const ctx = canvas.value?.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)

  const bucketW = 70
  const bucketH = 30
  const startX = 20
  const startY = 20
  const totalEmpty = storage.value.every((b) => b.length === 0)

  for (let i = 0; i < TABLE_SIZE; i++) {
    const x = startX
    const y = startY + i * (bucketH + 8)
    const bucket = storage.value[i]
    const isHighlighted = i === highlightBucket

    // Index label
    ctx.fillStyle = COLORS.text
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'right'
    ctx.textBaseline = 'middle'
    ctx.fillText(`[${i}]`, x - 8, y + bucketH / 2)

    // Bucket box
    ctx.fillStyle = isHighlighted ? '#fef3c7' : '#f8fafc'
    ctx.strokeStyle = isHighlighted ? COLORS.accent : COLORS.muted
    ctx.lineWidth = isHighlighted ? 2 : 1
    ctx.beginPath()
    ctx.roundRect(x, y, bucketW, bucketH, 4)
    ctx.fill()
    ctx.stroke()

    if (bucket.length === 0) {
      ctx.fillStyle = COLORS.muted
      ctx.font = '11px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('null', x + bucketW / 2, y + bucketH / 2)
    } else {
      // Draw chained items
      for (let j = 0; j < bucket.length; j++) {
        const itemX = x + bucketW + 8 + j * 120
        const item = bucket[j]

        // Arrow from bucket
        if (j === 0) {
          ctx.fillStyle = COLORS.text
          ctx.font = '12px sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText('→', x + bucketW + 4, y + bucketH / 2)
        }

        // Chain arrow between items
        if (j > 0) {
          ctx.fillStyle = COLORS.text
          ctx.font = '12px sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText('→', itemX - 8, y + bucketH / 2)
        }

        // Item box
        ctx.fillStyle = isHighlighted ? '#dbeafe' : '#e0e7ff'
        ctx.strokeStyle = isHighlighted ? COLORS.primary : COLORS.secondary
        ctx.lineWidth = isHighlighted ? 2 : 1
        ctx.beginPath()
        ctx.roundRect(itemX, y, 110, bucketH, 4)
        ctx.fill()
        ctx.stroke()

        ctx.fillStyle = '#1e293b'
        ctx.font = '11px monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(`${item.key}:${item.value}`, itemX + 55, y + bucketH / 2)
      }
    }
  }

  // Legend
  if (!totalEmpty) {
    ctx.fillStyle = COLORS.text
    ctx.font = '11px sans-serif'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillText(
      t('Hash(key) → bucket index. Items in same bucket = collision chain.', 'Hash(key) → 桶索引。同一桶内为冲突链。'),
      20,
      canvasHeight - 30,
    )
  }
}

function put() {
  if (animating) return
  const k = keyValue.value.trim()
  const v = valValue.value.trim()
  if (!k) {
    lastOp.value = t('⚠️ Please enter a key', '⚠️ 请输入键')
    return
  }
  keyValue.value = ''
  valValue.value = ''

  const idx = hashFunc(k)
  const bucket = storage.value[idx]

  // Check if key already exists
  const existing = bucket.find((item) => item.key === k)
  if (existing) {
    existing.value = v
    lastOp.value = `🔄 update(${k}: ${v})`
    draw(idx)
    return
  }

  bucket.push({ key: k, value: v })
  itemCount.value++
  lastOp.value = `✅ put(${k}: ${v}) → bucket[${idx}]`
  draw(idx)
}

function remove() {
  if (animating) return
  const k = keyValue.value.trim()
  if (!k) {
    lastOp.value = t('⚠️ Enter key to remove', '⚠️ 请输入要移除的键')
    return
  }
  keyValue.value = ''

  const idx = hashFunc(k)
  const bucket = storage.value[idx]
  const foundIdx = bucket.findIndex((item) => item.key === k)

  if (foundIdx === -1) {
    lastOp.value = t(`⚠️ Key "${k}" not found`, `⚠️ 键 "${k}" 不存在`)
    draw(idx)
    return
  }

  bucket.splice(foundIdx, 1)
  itemCount.value--
  lastOp.value = `🗑️ remove(${k})`
  draw(idx)
}

function reset() {
  for (let i = 0; i < TABLE_SIZE; i++) {
    storage.value[i] = []
  }
  itemCount.value = 0

  for (const [k, v] of defaultData) {
    const idx = hashFunc(k)
    storage.value[idx].push({ key: k, value: v })
    itemCount.value++
  }
  lastOp.value = t('↻ Reset to initial data', '↻ 已恢复初始示例数据')
  draw()
}

onMounted(() => {
  lastOp.value = t(
    'Try put/remove. Same hash = collision (chained together).',
    '尝试 put/remove。相同 hash 值会冲突（链地址法）。',
  )
  reset()
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
  overflow-x: auto;
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
