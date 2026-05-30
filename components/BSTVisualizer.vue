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
        <button class="btn btn-danger" @click="removeNode">delete</button>
        <button class="btn btn-secondary" @click="search">search</button>
      </div>
      <div class="btn-group">
        <button class="btn btn-sm" :class="{ active: traverseMode === 'pre' }" @click="startTraversal('pre')">
          {{ t('Pre', '前序') }}
        </button>
        <button class="btn btn-sm" :class="{ active: traverseMode === 'in' }" @click="startTraversal('in')">
          {{ t('In', '中序') }}
        </button>
        <button class="btn btn-sm" :class="{ active: traverseMode === 'post' }" @click="startTraversal('post')">
          {{ t('Post', '后序') }}
        </button>
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
        {{ t('Nodes:', '节点数:') }}
        <strong>{{ nodeCount }}</strong>
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
import { COLORS } from './visualizer-utils.js'

const { t } = useI18n()

const canvas = ref(null)
const inputValue = ref('')
const speed = ref(300)
const lastOp = ref('')
const traverseMode = ref('')
const canvasWidth = 600
const canvasHeight = 380

const tree = { root: null }
const nodeCount = ref(0)

const NODE_R = 20
const LEVEL_H = 70

let animating = false

// ─── BST Node structure ───
function createNode(val) {
  return { val, left: null, right: null, x: 0, y: 0 }
}

// ─── Insert ───
function insert() {
  if (animating) return
  const val = parseInt(inputValue.value)
  if (isNaN(val)) {
    lastOp.value = t('⚠️ Please enter a valid number', '⚠️ 请输入有效的数字')
    return
  }
  inputValue.value = ''

  if (searchNode(tree.root, val)) {
    lastOp.value = t(`⚠️ ${val} already exists`, `⚠️ ${val} 已存在`)
    draw()
    return
  }

  const node = createNode(val)

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

  layout(tree.root, 0, canvasWidth, 50)
  nodeCount.value = countNodes(tree.root)
  lastOp.value = `✅ insert(${val})`
  draw()
}

// ─── Delete ───
function removeNode() {
  if (animating) return
  const val = parseInt(inputValue.value)
  if (isNaN(val)) {
    lastOp.value = t('⚠️ Enter number to delete', '⚠️ 请输入要删除的数字')
    return
  }
  inputValue.value = ''

  if (!tree.root || !searchNode(tree.root, val)) {
    lastOp.value = t(`⚠️ ${val} not found`, `⚠️ ${val} 不存在`)
    draw()
    return
  }

  tree.root = deleteRec(tree.root, val)
  layout(tree.root, 0, canvasWidth, 50)
  nodeCount.value = countNodes(tree.root)
  lastOp.value = `🗑️ delete(${val})`
  draw()
}

function deleteRec(node, val) {
  if (!node) return null

  if (val < node.val) {
    node.left = deleteRec(node.left, val)
    return node
  }
  if (val > node.val) {
    node.right = deleteRec(node.right, val)
    return node
  }

  // Case 1: Leaf node
  if (!node.left && !node.right) return null

  // Case 2: One child
  if (!node.left) return node.right
  if (!node.right) return node.left

  // Case 3: Two children — find inorder successor (min of right subtree)
  let successor = node.right
  while (successor.left) successor = successor.left
  node.val = successor.val
  node.right = deleteRec(node.right, successor.val)
  return node
}

// ─── Search with path highlight ───
async function search() {
  if (animating) return
  const val = parseInt(inputValue.value)
  if (isNaN(val)) {
    lastOp.value = t('⚠️ Enter number to search', '⚠️ 请输入要搜索的数字')
    return
  }
  inputValue.value = ''

  const path = []
  let node = tree.root
  let found = false

  while (node) {
    path.push(node)
    if (val === node.val) {
      found = true
      draw(path, node)
      lastOp.value = `🔍 ${val} → ${t('found', '已找到')}!`
      break
    } else if (val < node.val) {
      draw(path)
      await sleep(speed.value)
      node = node.left
    } else {
      draw(path)
      await sleep(speed.value)
      node = node.right
    }
  }

  if (!found) {
    draw(path)
    lastOp.value = t(`🔍 ${val} → not found`, `🔍 ${val} → 未找到`)
  }
}

// ─── Traversal animation ───
async function startTraversal(mode) {
  if (animating || !tree.root) return
  animating = true
  traverseMode.value = mode

  const order = []
  if (mode === 'pre') preOrder(tree.root, order)
  else if (mode === 'in') inOrder(tree.root, order)
  else postOrder(tree.root, order)

  for (let i = 0; i < order.length; i++) {
    drawHighlighted(order.slice(0, i + 1), order[i])
    const modeLabel = mode === 'pre' ? 'Pre' : mode === 'in' ? 'In' : 'Post'
    lastOp.value = `${modeLabel}-order: ${order.slice(0, i + 1).join(' → ')}`
    await sleep(speed.value)
  }

  traverseMode.value = ''
  animating = false
  draw()
  lastOp.value = t(
    `${mode === 'pre' ? 'Pre' : mode === 'in' ? 'In' : 'Post'}-order traversal complete`,
    `${mode === 'pre' ? '前序' : mode === 'in' ? '中序' : '后序'}遍历完成`,
  )
}

