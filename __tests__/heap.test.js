import { describe, it, expect } from 'vitest'
import { MinHeap } from '../lib/heap.js'

describe('MinHeap', () => {
  it('should start empty', () => {
    const h = new MinHeap()
    expect(h.isEmpty()).toBe(true)
  })

  it('should maintain min-heap property', () => {
    const h = new MinHeap()
    h.insert(5)
    h.insert(3)
    h.insert(8)
    h.insert(1)
    h.insert(2)
    expect(h.peek()).toBe(1)
    expect(h.extract()).toBe(1)
    expect(h.extract()).toBe(2)
    expect(h.extract()).toBe(3)
    expect(h.extract()).toBe(5)
    expect(h.extract()).toBe(8)
    expect(h.isEmpty()).toBe(true)
  })

  it('should handle duplicates', () => {
    const h = new MinHeap()
    h.insert(3)
    h.insert(1)
    h.insert(1)
    h.insert(2)
    expect(h.extract()).toBe(1)
    expect(h.extract()).toBe(1)
    expect(h.extract()).toBe(2)
    expect(h.extract()).toBe(3)
  })
})
