<template>
  <div class="visualizer">
    <div class="controls">
      <div class="btn-group">
        <button class="btn" :class="{ active: mode === 'add' }" @click="mode = 'add'">
          {{ t('✏️ Add Edge', '✏️ 添加边') }}
        </button>
        <button class="btn" :class="{ active: mode === 'bfs' }" @click="startBFS">🌊 BFS</button>
        <button class="btn" :class="{ active: mode === 'dfs' }" @click="startDFS">🧗 DFS</button>
      </div>
      <div class="btn-group">
        <button class="btn btn-sm" :class="{ active: !isDirected }" @click="setUndirected">
          {{ t('Undirected', '无向') }}
        </button>
        <button class="btn btn-sm" :class="{ active: isDirected }" @click="setDirected">
          {{ t('Directed', '有向') }}
        </button>
      </div>
      <button class="btn btn-secondary" @click="autoLayout">
        {{ t('Auto Layout', '自动布局') }}
      </button>
      <button class="btn btn-secondary" @click="reset">
        {{ t('Reset', '重置') }}
      </button>
    </div>
    <div class="canvas-wrapper">
      <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight" @click="handleClick"></canvas>
    </div>
    <div class="status-bar">
      <span>
        {{ t('Vertices:', '顶点:') }}
        <strong>{{ graph.vertexes.length }}</strong>
      </span>
      <span>
        {{ t('Edges:', '边:') }}
        <strong>{{ edgeCount }}</strong>
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
const canvasWidth = 600
const canvasHeight = 420
const mode = ref('add')
const lastOp = ref('')
const speed = 400
const isDirected = ref(false)

const graph = {
  vertexes: [],
  edges: {},
  positions: {},
}

const vertexLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
let edgeCount = ref(0)
let animating = false
let selectedVertex = null

function setUndirected() {
  isDirected.value = false
  draw()
}
function setDirected() {
  isDirected.value = true
  draw()
}

function addVertex(label, x, y) {
  if (graph.vertexes.includes(label)) return
  graph.vertexes.push(label)
  graph.edges[label] = []
  graph.positions[label] = { x, y }
}

function addEdge(v1, v2) {
  if (!graph.edges[v1] || !graph.edges[v2]) return false
  if (graph.edges[v1].includes(v2)) return false
  graph.edges[v1].push(v2)
  if (!isDirected.value) {
    graph.edges[v2].push(v1)
  }
  edgeCount.value++
  return true
}

function handleClick(e) {
  if (animating || mode.value !== 'add') return
  const rect = canvas.value.getBoundingClientRect()
  const scaleX = canvasWidth / rect.width
  const scaleY = canvasHeight / rect.height
  const x = (e.clientX - rect.left) * scaleX
  const y = (e.clientY - rect.top) * scaleY

  // Check if existing vertex was clicked
  for (const v of graph.vertexes) {
    const pos = graph.positions[v]
    const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2)
    if (dist < 25) {
      if (selectedVertex) {
        if (addEdge(selectedVertex, v)) {
          const arrow = isDirected.value ? '→' : '↔'
          lastOp.value = t(`✅ Added edge ${selectedVertex} ${arrow} ${v}`, `✅ 添加边 ${selectedVertex} ${arrow} ${v}`)
        }
        selectedVertex = null
      } else {
        selectedVertex = v
        lastOp.value = t(`Selected ${v}, click another vertex to connect`, `选中 ${v}，点击另一个顶点以连接`)
      }
      draw()
      return
    }
  }

  // Add new vertex
  if (graph.vertexes.length > 0) {
    let nearest = null
    let minDist = Infinity
    for (const v of graph.vertexes) {
      const pos = graph.positions[v]
      const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2)
      if (dist < minDist) {
        minDist = dist
        nearest = v
      }
    }
    selectedVertex = null
    const label = vertexLabels[graph.vertexes.length] || String(graph.vertexes.length)
    addVertex(label, x, y)
    if (nearest && minDist < 250) {
      addEdge(label, nearest)
      lastOp.value = t(
        `✅ Added vertex ${label}, auto-connected to ${nearest}`,
        `✅ 添加顶点 ${label}，自动连接到 ${nearest}`,
      )
    } else {
      lastOp.value = t(`✅ Added vertex ${label} (isolated)`, `✅ 添加顶点 ${label}（独立）`)
    }
  } else {
    selectedVertex = null
    addVertex(vertexLabels[0], x, y)
    lastOp.value = t(`✅ Added first vertex ${vertexLabels[0]}`, `✅ 添加第一个顶点 ${vertexLabels[0]}`)
  }
  draw()
}

