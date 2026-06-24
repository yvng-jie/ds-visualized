class TrieNode {
  constructor() {
    this.children = {}
    this.isEndOfWord = false
  }
}

export class Trie {
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
