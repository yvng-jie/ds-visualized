<template>
  <div class="code-playground">
    <div class="playground-header">
      <span class="playground-title">🎮 在线 Playground</span>
      <div class="playground-actions">
        <button
          class="btn btn-run"
          @click="runCode"
        >
          ▶ 运行
        </button>
        <button
          class="btn btn-reset"
          @click="resetCode"
        >
          ↻ 重置
        </button>
        <button
          class="btn btn-copy"
          @click="copyCode"
        >
          📋 复制
        </button>
      </div>
    </div>
    <div class="playground-body">
      <div class="editor-panel">
        <textarea
          ref="editor"
          class="code-editor"
          v-model="code"
          spellcheck="false"
          :rows="20"
        ></textarea>
      </div>
      <div class="output-panel">
        <div class="output-header">输出</div>
        <pre
          class="output-content"
          ref="output"
          >{{ output || '点击 ▶ 运行 查看结果' }}</pre
        >
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue'

  const props = defineProps({
    initialCode: {
      type: String,
      default: '',
    },
    testCode: {
      type: String,
      default: '',
    },
  })

  const code = ref(props.initialCode + (props.testCode ? '\n\n// --- 测试代码 ---\n' + props.testCode : ''))
  const output = ref('')
  const editor = ref(null)
  const outputEl = ref(null)

  function runCode() {
    const logs = []
    const originalLog = console.log
    const originalError = console.error

    console.log = (...args) => {
      logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' '))
    }
    console.error = (...args) => {
      logs.push('❌ ' + args.join(' '))
    }

    try {
      const fn = new Function(code.value)
      fn()
    } catch (e) {
      logs.push('❌ 错误: ' + e.message)
    }

    console.log = originalLog
    console.error = originalError

    output.value = logs.join('\n')
  }

  function resetCode() {
    code.value = props.initialCode + (props.testCode ? '\n\n// --- 测试代码 ---\n' + props.testCode : '')
    output.value = ''
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code.value)
      alert('已复制到剪贴板！')
    } catch {
      // fallback
      const ta = document.createElement('textarea')
      ta.value = code.value
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
  }
</script>

<style scoped>
  .code-playground {
    border: 1px solid var(--vp-c-divider);
    border-radius: 12px;
    overflow: hidden;
    margin: 24px 0;
  }

  .playground-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: var(--vp-c-bg-soft);
    border-bottom: 1px solid var(--vp-c-divider);
  }

  .playground-title {
    font-weight: 600;
    font-size: 14px;
  }

  .playground-actions {
    display: flex;
    gap: 8px;
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

  .btn-run {
    background: #22c55e;
    color: white;
    border-color: #22c55e;
  }
  .btn-run:hover {
    background: #16a34a;
  }

  .btn-reset:hover {
    background: var(--vp-c-bg-soft);
  }
  .btn-copy:hover {
    background: var(--vp-c-bg-soft);
  }

  .playground-body {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .editor-panel {
    border-right: 1px solid var(--vp-c-divider);
  }

  .code-editor {
    width: 100%;
    min-height: 400px;
    padding: 16px;
    font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
    font-size: 13px;
    line-height: 1.6;
    border: none;
    outline: none;
    resize: vertical;
    background: #1e1e1e;
    color: #d4d4d4;
    tab-size: 2;
  }

  .output-panel {
    background: var(--vp-c-bg);
  }

  .output-header {
    padding: 10px 16px;
    font-size: 12px;
    font-weight: 600;
    color: var(--vp-c-text-2);
    border-bottom: 1px solid var(--vp-c-divider);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .output-content {
    padding: 16px;
    margin: 0;
    font-family: 'JetBrains Mono', 'Consolas', monospace;
    font-size: 13px;
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-all;
    color: var(--vp-c-text);
    min-height: 368px;
    max-height: 500px;
    overflow: auto;
  }

  @media (max-width: 768px) {
    .playground-body {
      grid-template-columns: 1fr;
    }
    .editor-panel {
      border-right: none;
      border-bottom: 1px solid var(--vp-c-divider);
    }
  }
</style>
