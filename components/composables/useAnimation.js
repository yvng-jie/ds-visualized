/**
 * useAnimation — Unified animation composable
 *
 * Provides requestAnimationFrame-based animation loop with speed control.
 * Usage:
 *   const { animating, speed, animate, sleep } = useAnimation()
 *   await animate(() => { ... }, 300)   // animate with 300ms step delay
 *   await sleep(300)                     // simple delay
 */
import { ref } from 'vue'

export function useAnimation(defaultSpeed = 300) {
  const animating = ref(false)
  const speed = ref(defaultSpeed)
  let rafId = null

  /**
   * Simple promise-based sleep
   */
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * Animate a step with optional delay, uses RAF for smooth rendering
   */
  async function animate(stepFn, delay) {
    animating.value = true
    const ms = delay ?? speed.value

    return new Promise((resolve) => {
      function frame() {
        stepFn()
        if (ms > 0) {
          setTimeout(() => {
            animating.value = false
            resolve()
          }, ms)
        } else {
          animating.value = false
          resolve()
        }
      }
      rafId = requestAnimationFrame(frame)
    })
  }

  /**
   * Cancel any running animation
   */
  function cancel() {
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    animating.value = false
  }

  return {
    animating,
    speed,
    sleep,
    animate,
    cancel,
  }
}
