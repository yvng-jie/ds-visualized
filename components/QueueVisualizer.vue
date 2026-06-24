<template>
  <div class="visualizer">
    <div class="controls">
      <div class="input-group">
        <input
          v-model="inputValue"
          type="text"
          :placeholder="isZh ? '值' : 'Value'"
          class="input"
          @keyup.enter="enqueue"
        />
        <button
          class="btn btn-primary"
          @click="enqueue"
        >
          enqueue
        </button>
        <button
          class="btn btn-danger"
          @click="dequeue"
        >
          dequeue
        </button>
      </div>
      <div class="speed-control">
        <label>速度:</label>
        <select
          v-model="speed"
          class="select"
        >
          <option value="500">{{ isZh ? '慢速' : 'Slow' }}</option>
          <option value="300">{{ isZh ? '正常' : 'Normal' }}</option>
          <option value="100">{{ isZh ? '快速' : 'Fast' }}</option>
        </select>
      </div>
      <button
        class="btn btn-secondary"
        @click="reset"
      >
        {{ isZh ? '重置' : 'Reset' }}
      </button>
    </div>
    <div class="canvas-wrapper">
      <canvas
        ref="canvas"
        :width="canvasWidth"
        :height="canvasHeight"
      ></canvas>
    </div>
    <div class="status-bar">
      <span>
        {{ isZh ? '大小:' : 'Size:' }}
        <strong>{{ items.length }}</strong>
      </span>
      <span>
        {{ isZh ? '队首:' : 'Front:' }}
        <strong>{{ items.length > 0 ? items[0] : isZh ? '空' : 'Empty' }}</strong>
      </span>
      <span>
        {{ isZh ? '队尾:' : 'Rear:' }}
        <strong>{{ items.length > 0 ? items[items.length - 1] : isZh ? '空' : 'Empty' }}</strong>
      </span>
      <span
        class="log"
        v-if="lastOp"
      >
        {{ lastOp }}
      </span>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useI18n } from './composables/useI18n.js'
  import { useAnimation } from './composables/useAnimation.js'

  const { isZh } = useI18n()
  const { animating, speed, sleep } = useAnimation()

  const canvas = ref(null)
  const inputValue = ref('')
  const lastOp = ref('')
  const canvasWidth = 600
  const canvasHeight = 200
  const MAX_ITEMS = 10

  const defaultData = ['A', 'B', 'C']
  const items = ref([...defaultData])

  function drawQueue() {
    const ctx = canvas.value?.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    const boxSize = 50
    const gap = 6
    const startY = 60
    const totalWidth = items.value.length * (boxSize + gap)
    const startX = Math.max(20, (canvasWidth - totalWidth) / 2)

    // Labels
    ctx.fillStyle = '#64748b'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'center'
    if (items.value.length > 0) {
      ctx.fillText(isZh.value ? '队首(dequeue)' : 'Front (dequeue)', startX + boxSize / 2, 40)
      ctx.fillText(isZh.value ? '队尾(enqueue)' : 'Rear (enqueue)', startX + totalWidth - boxSize / 2, 40)
    }

    for (let i = 0; i < items.value.length; i++) {
      const x = startX + i * (boxSize + gap)

      // Draw box
      const gradient = ctx.createLinearGradient(x, startY, x + boxSize, startY + boxSize)
      gradient.addColorStop(0, '#8b5cf6')
      gradient.addColorStop(1, '#7c3aed')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.roundRect(x, startY, boxSize, boxSize, 8)
      ctx.fill()

      // Draw arrow
      if (i < items.value.length - 1) {
        ctx.fillStyle = '#94a3b8'
        ctx.font = '16px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        
      }

      // Draw value
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 16px monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(String(items.value[i]), x + boxSize / 2, startY + boxSize / 2)
    }

    // Draw indices
    ctx.fillStyle = '#94a3b8'
    ctx.font = '11px sans-serif'
    ctx.textAlign = 'center'
    for (let i = 0; i < items.value.length; i++) {
      const x = startX + i * (boxSize + gap)
      ctx.fillText(`[${i}]`, x + boxSize / 2, startY + boxSize + 18)
    }
  }

  function enqueue() {
    if (animating.value) return
    if (items.value.length >= MAX_ITEMS) {
      lastOp.value = isZh.value
        ? '队列已满（最多 ' + MAX_ITEMS + ' 个元素）'
        : 'Queue is full (max ' + MAX_ITEMS + ' items)'
      return
    }
    const val = inputValue.value.trim()
    if (!val) {
      lastOp.value = isZh.value ? '请输入要入队的值' : 'Please enter a value to enqueue'
      return
    }
    inputValue.value = ''
    items.value.push(val)
    lastOp.value = `enqueue(${val})`
    drawQueue()
  }

  async function dequeue() {
    if (animating.value) return
    if (items.value.length === 0) {
      lastOp.value = isZh.value ? '队列为空，无法 dequeue' : 'Queue is empty, cannot dequeue'
      return
    }
    animating.value = true
    const val = items.value.shift()
    lastOp.value = `dequeue() ${val}`
    drawQueue()
    await sleep(speed.value)
    animating.value = false
  }

  function reset() {
    items.value = [...defaultData]
    lastOp.value = isZh.value ? '已恢复初始示例数据' : 'Reset to initial data'
    drawQueue()
  }

  onMounted(() => {
    lastOp.value = isZh.value ? '点击 enqueue/dequeue 试试' : 'Try clicking enqueue/dequeue'
    drawQueue()
  })
</script>

<style scoped></style>
