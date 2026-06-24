import { describe, it, expect } from 'vitest'
import { Queue } from '../lib/queue.js'

describe('Queue', () => {
  it('should start empty', () => {
    const q = new Queue()
    expect(q.isEmpty()).toBe(true)
  })

  it('should enqueue and dequeue (FIFO)', () => {
    const q = new Queue()
    q.enqueue(1)
    q.enqueue(2)
    q.enqueue(3)
    expect(q.dequeue()).toBe(1)
    expect(q.dequeue()).toBe(2)
    expect(q.dequeue()).toBe(3)
    expect(q.isEmpty()).toBe(true)
  })

  it('should peek at front element', () => {
    const q = new Queue()
    q.enqueue('a')
    q.enqueue('b')
    expect(q.front()).toBe('a')
    expect(q.size()).toBe(2)
  })
})