// ─── Force-directed auto layout ───
function autoLayout() {
  if (graph.vertexes.length === 0) return

  const centerX = canvasWidth / 2
  const centerY = canvasHeight / 2
  const radius = Math.min(canvasWidth, canvasHeight) * 0.35

  // Simple circular layout as starting point
  graph.vertexes.forEach((v, i) => {
    const angle = (2 * Math.PI * i) / graph.vertexes.length - Math.PI / 2
    graph.positions[v] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    }
  })

  // Run force-directed iterations
  for (let iter = 0; iter < 50; iter++) {
    const forces = {}

    for (const v of graph.vertexes) {
      forces[v] = { fx: 0, fy: 0 }
    }

    // Repulsion between all pairs
    for (let i = 0; i < graph.vertexes.length; i++) {
      for (let j = i + 1; j < graph.vertexes.length; j++) {
        const a = graph.vertexes[i]
        const b = graph.vertexes[j]
        const pa = graph.positions[a]
        const pb = graph.positions[b]
        let dx = pb.x - pa.x
        let dy = pb.y - pa.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        const force = 3000 / (dist * dist)
        dx = (dx / dist) * force
        dy = (dy / dist) * force
        forces[a].fx -= dx
        forces[a].fy -= dy
        forces[b].fx += dx
        forces[b].fy += dy
      }
    }

    // Attraction along edges
    for (const v of graph.vertexes) {
      for (const n of graph.edges[v]) {
        const pa = graph.positions[v]
        const pb = graph.positions[n]
        let dx = pb.x - pa.x
        let dy = pb.y - pa.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        const force = (dist - 100) * 0.01
        dx = (dx / dist) * force
        dy = (dy / dist) * force
        forces[v].fx += dx
        forces[v].fy += dy
        forces[n].fx -= dx
        forces[n].fy -= dy
      }
    }

    // Apply forces
    for (const v of graph.vertexes) {
      graph.positions[v].x += Math.max(-5, Math.min(5, forces[v].fx))
      graph.positions[v].y += Math.max(-5, Math.min(5, forces[v].fy))
      // Keep within bounds
      graph.positions[v].x = Math.max(30, Math.min(canvasWidth - 30, graph.positions[v].x))
      graph.positions[v].y = Math.max(30, Math.min(canvasHeight - 30, graph.positions[v].y))
    }
  }

  lastOp.value = t('↻ Auto layout applied', '↻ 自动布局完成')
  draw()
}

// ─── Drawing ───
function draw(highlight = [], visitOrder = []) {
  const ctx = canvas.value?.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)

  if (graph.vertexes.length === 0) {
    ctx.fillStyle = COLORS.muted
    ctx.font = '16px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(t('Click on canvas to add vertices', '点击画布添加顶点'), canvasWidth / 2, canvasHeight / 2)
    return
  }

  // Draw edges
  for (const v of graph.vertexes) {
    for (const n of graph.edges[v]) {
      const from = graph.positions[v]
      const to = graph.positions[n]
      if (!from || !to) continue

      // Skip drawing the reverse edge for undirected (avoid double)
      if (!isDirected.value && graph.vertexes.indexOf(v) > graph.vertexes.indexOf(n)) continue

      const isHighlighted = highlight.includes(v + '-' + n) || highlight.includes(n + '-' + v)

      ctx.beginPath()
      ctx.moveTo(from.x, from.y)
      ctx.lineTo(to.x, to.y)
      ctx.strokeStyle = isHighlighted ? '#f59e0b' : '#94a3b8'
      ctx.lineWidth = isHighlighted ? 3 : 2
      ctx.stroke()

      // Directed edge arrow
      if (isDirected.value) {
        const angle = Math.atan2(to.y - from.y, to.x - from.x)
        const arrowSize = 10
        ctx.fillStyle = isHighlighted ? '#f59e0b' : '#94a3b8'
        ctx.beginPath()
        ctx.moveTo(
          to.x - 22 * Math.cos(angle) + arrowSize * Math.cos(angle - Math.PI / 6),
          to.y - 22 * Math.sin(angle) + arrowSize * Math.sin(angle - Math.PI / 6),
        )
        ctx.lineTo(to.x - 22 * Math.cos(angle), to.y - 22 * Math.sin(angle))
        ctx.lineTo(
          to.x - 22 * Math.cos(angle) + arrowSize * Math.cos(angle + Math.PI / 6),
          to.y - 22 * Math.sin(angle) + arrowSize * Math.sin(angle + Math.PI / 6),
        )
        ctx.closePath()
        ctx.fill()
      }
    }
  }

  // Draw vertices
  for (const v of graph.vertexes) {
    const pos = graph.positions[v]
    if (!pos) continue
    const isSelected = selectedVertex === v
    const visitedIdx = visitOrder.indexOf(v)
    const isVisited = visitedIdx >= 0

    let color = '#6366f1'
    if (isSelected) color = '#f59e0b'
    else if (isVisited) {
      const intensity = Math.min(visitedIdx / Math.max(visitOrder.length - 1, 1), 1)
      color = `rgb(${99 + 150 * intensity}, ${102 - 30 * intensity}, ${241 - 80 * intensity})`
    }

    ctx.beginPath()
    ctx.arc(pos.x, pos.y, 22, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
    ctx.strokeStyle = isSelected ? '#d97706' : '#4f46e5'
    ctx.lineWidth = isSelected ? 3 : 2
    ctx.stroke()

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 14px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(v, pos.x, pos.y)
  }
}

