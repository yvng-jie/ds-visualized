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
      </div>
      <button class="btn btn-secondary" @click="reset">{{ t('Reset', '重置') }}</button>
    </div>
    <div class="canvas-wrapper">
      <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
    </div>
    <div class="status-bar">
      <span
        >{{ t('Nodes:', '节点:') }} <strong>{{ count }}</strong></span
      >
      <span
        >{{ t('Height:', '高度:') }} <strong>{{ height }}</strong></span
      >
      <span v-if="lastRotation" style="color: #f59e0b; font-size: 12px">{{ lastRotation }}</span>
      <span class="log" v-if="lastOp">{{ lastOp }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from './composables/useI18n.js'
import { COLORS, drawText } from './visualizer-utils.js'
import { NODE_R, LEVEL_H, CANVAS_W, CANVAS_H } from '../lib/constants.js'

const { t } = useI18n()

const animating = false

const canvas = ref(null)
const inputValue = ref('')
const lastOp = ref('')
const lastRotation = ref('')
const canvasWidth = CANVAS_W
const canvasHeight = CANVAS_H
const count = ref(0)
const height = ref(0)

// --- AVL Tree logic (inline for visualizer) ---
let root = null

class AVLNode {
  constructor(key) {
    this.key = key
    this.left = null
    this.right = null
    this.height = 1
    this.x = 0
    this.y = 0
  }
}

function getH(n) {
  return n ? n.height : 0
}
function updH(n) {
  n.height = 1 + Math.max(getH(n.left), getH(n.right))
}
function getBal(n) {
  return n ? getH(n.left) - getH(n.right) : 0
}

function rotR(y) {
  const x = y.left,
    T2 = x.right
  x.right = y
  y.left = T2
  updH(y)
  updH(x)
  return x
}

function rotL(x) {
  const y = x.right,
    T2 = y.left
  y.left = x
  x.right = T2
  updH(x)
  updH(y)
  return y
}

function insertKey(key) {
  let rotation = ''
  function ins(node) {
    if (!node) return new AVLNode(key)
    if (key < node.key) node.left = ins(node.left)
    else if (key > node.key) node.right = ins(node.right)
    else return node
    updH(node)
    const bal = getBal(node)
    if (bal > 1 && key < node.left.key) {
      rotation = 'LL'
      return rotR(node)
    }
    if (bal < -1 && key > node.right.key) {
      rotation = 'RR'
      return rotL(node)
    }
    if (bal > 1 && key > node.left.key) {
      rotation = 'LR'
      node.left = rotL(node.left)
      return rotR(node)
    }
    if (bal < -1 && key < node.right.key) {
      rotation = 'RL'
      node.right = rotR(node.right)
      return rotL(node)
    }
    return node
  }
  root = ins(root)
  return rotation
}

function deleteKey(key) {
  function del(node, k) {
    if (!node) return null
    if (k < node.key) node.left = del(node.left, k)
    else if (k > node.key) node.right = del(node.right, k)
    else {
      if (!node.left && !node.right) return null
      if (!node.left) return node.right
      if (!node.right) return node.left
      let succ = node.right
      while (succ.left) succ = succ.left
      node.key = succ.key
      node.right = del(node.right, succ.key)
    }
    updH(node)
    const bal = getBal(node)
    if (bal > 1 && getBal(node.left) >= 0) return rotR(node)
    if (bal > 1 && getBal(node.left) < 0) {
      node.left = rotL(node.left)
      return rotR(node)
    }
    if (bal < -1 && getBal(node.right) <= 0) return rotL(node)
    if (bal < -1 && getBal(node.right) > 0) {
      node.right = rotR(node.right)
      return rotL(node)
    }
    return node
  }
  root = del(root, key)
}

function countNodes(n) {
  return n ? 1 + countNodes(n.left) + countNodes(n.right) : 0
}
function treeHeight(n) {
  return n ? n.height : 0
}

function layout(node, left, right, y) {
  if (!node) return
  node.x = (left + right) / 2
  node.y = y
  layout(node.left, left, node.x, y + LEVEL_H)
  layout(node.right, node.x, right, y + LEVEL_H)
}

function draw() {
  const ctx = canvas.value?.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)

  if (!root) {
    ctx.fillStyle = COLORS.muted
    ctx.font = '16px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(t('Empty AVL tree', '空 AVL 树'), canvasWidth / 2, canvasHeight / 2)
    return
  }

  function drawNode(node) {
    if (!node) return
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

    // Node circle
    const bal = getBal(node)
    ctx.beginPath()
    ctx.arc(node.x, node.y, NODE_R, 0, Math.PI * 2)
    ctx.fillStyle = bal === 0 ? '#22c55e' : Math.abs(bal) <= 1 ? '#3b82f6' : '#f59e0b'
    ctx.fill()
    ctx.strokeStyle = '#1e40af'
    ctx.lineWidth = 2
    ctx.stroke()

    drawText(ctx, String(node.key), node.x, node.y, COLORS.white, 'bold 14px monospace')

    // Balance factor badge
    ctx.fillStyle = '#1e293b'
    ctx.font = '10px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText(`bf:${bal}`, node.x, node.y + NODE_R + 2)
  }

  drawNode(root)
}

