<template>
  <div class="visualizer">
    <div class="controls">
      <div class="input-group">
        <input
          v-model="inputValue"
          type="text"
          :placeholder="isZh ? '输入值' : 'Enter value'"
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
        {{ isZh ? '栈顶:' : 'Top:' }}
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
  import { COLORS, drawGradientBox, drawText, createRoundedRectPath } from './visualizer-utils.js'

  const { isZh } = useI18n()
  const { animating, speed, sleep } = useAnimation()

  const canvas = ref(null)
  const inputValue = ref('')
  const lastOp = ref('')
  const canvasWidth = 500
  const canvasHeight = 380
  const MAX_ITEMS = 12

  const defaultData = [5, 10, 15]
  const items = ref([...defaultData])

  function drawStack() {
    const ctx = canvas.value?.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    const boxWidth = 120
    const boxHeight = 36
    const startX = (canvasWidth - boxWidth) / 2
    const startY = canvasHeight - 40

    // Draw base
    ctx.fillStyle = COLORS.muted
    ctx.fillRect(startX - 10, startY + 5, boxWidth + 20, 6)
    ctx.fillRect(startX - 10, startY + 5, 6, 12)
    ctx.fillRect(startX + boxWidth + 4, startY + 5, 6, 12)

    // Label: stack top direction
    ctx.fillStyle = COLORS.text
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(isZh.value ? '栈顶' : 'Top', canvasWidth / 2, 18)

    for (let i = 0; i < items.value.length; i++) {
      const y = startY - (items.value.length - i) * (boxHeight + 4)

      // Draw box
      drawGradientBox(ctx, startX, y, boxWidth, boxHeight, 6, COLORS.primary, COLORS.primaryDark)

      // Highlight border - top of stack
      if (i === items.value.length - 1) {
        ctx.strokeStyle = COLORS.accent
        ctx.lineWidth = 3
        createRoundedRectPath(ctx, startX, y, boxWidth, boxHeight, 6)
        ctx.stroke()
      }

      // Draw text
      drawText(ctx, String(items.value[i]), startX + boxWidth / 2, y + boxHeight / 2)
    }
  }

  function push() {
    if (animating.value) return
    if (items.value.length >= MAX_ITEMS) {
      lastOp.value = isZh.value
        ? '栈已满（最多 ' + MAX_ITEMS + ' 个元素）'
        : 'Stack is full (max ' + MAX_ITEMS + ' items)'
      return
    }
    const val = inputValue.value.trim()
    if (!val) {
      lastOp.value = isZh.value ? '请输入要入栈的值' : 'Please enter a value to push'
      return
    }
    inputValue.value = ''
    items.value.push(val)
    lastOp.value = `push(${val})`
    drawStack()
  }

  async function pop() {
    if (animating.value) return
    if (items.value.length === 0) {
      lastOp.value = isZh.value ? '栈为空，无法 pop' : 'Stack is empty, cannot pop'
      return
    }
    animating.value = true
    const val = items.value.pop()
    lastOp.value = `pop() ${val}`
    drawStack()
    await sleep(speed.value)
    animating.value = false
  }

  function reset() {
    items.value = [...defaultData]
    lastOp.value = isZh.value ? '已恢复初始示例数据' : 'Reset to initial data'
    drawStack()
  }

  onMounted(() => {
    lastOp.value = isZh.value ? '点击 push/pop 试试' : 'Try clicking push/pop'
    drawStack()
  })
</script>

<style scoped></style>