async function startBFS() {
  if (animating || graph.vertexes.length === 0) return
  animating = true
  mode.value = 'bfs'
  selectedVertex = null

  const start = graph.vertexes[0]
  const visited = new Set()
  const queue = [start]
  const order = []
  const highlightEdges = []

  while (queue.length > 0) {
    const v = queue.shift()
    if (visited.has(v)) continue
    visited.add(v)
    order.push(v)

    for (const n of graph.edges[v]) {
      if (!visited.has(n)) {
        queue.push(n)
        highlightEdges.push(v + '-' + n)
      }
    }

    draw(highlightEdges, order)
    lastOp.value = t(`🌊 BFS visiting: ${v}`, `🌊 BFS 访问: ${v}`)
    await sleep(speed)
  }

  lastOp.value = t(`🌊 BFS completed: ${order.join(' → ')}`, `🌊 BFS 完成: 访问顺序 ${order.join(' → ')}`)
  animating = false
}

async function startDFS() {
  if (animating || graph.vertexes.length === 0) return
  animating = true
  mode.value = 'dfs'
  selectedVertex = null

  const start = graph.vertexes[0]
  const visited = new Set()
  const order = []
  const highlightEdges = []

  async function dfs(v) {
    if (visited.has(v)) return
    visited.add(v)
    order.push(v)
    draw(highlightEdges, order)
    lastOp.value = t(`🧗 DFS visiting: ${v}`, `🧗 DFS 访问: ${v}`)
    await sleep(speed)

    for (const n of graph.edges[v]) {
      if (!visited.has(n)) {
        highlightEdges.push(v + '-' + n)
        await dfs(n)
      }
    }
  }

  await dfs(start)
  lastOp.value = t(`🧗 DFS completed: ${order.join(' → ')}`, `🧗 DFS 完成: 访问顺序 ${order.join(' → ')}`)
  animating = false
}

const defaultVertices = [
  ['A', 150, 80],
  ['B', 300, 50],
  ['C', 450, 80],
  ['D', 120, 250],
  ['E', 300, 300],
  ['F', 480, 250],
]
const defaultEdges = [
  ['A', 'B'],
  ['A', 'D'],
  ['B', 'C'],
  ['B', 'E'],
  ['C', 'F'],
  ['D', 'E'],
  ['E', 'F'],
]

function buildDefaultGraph() {
  graph.vertexes = []
  graph.edges = {}
  graph.positions = {}
  edgeCount.value = 0
  defaultVertices.forEach(([label, x, y]) => addVertex(label, x, y))
  defaultEdges.forEach(([v1, v2]) => addEdge(v1, v2))
}

function reset() {
  buildDefaultGraph()
  selectedVertex = null
  animating = false
  mode.value = 'add'
  isDirected.value = false
  lastOp.value = t('↻ Reset to initial data', '↻ 已恢复初始示例数据')
  draw()
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

onMounted(() => {
  buildDefaultGraph()
  lastOp.value = t(
    'Click canvas to add vertices (auto-connects), or click BFS/DFS to traverse',
    '点击画布添加顶点（自动连线），或点击 BFS/DFS 遍历',
  )
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
.btn.active {
  background: #6366f1;
  color: white;
  border-color: #6366f1;
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
  min-height: 400px;
  cursor: pointer;
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
