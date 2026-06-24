<template>
  <div class="visualizer">
    <div class="controls">
      <div class="input-group">
        <input v-model="inputValue" type="text" :placeholder="t('Value', '值')" class="input" @keyup.enter="append" />
        <input
          v-model.number="positionValue"
          type="number"
          min="0"
          :placeholder="t('Pos', '位置')"
          class="input pos-input"
        />
        <button class="btn btn-primary" @click="append">append</button>
        <button class="btn btn-primary" @click="insert">insert</button>
        <button class="btn btn-danger" @click="removeAt">
          {{ t('removeAt', '移除位置') }}
        </button>
        <button class="btn btn-secondary" @click="get">get</button>
        <button class="btn btn-secondary" @click="indexOf">indexOf</button>
      </div>
      <button class="btn btn-secondary" @click="reset">
        {{ t('Reset', '重置') }}
      </button>
    </div>
    <div class="canvas-wrapper">
      <svg :width="svgWidth" :height="svgHeight" class="linked-list-svg">
        <!-- Arrows and nodes -->
        <template v-for="(item, i) in items" :key="i">
          <!-- Arrow -->
          <line
            v-if="i < items.length - 1"
            :x1="startX + i * (nodeW + arrowW)"
            :y1="centerY"
            :x2="startX + (i + 1) * (nodeW + arrowW) - arrowW"
            :y2="centerY"
            stroke="#94a3b8"
            stroke-width="2"
            marker-end="url(#arrowhead)"
          />

          <!-- Node rect -->
          <rect
            :x="startX + i * (nodeW + arrowW)"
            :y="centerY - nodeH / 2"
            :width="nodeW"
            :height="nodeH"
            rx="8"
            :fill="i === items.length - 1 ? '#3b82f6' : '#6366f1'"
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
        </template>

        <!-- null terminator -->
        <template v-if="items.length > 0">
          <line
            :x1="startX + items.length * (nodeW + arrowW) - arrowW"
            :y1="centerY"
            :x2="startX + items.length * (nodeW + arrowW)"
            :y2="centerY"
            stroke="#94a3b8"
            stroke-width="2"
            marker-end="url(#arrowhead)"
          />
          <text
            :x="startX + items.length * (nodeW + arrowW) + 12"
            :y="centerY + 1"
            text-anchor="middle"
            dominant-baseline="middle"
            fill="#94a3b8"
            font-size="13"
            font-weight="500"
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
          {{ isZh ? '空链表 (head null)' : 'Empty list (head null)' }}
        </text>

        <!-- Head marker -->
        <text
          v-if="items.length > 0"
          :x="startX + nodeW / 2"
          :y="centerY - nodeH / 2 - 12"
          text-anchor="middle"
          fill="#64748b"
          font-size="12"
        >
          head
        </text>

        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
          </marker>
        </defs>
      </svg>
    </div>
    <div class="status-bar">
      <span>
        {{ isZh ? '长度:' : 'Length:' }}
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
const positionValue = ref(0)
const lastOp = ref('')
const nodeW = 60
const arrowW = 40
const nodeH = 44
const centerY = 70
const startX = 40
const svgWidth = 800
const svgHeight = 140
const MAX_ITEMS = 12

const defaultData = [10, 20, 30]
const items = ref([...defaultData])

function append() {
  if (animating) return
  if (items.value.length >= MAX_ITEMS) {
    lastOp.value = t( `List is full (max ${MAX_ITEMS} nodes)`, `链表已满（最多 ${MAX_ITEMS} 个节点）`)
    return
  }
  const val = inputValue.value.trim()
  if (!val) {
    lastOp.value = t('Please enter a value to append', '请输入要添加的值')
    return
  }
  inputValue.value = ''
  items.value.push(val)
  lastOp.value = ` append(${val})`
}

function insert() {
  if (animating) return
  const val = inputValue.value.trim()
  const pos = positionValue.value

  if (!val) {
    lastOp.value = t('Please enter a value', '请输入要添加的值')
    return
  }
  if (pos < 0 || pos > items.value.length) {
    lastOp.value = t(`Position out of range (0-${items.value.length})`, `位置超出范围 (0-${items.value.length})`)
    return
  }
  if (items.value.length >= MAX_ITEMS) {
    lastOp.value = t( `List is full (max ${MAX_ITEMS} nodes)`, `链表已满（最多 ${MAX_ITEMS} 个节点）`)
    return
  }

  inputValue.value = ''
  items.value.splice(pos, 0, val)
  lastOp.value = ` insert(${val}, pos=${pos})`
}

function get() {
  const pos = positionValue.value
  if (pos < 0 || pos >= items.value.length) {
    lastOp.value = t(
      `Position out of range (0-${items.value.length - 1})`,
      `位置超出范围 (0-${items.value.length - 1})`,
    )
    return
  }
  lastOp.value = `get(${pos}) ${items.value[pos]}`
}

function indexOf() {
  const val = inputValue.value.trim()
  if (!val) {
    lastOp.value = t('Enter value to search', '请输入要搜索的值')
    return
  }
  const idx = items.value.indexOf(val)
  if (idx === -1) {
    lastOp.value = t(`${val} not found (-1)`, `${val} 未找到 (-1)`)
  } else {
    lastOp.value = `${val} index ${idx}`
  }
}

function removeAt() {
  const pos = positionValue.value
  if (pos < 0 || pos >= items.value.length) {
    lastOp.value = t(
      `Position out of range (0-${items.value.length - 1})`,
      `位置超出范围 (0-${items.value.length - 1})`,
    )
    return
  }
  const val = items.value.splice(pos, 1)[0]
  lastOp.value = `removeAt(${pos}) ${val}`
}

function reset() {
  items.value = [...defaultData]
  lastOp.value = t('Reset to initial data', '已恢复初始示例数据')
}

onMounted(() => {
  lastOp.value = t('Try append/insert/removeAt/get/indexOf operations', '尝试 append/insert/removeAt/get/indexOf 操作')
})
</script>

<style scoped>
.pos-input {
  width: 65px !important;
}
.linked-list-svg {
  min-width: 400px;
}
</style>
