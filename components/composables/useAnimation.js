/**
 * useAnimation — Unified animation composable
 *
 * Provides requestAnimationFrame-based animation loop with speed control.
 * Properly tracks setTimeout IDs for cleanup on unmount.
 */
import { ref, onUnmounted } from 'vue'

export function useAnimation(defaultSpeed = 300) {
  const animating = ref(false)
  const speed = ref(defaultSpeed)
  let rafId = null
  const timeouts = new Set()

  function sleep(ms) {
    return new Promise((resolve) => {
      const id = setTimeout(() => {
        timeouts.delete(id)
        resolve()
      }, ms)
      timeouts.add(id)
    })
  }

  async function animate(stepFn, delay) {
    animating.value = true
    const ms = delay ?? speed.value

    return new Promise((resolve) => {
      function frame() {
        stepFn()
        if (ms > 0) {
          const id = setTimeout(() => {
            timeouts.delete(id)
            animating.value = false
            resolve()
          }, ms)
          timeouts.add(id)
        } else {
          animating.value = false
          resolve()
        }
      }
      rafId = requestAnimationFrame(frame)
    })
  }

  function cancel() {
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    for (const id of timeouts) {
      clearTimeout(id)
    }
    timeouts.clear()
    animating.value = false
  }

  onUnmounted(() => {
    cancel()
  })

  return { animating, speed, sleep, animate, cancel }
}