function preOrder(node, arr) {
  if (!node) return
  arr.push(node.val)
  preOrder(node.left, arr)
  preOrder(node.right, arr)
}

function inOrder(node, arr) {
  if (!node) return
  inOrder(node.left, arr)
  arr.push(node.val)
  inOrder(node.right, arr)
}

function postOrder(node, arr) {
  if (!node) return
  postOrder(node.left, arr)
  postOrder(node.right, arr)
  arr.push(node.val)
}

// ─── Layout ───
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

// ─── Drawing ───
function draw(highlightPath = [], highlightNode = null) {
  const ctx = canvas.value?.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)

  const pathSet = new Set(highlightPath)

  function drawNode(node) {
    if (!node) return

    // Edges
    if (node.left) {
      ctx.beginPath()
      ctx.moveTo(node.x, node.y + NODE_R)
      ctx.lineTo(node.left.x, node.left.y - NODE_R)
      ctx.strokeStyle = pathSet.has(node) && pathSet.has(node.left) ? '#f59e0b' : '#94a3b8'
      ctx.lineWidth = pathSet.has(node) && pathSet.has(node.left) ? 3 : 2
      ctx.stroke()
      drawNode(node.left)
    }
    if (node.right) {
      ctx.beginPath()
      ctx.moveTo(node.x, node.y + NODE_R)
      ctx.lineTo(node.right.x, node.right.y - NODE_R)
      ctx.strokeStyle = pathSet.has(node) && pathSet.has(node.right) ? '#f59e0b' : '#94a3b8'
      ctx.lineWidth = pathSet.has(node) && pathSet.has(node.right) ? 3 : 2
      ctx.stroke()
      drawNode(node.right)
    }

    // Node circle
    const isHighlighted = node === highlightNode
    const isInPath = pathSet.has(node) && !isHighlighted

    ctx.beginPath()
    ctx.arc(node.x, node.y, NODE_R, 0, Math.PI * 2)

    if (isHighlighted) {
      ctx.fillStyle = '#f59e0b'
    } else if (isInPath) {
      ctx.fillStyle = '#93c5fd'
    } else {
      const grad = ctx.createRadialGradient(node.x - 4, node.y - 4, 2, node.x, node.y, NODE_R)
      grad.addColorStop(0, '#22c55e')
      grad.addColorStop(1, '#16a34a')
      ctx.fillStyle = grad
    }
    ctx.fill()

    ctx.strokeStyle = isHighlighted ? '#d97706' : '#15803d'
    ctx.lineWidth = isHighlighted || isInPath ? 3 : 2
    ctx.stroke()

    // Value
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 14px monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(node.val, node.x, node.y)
  }

  if (tree.root) {
    drawNode(tree.root)
  } else {
    ctx.fillStyle = COLORS.muted
    ctx.font = '16px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(
      t('Empty tree — enter a number and click insert', '空树 — 输入数字点击 insert 添加节点'),
      canvasWidth / 2,
      canvasHeight / 2,
    )
  }
}

function drawHighlighted(visitedVals, currentVal) {
  // Find the current node by value
  function findNode(node, val) {
    if (!node) return null
    if (node.val === val) return node
    return val < node.val ? findNode(node.left, val) : findNode(node.right, val)
  }

  // Build path to current node
  function buildPath(node, val, path) {
    if (!node) return false
    path.push(node)
    if (node.val === val) return true
    if (buildPath(node.left, val, path)) return true
    if (buildPath(node.right, val, path)) return true
    path.pop()
    return false
  }

  const path = []
  buildPath(tree.root, currentVal, path)
  draw(path, path[path.length - 1])
}

function searchNode(node, val) {
  if (!node) return false
  if (val === node.val) return true
  return val < node.val ? searchNode(node.left, val) : searchNode(node.right, val)
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

// ─── Default data ───
const defaultData = [50, 30, 70, 20, 40, 60, 80]

function buildTree(values) {
  tree.root = null
  for (const v of values) {
    const node = createNode(v)
    if (!tree.root) {
      tree.root = node
      continue
    }
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
  layout(tree.root, 0, canvasWidth, 50)
  nodeCount.value = countNodes(tree.root)
}

function reset() {
  buildTree(defaultData)
  lastOp.value = t('↻ Reset to initial data', '↻ 已恢复初始示例数据')
  draw()
}

onMounted(() => {
  buildTree(defaultData)
  lastOp.value = t(
    'Sample BST. Try insert/delete/search/ traversal buttons.',
    '示例 BST。尝试 insert/delete/search/遍历按钮。',
  )
  draw()
})
</script>

<style scoped>
.btn-group {
  display: flex;
  gap: 4px;
}
.btn-sm {
  padding: 4px 10px;
  font-size: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  cursor: pointer;
  background: var(--vp-c-bg);
  color: var(--vp-c-text);
  transition: all 0.2s;
}
.btn-sm.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}
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
