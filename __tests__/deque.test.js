import { describe, it, expect } from 'vitest'

class Deque {
  constructor() {
    this.items = {}
    this.frontIndex = 0
    this.backIndex = 0
  }
  addFront(element) {
    if (this.isEmpty()) {
      this.addBack(element)
    } else {
      this.frontIndex--
      this.items[this.frontIndex] = element
    }
  }
  addBack(element) {
    this.items[this.backIndex] = element
    this.backIndex++
  }
  removeFront() {
    if (this.isEmpty()) return undefined
    const el = this.items[this.frontIndex]
    delete this.items[this.frontIndex]
    this.frontIndex++
    return el
  }
  removeBack() {
    if (this.isEmpty()) return undefined
    this.backIndex--
    const el = this.items[this.backIndex]
    delete this.items[this.backIndex]
    return el
  }
  peekFront() {
    return this.isEmpty() ? undefined : this.items[this.frontIndex]
  }
  peekBack() {
    return this.isEmpty() ? undefined : this.items[this.backIndex - 1]
  }
  isEmpty() {
    return this.size() === 0
  }
  size() {
    return this.backIndex - this.frontIndex
  }
}

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
