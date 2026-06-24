import { describe, it, expect } from 'vitest'
import { Deque } from '../lib/deque.js'

describe('Deque', () => {
  it('should start empty', () => {
    const d = new Deque()
    expect(d.isEmpty()).toBe(true)
    expect(d.size()).toBe(0)
  })

  it('should add/remove from both ends', () => {
    const d = new Deque()
    d.addBack(10)
    d.addBack(20)
    d.addFront(5)
    expect(d.size()).toBe(3)
    expect(d.removeFront()).toBe(5)
    expect(d.removeBack()).toBe(20)
    expect(d.removeFront()).toBe(10)
    expect(d.isEmpty()).toBe(true)
  })

  it('should peek at both ends', () => {
    const d = new Deque()
    d.addBack('a')
    d.addBack('b')
    d.addFront('z')
    expect(d.peekFront()).toBe('z')
    expect(d.peekBack()).toBe('b')
  })
})
