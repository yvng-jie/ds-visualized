import { describe, it, expect } from 'vitest'
import { Stack } from '../lib/stack.js'

describe('Stack', () => {
  it('should start empty', () => {
    const stack = new Stack()
    expect(stack.isEmpty()).toBe(true)
    expect(stack.size()).toBe(0)
  })

  it('should push and pop elements (LIFO)', () => {
    const stack = new Stack()
    stack.push(1)
    stack.push(2)
    stack.push(3)
    expect(stack.size()).toBe(3)
    expect(stack.pop()).toBe(3)
    expect(stack.pop()).toBe(2)
    expect(stack.pop()).toBe(1)
    expect(stack.isEmpty()).toBe(true)
  })

  it('should peek at top element without removing', () => {
    const stack = new Stack()
    stack.push('a')
    stack.push('b')
    expect(stack.peek()).toBe('b')
    expect(stack.size()).toBe(2)
  })

  it('should return undefined when popping empty stack', () => {
    const stack = new Stack()
    expect(stack.pop()).toBeUndefined()
  })
})
