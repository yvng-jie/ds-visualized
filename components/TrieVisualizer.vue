<template>
  <div class="visualizer">
    <div class="controls">
      <div class="input-group">
        <input v-model="inputValue" type="text" :placeholder="t('Word', '单词')" class="input" @keyup.enter="insert" />
        <button class="btn btn-primary" @click="insert">insert</button>
        <button class="btn btn-secondary" @click="search">search</button>
        <button class="btn btn-danger" @click="remove">remove</button>
      </div>
      <button class="btn btn-secondary" @click="reset">
        {{ t('Reset', '重置') }}
      </button>
    </div>
    <div class="canvas-wrapper">
      <svg :width="svgWidth" :height="svgHeight" class="trie-svg">
        <template v-if="layout.length > 0">
          <!-- Edges -->
          <line
            v-for="(edge, ei) in edges"
            :key="'e' + ei"
            :x1="edge.x1"
            :y1="edge.y1"
            :x2="edge.x2"
            :y2="edge.y2"
            :stroke="edge.highlight ? '#f59e0b' : '#cbd5e1'"
            :stroke-width="edge.highlight ? 3 : 2"
          />
          <!-- Label on edge -->
          <text
            v-for="(edge, ei) in edges"
            :key="'l' + ei"
            :x="(edge.x1 + edge.x2) / 2"
            :y="(edge.y1 + edge.y2) / 2 - 8"
            text-anchor="middle"
            :fill="edge.highlight ? '#f59e0b' : '#64748b'"
            font-size="13"
            font-weight="bold"
          >
            {{ edge.char }}
          </text>

          <!-- Nodes -->
          <g v-for="(node, ni) in layout" :key="'n' + ni">
            <circle
              :cx="node.x"
              :cy="node.y"
              :r="node.isEnd ? 14 : 10"
              :fill="node.highlight ? '#f59e0b' : node.isEnd ? '#22c55e' : '#6366f1'"
              :stroke="node.highlight ? '#d97706' : node.isEnd ? '#15803d' : '#4f46e5'"
              :stroke-width="node.highlight ? 3 : 2"
            />
            <circle
              v-if="node.isEnd"
              :cx="node.x"
              :cy="node.y"
              r="10"
              fill="none"
              :stroke="node.highlight ? '#f59e0b' : '#22c55e'"
              stroke-width="1.5"
            />
          </g>
        </template>

        <text
          v-else
          :x="svgWidth / 2"
          :y="svgHeight / 2"
          text-anchor="middle"
          dominant-baseline="middle"
          fill="#94a3b8"
          font-size="16"
        >
          {{ t('Empty trie — insert words like "cat", "car", "dog"', '空前缀树 — 插入 "cat", "car", "dog" 等单词') }}
        </text>
      </svg>
    </div>
    <div class="status-bar">
      <span>
        {{ t('Words:', '单词数:') }}
        <strong>{{ wordCount }}</strong>
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

const { t } = useI18n()

const inputValue = ref('')
const lastOp = ref('')
const svgWidth = 700
const svgHeight = 400

class TrieNode {
  constructor() {
    this.children = {}
    this.isEndOfWord = false
  }
}

const root = new TrieNode()
const wordCount = ref(0)
const highlightNodes = ref(new Set())

const defaultWords = ['cat', 'car', 'dog']

// Build layout from trie
const layout = ref([])
const edges = ref([])

function buildLayout() {
  const nodes = []
  const edgeList = []
  const NODE_SPACING_X = 50
  const NODE_SPACING_Y = 60
  const START_X = svgWidth / 2
  const START_Y = 40

  function traverse(node, x, y, depth, hSet) {
    nodes.push({
      x,
      y,
      isEnd: node.isEndOfWord,
      highlight: hSet.has(node),
    })

    const children = Object.entries(node.children)
    const totalWidth = children.length * NODE_SPACING_X
    const startX = x - totalWidth / 2 + NODE_SPACING_X / 2

    for (let i = 0; i < children.length; i++) {
      const [char, child] = children[i]
      const cx = startX + i * NODE_SPACING_X
      const cy = y + NODE_SPACING_Y

      edgeList.push({
        x1: x,
        y1: y,
        x2: cx,
        y2: cy,
        char,
        highlight: hSet.has(child),
      })

      traverse(child, cx, cy, depth + 1, hSet)
    }
  }

  traverse(root, START_X, START_Y, 0, highlightNodes.value)
  layout.value = nodes
  edges.value = edgeList
}

