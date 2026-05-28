<template>
  <div class="visualizer">
    <div class="controls">
      <div class="input-group">
        <input
          v-model="inputValue"
          type="text"
          placeholder="输入值"
          class="input"
          @keyup.enter="push"
        />
        <button
          class="btn btn-primary"
          @click="push"
        >
          push
        </button>
        <button
          class="btn btn-danger"
          @click="pop"
        >
          pop
        </button>
      </div>
      <div class="speed-control">
        <label>速度:</label>
        <select
          v-model="speed"
          class="select"
        >
          <option value="500">慢速</option>
          <option value="300">正常</option>
          <option value="100">快速</option>
        </select>
      </div>
      <button
        class="btn btn-secondary"
        @click="reset"
      >
        重置
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
        大小:
        <strong>{{ items.length }}</strong>
      </span>
      <span>
        栈顶:
        <strong>{{ items.length > 0 ? items[items.length - 1] : '空' }}</strong>
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

  const canvas = ref(null)
  const inputValue = ref('')
  const speed = ref(300)
  const lastOp = ref('')
  const canvasWidth = 500
  const canvasHeight = 380
  const MAX_ITEMS = 12

  // 初始示例数据（重置时恢复到此状态）
  const defaultData = [5, 10, 15]
  const items = ref([...defaultData])

  let animating = false

  function drawStack() {
    const ctx = canvas.value?.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    const boxWidth = 120
    const boxHeight = 36
    const startX = (canvasWidth - boxWidth) / 2
    const startY = canvasHeight - 40

    // 画底座
    ctx.fillStyle = '#94a3b8'
    ctx.fillRect(startX - 10, startY + 5, boxWidth + 20, 6)
    ctx.fillRect(startX - 10, startY + 5, 6, 12)
    ctx.fillRect(startX + boxWidth + 4, startY + 5, 6, 12)

    // 标注栈顶方向
    ctx.fillStyle = '#64748b'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('⬆ 栈顶', canvasWidth / 2, 18)

    for (let i = 0; i < items.value.length; i++) {
      const y = startY - (items.value.length - i) * (boxHeight + 4)

      // 盒子
      const gradient = ctx.createLinearGradient(startX, y, startX, y + boxHeight)
      gradient.addColorStop(0, '#3b82f6')
      gradient.addColorStop(1, '#2563eb')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.roundRect(startX, y, boxWidth, boxHeight, 6)
      ctx.fill()

      // 边框高亮 - 栈顶
      if (i === items.value.length - 1) {
        ctx.strokeStyle = '#f59e0b'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.roundRect(startX, y, boxWidth, boxHeight, 6)
        ctx.stroke()
      }

      // 文字
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 14px monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(String(items.value[i]), startX + boxWidth / 2, y + boxHeight / 2)
    }
  }

  function push() {
    if (animating) return
    if (items.value.length >= MAX_ITEMS) {
      lastOp.value = '⚠️ 栈已满（最多 ' + MAX_ITEMS + ' 个元素）'
      return
    }
    const val = inputValue.value.trim()
    if (!val) {
      lastOp.value = '⚠️ 请输入要入栈的值'
      return
    }
    inputValue.value = ''
    items.value.push(val)
    lastOp.value = `✅ push(${val})`
    drawStack()
  }

  async function pop() {
    if (animating) return
    if (items.value.length === 0) {
      lastOp.value = '⚠️ 栈为空，无法 pop'
      return
    }
    animating = true
    const val = items.value.pop()
    lastOp.value = `⏏️ pop() → ${val}`
    drawStack()
    await sleep(speed.value)
    animating = false
  }

  function reset() {
    items.value = [...defaultData]
    lastOp.value = '↻ 已恢复初始示例数据'
    drawStack()
  }

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms))
  }

  onMounted(() => {
    lastOp.value = '点击 push/pop 试试'
    drawStack()
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
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 12px;
  }

  .input-group {
    display: flex;
    gap: 6px;
  }

  .input {
    width: 100px;
    padding: 6px 10px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 6px;
    font-size: 14px;
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
    border: none;
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-primary {
    background: #3b82f6;
    color: white;
  }
  .btn-primary:hover {
    background: #2563eb;
  }
  .btn-danger {
    background: #ef4444;
    color: white;
  }
  .btn-danger:hover {
    background: #dc2626;
  }
  .btn-secondary {
    background: var(--vp-c-divider);
    color: var(--vp-c-text);
  }
  .btn-secondary:hover {
    background: var(--vp-c-bg);
  }

  .canvas-wrapper {
    display: flex;
    justify-content: center;
    background: var(--vp-c-bg);
    border-radius: 8px;
    padding: 10px;
    min-height: 380px;
  }

  canvas {
    max-width: 100%;
  }

  .status-bar {
    display: flex;
    gap: 20px;
    margin-top: 12px;
    font-size: 13px;
    color: var(--vp-c-text-2);
  }

  .log {
    color: var(--vp-c-brand-1);
    font-weight: 500;
    margin-left: auto;
  }
</style>
