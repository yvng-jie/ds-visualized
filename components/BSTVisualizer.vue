<template>
  <div class="visualizer">
    <div class="controls">
      <div class="input-group">
        <input
          v-model="inputValue"
          type="number"
          placeholder="数字"
          class="input"
          @keyup.enter="insert"
        />
        <button
          class="btn btn-primary"
          @click="insert"
        >
          insert
        </button>
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
        节点数:
        <strong>{{ nodeCount }}</strong>
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
  import { ref, onMounted, nextTick } from 'vue'

  const canvas = ref(null)
  const inputValue = ref('')
  const lastOp = ref('')
  const canvasWidth = 600
  const canvasHeight = 360

  const tree = { root: null }
  let nodeCount = ref(0)

  const NODE_R = 20
  const LEVEL_H = 70

  function insert() {
    const val = parseInt(inputValue.value)
    if (isNaN(val)) {
      lastOp.value = '⚠️ 请输入有效的数字'
      return
    }
    inputValue.value = ''

    // 检查是否已存在
    if (searchNode(tree.root, val)) {
      lastOp.value = `⚠️ ${val} 已存在，BST 不存储重复值`
      return
    }

    const node = { val, left: null, right: null, x: 0, y: 0 }

    if (!tree.root) {
      tree.root = node
      node.x = canvasWidth / 2
      node.y = 50
    } else {
      let cur = tree.root
      while (true) {
        if (val < cur.val) {
          if (!cur.left) {
            cur.left = node
            break
          }
          cur = cur.left
        } else {
          if (!cur.right) {
            cur.right = node
            break
          }
          cur = cur.right
        }
      }
    }

    // 如果树太深，调整节点大小以适配
    const depth = getDepth(tree.root)
    if (depth > 4) {
      // 缩小节点间距但不影响功能
    }

    layout(tree.root, 0, canvasWidth, 50)
    nodeCount.value = countNodes(tree.root)
    lastOp.value = `✅ insert(${val})`
    draw()
  }

  function layout(node, left, right, y) {
    if (!node) return
    node.x = (left + right) / 2
    node.y = y
    layout(node.left, left, node.x, y + LEVEL_H)
    layout(node.right, node.x, right, y + LEVEL_H)
  }

  function countNodes(node) {
    if (!node) return 0
    return 1 + countNodes(node.left) + countNodes(node.right)
  }

  function draw() {
    const ctx = canvas.value?.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    function drawNode(node) {
      if (!node) return
      // 画边
      if (node.left) {
        ctx.beginPath()
        ctx.moveTo(node.x, node.y + NODE_R)
        ctx.lineTo(node.left.x, node.left.y - NODE_R)
        ctx.strokeStyle = '#94a3b8'
        ctx.lineWidth = 2
        ctx.stroke()
        drawNode(node.left)
      }
      if (node.right) {
        ctx.beginPath()
        ctx.moveTo(node.x, node.y + NODE_R)
        ctx.lineTo(node.right.x, node.right.y - NODE_R)
        ctx.strokeStyle = '#94a3b8'
        ctx.lineWidth = 2
        ctx.stroke()
        drawNode(node.right)
      }
      // 画节点
      const gradient = ctx.createRadialGradient(node.x - 4, node.y - 4, 2, node.x, node.y, NODE_R)
      gradient.addColorStop(0, '#22c55e')
      gradient.addColorStop(1, '#16a34a')
      ctx.beginPath()
      ctx.arc(node.x, node.y, NODE_R, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()
      ctx.strokeStyle = '#15803d'
      ctx.lineWidth = 2
      ctx.stroke()
      // 文字
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 14px monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(node.val, node.x, node.y)
    }

    if (tree.root) drawNode(tree.root)
    else {
      ctx.fillStyle = '#94a3b8'
      ctx.font = '16px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('空树 — 输入数字点击 insert 添加节点', canvasWidth / 2, canvasHeight / 2)
    }
  }

  function searchNode(node, val) {
    if (!node) return false
    if (val === node.val) return true
    return val < node.val ? searchNode(node.left, val) : searchNode(node.right, val)
  }

  function getDepth(node) {
    if (!node) return 0
    return 1 + Math.max(getDepth(node.left), getDepth(node.right))
  }

  const defaultData = [50, 30, 70, 20, 40, 60, 80]

  function buildTree(values) {
    tree.root = null
    values.forEach((v) => {
      const node = { val: v, left: null, right: null, x: 0, y: 0 }
      if (!tree.root) {
        tree.root = node
      } else {
        let cur = tree.root
        while (true) {
          if (v < cur.val) {
            if (!cur.left) {
              cur.left = node
              break
            }
            cur = cur.left
          } else {
            if (!cur.right) {
              cur.right = node
              break
            }
            cur = cur.right
          }
        }
      }
    })
    layout(tree.root, 0, canvasWidth, 50)
    nodeCount.value = countNodes(tree.root)
  }

  function reset() {
    buildTree(defaultData)
    lastOp.value = '↻ 已恢复初始示例数据'
    draw()
  }

  onMounted(() => {
    buildTree(defaultData)
    lastOp.value = '示例 BST，点击 insert 添加更多节点'
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
  .btn {
    padding: 6px 14px;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-primary {
    background: #22c55e;
    color: white;
  }
  .btn-primary:hover {
    background: #16a34a;
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
    min-height: 360px;
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
