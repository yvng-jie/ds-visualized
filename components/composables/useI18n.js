/**
 * useI18n — Unified internationalization composable
 *
 * Provides a consistent way to handle EN/ZH text across all Visualizer components.
 * Usage:
 *   const { t, isZh } = useI18n()
 *   t('Enter value', '输入值')       → returns 'Enter value' or '输入值'
 *   t.err('Stack is empty', '栈为空') → returns '⚠️ Stack is empty' or '⚠️ 栈为空'
 */
import { computed } from 'vue'
import { useRoute } from 'vitepress'

export function useI18n() {
  const route = useRoute()
  const isZh = computed(() => route.path.startsWith('/zh/'))

  /**
   * Translate: returns English or Chinese text based on current route
   */
  function t(en, zh) {
    return isZh.value ? zh : en
  }

  /**
   * Translate with error/warning prefix
   */
  function err(en, zh) {
    return isZh.value ? `⚠️ ${zh}` : `⚠️ ${en}`
  }

  /**
   * Translate with success prefix
   */
  function ok(en, zh) {
    return isZh.value ? `✅ ${zh}` : `✅ ${en}`
  }

  return { isZh, t, err, ok }
}
