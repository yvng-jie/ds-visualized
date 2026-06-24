<template>
  <div class="visualizer">
    <div class="controls">
      <div class="input-group">
        <input v-model="inputValue" type="text" :placeholder="t('Value', '值')" class="input" @keyup.enter="append" />
        <button class="btn btn-primary" @click="append">append</button>
        <button class="btn btn-danger" @click="removeLast">
          {{ t('Remove Last', '移除末尾') }}
        </button>
      </div>
      <button class="btn btn-secondary" @click="reset">
        {{ t('Reset', '重置') }}
      </button>
    </div>
    <div class="canvas-wrapper">
      <svg :width="svgWidth" :height="svgHeight" class="linked-list-svg">
        <defs>
          <marker id="arrowNext" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
          </marker>
          <marker id="arrowPrev" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto-start-reverse">
            <polygon points="10 0, 0 3.5, 10 7" fill="#f59e0b" />
          </marker>
        </defs>

        <template v-for="(item, i) in items" :key="i">
          <!-- next arrow (bottom) -->
          <line
            v-if="i < items.length - 1"
            :x1="startX + i * (nodeW + arrowW) + nodeW"
            :y1="centerY + 8"
            :x2="startX + (i + 1) * (nodeW + arrowW)"
            :y2="centerY + 8"
            stroke="#3b82f6"
            stroke-width="2"
            marker-end="url(#arrowNext)"
          />
          <!-- prev arrow (top) -->
          <line
            v-if="i < items.length - 1"
            :x1="startX + (i + 1) * (nodeW + arrowW)"
            :y1="centerY - 8"
            :x2="startX + i * (nodeW + arrowW) + nodeW"
            :y2="centerY - 8"
            stroke="#f59e0b"
            stroke-width="2"
            marker-end="url(#arrowPrev)"
          />

          <!-- Node rect -->
          <rect
            :x="startX + i * (nodeW + arrowW)"
            :y="centerY - nodeH / 2"
            :width="nodeW"
            :height="nodeH"
            rx="8"
            :fill="i === 0 ? '#3b82f6' : i === items.length - 1 ? '#8b5cf6' : '#6366f1'"
            stroke="#4f46e5"
            stroke-width="2"
          />

          <!-- Value -->
          <text
            :x="startX + i * (nodeW + arrowW) + nodeW / 2"
            :y="centerY + 1"
            text-anchor="middle"
            dominant-baseline="middle"
            fill="white"
            font-size="16"
            font-weight="bold"
          >
            {{ item }}
          </text>

          <!-- next label -->
          <text
            v-if="i < items.length - 1"
            :x="startX + i * (nodeW + arrowW) + nodeW + arrowW / 2"
            :y="centerY + 22"
            text-anchor="middle"
            fill="#3b82f6"
            font-size="10"
          >
            next
          </text>
          <!-- prev label -->
          <text
            v-if="i < items.length - 1"
            :x="startX + i * (nodeW + arrowW) + nodeW + arrowW / 2"
            :y="centerY - 22"
            text-anchor="middle"
            fill="#f59e0b"
            font-size="10"
          >
            prev
          </text>
        </template>

        <!-- null terminator -->
        <template v-if="items.length > 0">
          <line
            :x1="startX + items.length * (nodeW + arrowW)"
            :y1="centerY + 8"
            :x2="startX + items.length * (nodeW + arrowW) + 12"
            :y2="centerY + 8"
            stroke="#3b82f6"
            stroke-width="2"
            marker-end="url(#arrowNext)"
          />
          <text
            :x="startX + items.length * (nodeW + arrowW) + 18"
            :y="centerY + 12"
            text-anchor="middle"
            dominant-baseline="middle"
            fill="#94a3b8"
            font-size="12"
          >
            null
          </text>
        </template>

        <text
          v-else
          :x="svgWidth / 2"
          :y="centerY"
          text-anchor="middle"
          dominant-baseline="middle"
          fill="#94a3b8"
          font-size="16"
        >
          {{ t('Empty list (head → null)', '空链表 (head → null)') }}
        </text>

        <!-- head marker -->
        <text
          v-if="items.length > 0"
          :x="startX + nodeW / 2"
          :y="centerY - nodeH / 2 - 16"
          text-anchor="middle"
          fill="#64748b"
          font-size="12"
          font-weight="bold"
        >
          head
        </text>
        <!-- tail marker -->
        <text
          v-if="items.length > 0"
          :x="startX + (items.length - 1) * (nodeW + arrowW) + nodeW / 2"
          :y="centerY + nodeH / 2 + 18"
          text-anchor="middle"
          fill="#64748b"
          font-size="12"
          font-weight="bold"
        >
          tail
        </text>
      </svg>
    </div>
    <div class="status-bar">
      <span>
        {{ t('Length:', '长度:') }}
        <strong>{{ items.length }}</strong>
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

const animating = false

const inputValue = ref('')
const lastOp = ref('')
const nodeW = 60
const arrowW = 50
const nodeH = 44
const centerY = 80
const startX = 40
const svgWidth = 800
const svgHeight = 180
const MAX_ITEMS = 10

const defaultData = [10, 20, 30]
const items = ref([...defaultData])

function append() {
  if (animating) return
  if (items.value.length >= MAX_ITEMS) {
    lastOp.value = t(`⚠️ List is full (max ${MAX_ITEMS} nodes)`, `⚠️ 链表已满（最多 ${MAX_ITEMS} 个节点）`)
    return
  }
  const val = inputValue.value.trim()
  if (!val) {
    lastOp.value = t('⚠️ Please enter a value to append', '⚠️ 请输入要添加的值')
    return
  }
  inputValue.value = ''
  items.value.push(val)
  lastOp.value = `✅ append(${val})`
}

function removeLast() {
  if (items.value.length === 0) {
    lastOp.value = t('⚠️ List is empty, cannot remove', '⚠️ 链表为空，无法移除')
    return
  }
  const val = items.value.pop()
  lastOp.value = `⏏️ removeLast() → ${val}`
}

function reset() {
  items.value = [...defaultData]
  lastOp.value = t('↻ Reset to initial data', '↻ 已恢复初始示例数据')
}

onMounted(() => {
  lastOp.value = t('Try appending/removing nodes', '点击 append/移除末尾 试试')
})
</script>

<style scoped>
.linked-list-svg {
  max-width: 100%;
  height: auto;
}
</style>
