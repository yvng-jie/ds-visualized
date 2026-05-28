<template>
  <div class="visualizer">
    <div class="controls">
      <div class="input-group">
        <input
          v-model="inputValue"
          type="text"
          :placeholder="isZh ? '值' : 'Value'"
          class="input"
          @keyup.enter="append"
        />
        <button
          class="btn btn-primary"
          @click="append"
        >
          append
        </button>
        <button
          class="btn btn-danger"
          @click="removeLast"
        >
          {{ isZh ? '移除末尾' : 'Remove Last' }}
        </button>
      </div>
      <button
        class="btn btn-secondary"
        @click="reset"
      >
        {{ isZh ? '重置' : 'Reset' }}
      </button>
    </div>
    <div class="canvas-wrapper">
      <svg
        :width="svgWidth"
        :height="svgHeight"
        class="linked-list-svg"
      >
        <!-- 箭头和节点 -->
        <template
          v-for="(item, i) in items"
          :key="i"
        >
          <!-- 箭头 -->
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

          <!-- 节点矩形 -->
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

          <!-- 值 -->
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

        <!-- null 结束标志 -->
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
          {{ isZh ? '空链表 (head → null)' : 'Empty list (head → null)' }}
        </text>

        <!-- head 标记 -->
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
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="10"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="#94a3b8"
            />
          </marker>
        </defs>
      </svg>
    </div>
    <div class="status-bar">
      <span>
        {{ isZh ? '长度:' : 'Length:' }}
        <strong>{{ items.length }}</strong>
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
  import { ref, computed, onMounted } from 'vue'
  import { useRoute } from 'vitepress'

  const route = useRoute()
  const isZh = computed(() => route.path.startsWith('/zh/'))

  const inputValue = ref('')
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
    if (items.value.length >= MAX_ITEMS) {
      lastOp.value = isZh.value
        ? '⚠️ 链表已满（最多 ' + MAX_ITEMS + ' 个节点）'
        : '⚠️ List is full (max ' + MAX_ITEMS + ' nodes)'
      return
    }
    const val = inputValue.value.trim()
    if (!val) {
      lastOp.value = isZh.value ? '⚠️ 请输入要添加的值' : '⚠️ Please enter a value to append'
      return
    }
    inputValue.value = ''
    items.value.push(val)
    lastOp.value = `✅ append(${val})`
  }

  onMounted(() => {
    lastOp.value = isZh.value ? '点击 append/移除末尾 试试' : 'Try clicking append/remove last'
  })

  function removeLast() {
    if (items.value.length === 0) {
      lastOp.value = isZh.value ? '⚠️ 链表为空，无法移除' : '⚠️ List is empty, cannot remove'
      return
    }
    const val = items.value.pop()
    lastOp.value = isZh.value ? `🗑️ 移除 → ${val}` : `🗑️ Remove → ${val}`
  }

  function reset() {
    items.value = [...defaultData]
    lastOp.value = isZh.value ? '↻ 已恢复初始示例数据' : '↻ Reset to initial data'
  }
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
    background: #6366f1;
    color: white;
  }
  .btn-primary:hover {
    background: #4f46e5;
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
    overflow-x: auto;
    min-height: 140px;
  }
  .linked-list-svg {
    min-width: 400px;
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