function insert() {
  const val = parseInt(inputValue.value)
  if (isNaN(val)) {
    lastOp.value = t('⚠️ Enter a number', '⚠️ 请输入数字')
    return
  }
  inputValue.value = ''

  if (search(root, val)) {
    lastOp.value = t(`⚠️ ${val} already exists`, `⚠️ ${val} 已存在`)
    draw()
    return
  }

  const rot = insertKey(val)
  layout(root, 0, canvasWidth, 50)
  count.value = countNodes(root)
  height.value = treeHeight(root)
  lastRotation.value = rot ? `🔄 Rotation: ${rot}` : ''
  lastOp.value = `✅ insert(${val})`
  draw()
}

function removeNode() {
  if (animating) return
  const val = parseInt(inputValue.value)
  if (isNaN(val)) {
    lastOp.value = t('⚠️ Enter a number', '⚠️ 请输入数字')
    return
  }
  inputValue.value = ''
  if (!search(root, val)) {
    lastOp.value = t(`⚠️ ${val} not found`, `⚠️ ${val} 不存在`)
    draw()
    return
  }
  deleteKey(val)
  if (root) layout(root, 0, canvasWidth, 50)
  count.value = countNodes(root)
  height.value = treeHeight(root)
  lastRotation.value = ''
  lastOp.value = `🗑️ delete(${val})`
  draw()
}

function search(node, key) {
  while (node) {
    if (key === node.key) return true
    node = key < node.key ? node.left : node.right
  }
  return false
}

const defaultData = [30, 20, 40, 10, 25, 35, 50]

function reset() {
  root = null
  for (const v of defaultData) {
    function ins(node) {
      if (!node) return new AVLNode(v)
      if (v < node.key) node.left = ins(node.left)
      else if (v > node.key) node.right = ins(node.right)
      else return node
      updH(node)
      const bal = getBal(node)
      if (bal > 1 && v < node.left.key) return rotR(node)
      if (bal < -1 && v > node.right.key) return rotL(node)
      if (bal > 1 && v > node.left.key) {
        node.left = rotL(node.left)
        return rotR(node)
      }
      if (bal < -1 && v < node.right.key) {
        node.right = rotR(node.right)
        return rotL(node)
      }
      return node
    }
    root = ins(root)
  }
  layout(root, 0, canvasWidth, 50)
  count.value = countNodes(root)
  height.value = treeHeight(root)
  lastRotation.value = ''
  lastOp.value = t('↻ Reset to balanced AVL tree', '↻ 已重置为平衡的 AVL 树')
  draw()
}

onMounted(() => {
  reset()
})
</script>

<style scoped></style>
