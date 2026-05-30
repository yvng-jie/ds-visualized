import { describe, it, expect } from 'vitest'

class TrieNode {
  constructor() {
    this.children = {}
    this.isEndOfWord = false
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode()
    this._wordCount = 0
  }

  insert(word) {
    let node = this.root
    for (const char of word) {
      if (!node.children[char]) node.children[char] = new TrieNode()
      node = node.children[char]
    }
    if (!node.isEndOfWord) {
      node.isEndOfWord = true
      this._wordCount++
    }
  }

  search(word) {
    const node = this._findNode(word)
    return node !== null && node.isEndOfWord
  }

  startsWith(prefix) {
    return this._findNode(prefix) !== null
  }

  _findNode(prefix) {
    let node = this.root
    for (const char of prefix) {
      if (!node.children[char]) return null
      node = node.children[char]
    }
    return node
  }

  isEmpty() {
    return this._wordCount === 0
  }
  size() {
    return this._wordCount
  }
}

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