function insert() {
  const word = inputValue.value.trim().toLowerCase()
  if (!word) {
    lastOp.value = t('Please enter a word', '请输入单词')
    return
  }
  inputValue.value = ''

  let node = root
  const visited = new Set()
  visited.add(root)

  for (const char of word) {
    if (!node.children[char]) {
      node.children[char] = new TrieNode()
    }
    node = node.children[char]
    visited.add(node)
  }

  if (!node.isEndOfWord) {
    node.isEndOfWord = true
    wordCount.value++
  }

  highlightNodes.value = visited
  lastOp.value = `insert("${word}")`
  buildLayout()
}

function search() {
  const word = inputValue.value.trim().toLowerCase()
  if (!word) {
    lastOp.value = t('Enter word to search', '请输入要搜索的单词')
    return
  }
  inputValue.value = ''

  let node = root
  const visited = new Set()
  visited.add(root)

  for (const char of word) {
    if (!node.children[char]) {
      highlightNodes.value = visited
      buildLayout()
      lastOp.value = t(`"${word}" not found`, `"${word}" 未找到`)
      return
    }
    node = node.children[char]
    visited.add(node)
  }

  highlightNodes.value = visited
  buildLayout()

  if (node.isEndOfWord) {
    lastOp.value = `"${word}" ${t('found', '已找到')}`
  } else {
    lastOp.value = t(`"${word}" prefix exists but not a full word`, `"${word}" 前缀存在但不是完整单词`)
  }
}

function remove() {
  const word = inputValue.value.trim().toLowerCase()
  if (!word) {
    lastOp.value = t('Enter word to remove', '请输入要移除的单词')
    return
  }
  inputValue.value = ''

  // Check if word exists
  let node = root
  const path = [root]
  for (const char of word) {
    if (!node.children[char]) {
      lastOp.value = t(`${word} not found`, `${word} 不存在`)
      return
    }
    node = node.children[char]
    path.push(node)
  }

  if (!node.isEndOfWord) {
    lastOp.value = t(` "${word}" not found`, ` "${word}" 不存在`)
    return
  }

  node.isEndOfWord = false
  wordCount.value--

  // Cleanup unused nodes
  for (let i = path.length - 1; i >= 1; i--) {
    const child = path[i]
    const parent = path[i - 1]
    const char = word[i - 1]

    if (Object.keys(child.children).length === 0 && !child.isEndOfWord) {
      delete parent.children[char]
    } else {
      break
    }
  }

  highlightNodes.value = new Set()
  lastOp.value = `remove("${word}")`
  buildLayout()
}

function reset() {
  // Clear all children from root
  Object.keys(root.children).forEach((k) => delete root.children[k])
  root.isEndOfWord = false
  wordCount.value = 0
  highlightNodes.value = new Set()

  // Insert default words
  for (const w of defaultWords) {
    let node = root
    for (const char of w) {
      if (!node.children[char]) node.children[char] = new TrieNode()
      node = node.children[char]
    }
    if (!node.isEndOfWord) {
      node.isEndOfWord = true
      wordCount.value++
    }
  }

  lastOp.value = t('Reset to initial data', '已恢复初始示例数据')
  buildLayout()
}

onMounted(() => {
  lastOp.value = t('Try insert/search/remove words in the trie', '尝试插入/搜索/移除单词')
  reset()
})
</script>

<style scoped>
.trie-svg {
  max-width: 100%;
  height: auto;
}
</style>
