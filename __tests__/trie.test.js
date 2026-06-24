import { describe, it, expect } from 'vitest'
import { Trie } from '../lib/trie.js'

describe('Trie', () => {
  it('should start empty', () => {
    const trie = new Trie()
    expect(trie.isEmpty()).toBe(true)
    expect(trie.size()).toBe(0)
  })

  it('should insert and search words', () => {
    const trie = new Trie()
    trie.insert('apple')
    trie.insert('app')
    trie.insert('banana')
    expect(trie.search('apple')).toBe(true)
    expect(trie.search('app')).toBe(true)
    expect(trie.search('apt')).toBe(false)
    expect(trie.search('banana')).toBe(true)
  })

  it('should check prefixes', () => {
    const trie = new Trie()
    trie.insert('apple')
    trie.insert('application')
    expect(trie.startsWith('app')).toBe(true)
    expect(trie.startsWith('appl')).toBe(true)
    expect(trie.startsWith('ban')).toBe(false)
    expect(trie.startsWith('xyz')).toBe(false)
  })

  it('should track word count', () => {
    const trie = new Trie()
    expect(trie.size()).toBe(0)
    trie.insert('cat')
    trie.insert('car')
    trie.insert('cat') // duplicate
    expect(trie.size()).toBe(2)
  })
})
