/**
 * useI18n — Unified internationalization composable
 *
 * Provides a consistent way to handle EN/ZH text across all Visualizer components.
 */
import { computed } from 'vue'
import { useRoute } from 'vitepress'

export function useI18n() {
  const route = useRoute()
  const isZh = computed(() => route.path.startsWith('/zh/'))

  function t(en, zh) {
    return isZh.value ? zh : en
  }

  function err(en, zh) {
    return isZh.value ? `${zh}` : `${en}`
  }

  function ok(en, zh) {
    return isZh.value ? `${zh}` : `${en}`
  }

  return { isZh, t, err, ok }
}
