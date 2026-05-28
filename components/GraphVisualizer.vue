<template>
  <div class="visualizer">
    <div class="controls">
      <div class="btn-group">
        <button
          class="btn"
          :class="{ active: mode === 'add' }"
          @click="mode = 'add'"
        >
          ✏️ 添加边
        </button>
        <button
          class="btn"
          :class="{ active: mode === 'bfs' }"
          @click="startBFS"
        >
          🌊 BFS
        </button>
        <button
          class="btn"
          :class="{ active: mode === 'dfs' }"
          @click="startDFS"
        >
          🧗 DFS
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
        @click="handleClick"
      ></canvas>
    </div>
    <div class="status-bar">
      <span>
        顶点:
        <strong>{{ graph.vertexes.length }}</strong>
      </span>
      <span>
        边:
        <strong>{{ edgeCount }}</strong>
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
  const canvasWidth = 600
  const canvasHeight = 400
  const mode = ref('add')
  const lastOp = ref('')
  const speed = 500

  const graph = {
    vertexes: [],
    edges: {},
    positions: {},
  }

  const vertexLabels = ['A', 'B', 'C', 'D', 'E', 'F']
  let edgeCount = ref(0)
  let animating = false

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
    graph.edges[v2].push(v1)
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

    // 看看是否点击了已有顶点
    for (const v of graph.vertexes) {
      const pos = graph.positions[v]
      const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2)
      if (dist < 25) {
        if (selectedVertex) {
          if (addEdge(selectedVertex, v)) {
            lastOp.value = `✅ 添加边 ${selectedVertex} ↔ ${v}`
          }
          selectedVertex = null
        } else {
          selectedVertex = v
          lastOp.value = `选中 ${v}，点击另一个顶点以连接`
        }
        draw()
        return
      }
    }

    // 找到最近的顶点自动连线
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
      // 自动连接最近的顶点
      if (nearest && minDist < 250) {
        addEdge(label, nearest)
        lastOp.value = `✅ 添加顶点 ${label}，自动连接到 ${nearest}`
      } else {
        lastOp.value = `✅ 添加顶点 ${label}（独立）`
      }
    } else {
      selectedVertex = null
      const label = vertexLabels[0]
      addVertex(label, x, y)
      lastOp.value = `✅ 添加第一个顶点 ${label}`
    }
    draw()
  }

  let selectedVertex = null

  function draw(highlight = [], visitOrder = []) {
    const ctx = canvas.value?.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    // 画边
    for (const v of graph.vertexes) {
      for (const n of graph.edges[v]) {
        const from = graph.positions[v]
        const to = graph.positions[n]
        if (!from || !to) continue

        const isHighlighted = highlight.includes(v + '-' + n) || highlight.includes(n + '-' + v)
        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)
        ctx.strokeStyle = isHighlighted ? '#f59e0b' : '#cbd5e1'
        ctx.lineWidth = isHighlighted ? 3 : 2
        ctx.stroke()
      }
    }

    // 画顶点
    for (const v of graph.vertexes) {
      const pos = graph.positions[v]
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
      lastOp.value = `🌊 BFS 访问: ${v}`
      await sleep(speed)
    }

    lastOp.value = `🌊 BFS 完成: 访问顺序 ${order.join(' → ')}`
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
      lastOp.value = `🧗 DFS 访问: ${v}`
      await sleep(speed)

      for (const n of graph.edges[v]) {
        if (!visited.has(n)) {
          highlightEdges.push(v + '-' + n)
          await dfs(n)
        }
      }
    }

    await dfs(start)
    lastOp.value = `🧗 DFS 完成: 访问顺序 ${order.join(' → ')}`
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
    lastOp.value = '↻ 已恢复初始示例数据'
    draw()
  }

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms))
  }

  onMounted(() => {
    buildDefaultGraph()
    lastOp.value = '点击画布添加顶点（自动连线），或点击 BFS/DFS 遍历'
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
    gap: 6px;
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
