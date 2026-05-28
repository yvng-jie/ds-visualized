# 🌲 Trie (Prefix Tree)

> **A tree for fast string retrieval** — Like a dictionary's index tabs, finding words by their prefix

---

## 📖 Concept

### Real-Life Analogy

<div class="analogy-box">

**📖 Dictionary tabs**: A dictionary has letter tabs on the side. To find "apple", you flip to "A", then look for "AP", then "APP"... Each letter guides you to the right section.

More examples:

- **Autocomplete**: Type "app" → suggestions: "apple", "application", "appointment"
- **Spell checker**: Is this word in the dictionary?
- **IP routing**: Longest prefix matching

</div>

### Trie Structure

```
         root
        /  |  \
       c   a   p
      /    |    \
     a     p     r
    /      |      \
   t       p      e
  /         \       \
 ...         l      f
              \
               e
```

Each node = one character. A path from root to a node = a word.

### Trie vs Hash Table

| Property      | Hash Table               | Trie                            |
| ------------- | ------------------------ | ------------------------------- |
| Word lookup   | O(1) average             | O(k) — k = word length          |
| Prefix search | ❌ Not supported         | ✅ Natively supported           |
| Autocomplete  | ❌ Need to scan all keys | ✅ Efficient                    |
| Memory        | Good (sparse)            | Can be wasteful (node per char) |

---

## 💻 Code

```javascript
class TrieNode {
  constructor() {
    this.children = {} // character → TrieNode
    this.isEnd = false // marks the end of a word
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode()
  }

  // Insert a word
  insert(word) {
    let node = this.root
    for (const ch of word) {
      if (!node.children[ch]) node.children[ch] = new TrieNode()
      node = node.children[ch]
    }
    node.isEnd = true
  }

  // Check if a word exists in the trie
  search(word) {
    const node = this._find(word)
    return node !== null && node.isEnd
  }

  // Check if any word starts with the given prefix
  startsWith(prefix) {
    return this._find(prefix) !== null
  }

  // Autocomplete: get all words starting with prefix
  autocomplete(prefix) {
    const node = this._find(prefix)
    if (!node) return []
    const results = []
    this._dfs(node, prefix, results)
    return results
  }

  // Internal: find the node at the end of a string
  _find(str) {
    let node = this.root
    for (const ch of str) {
      if (!node.children[ch]) return null
      node = node.children[ch]
    }
    return node
  }

  // Internal: DFS to collect all words
  _dfs(node, path, results) {
    if (node.isEnd) results.push(path)
    for (const [ch, child] of Object.entries(node.children)) {
      this._dfs(child, path + ch, results)
    }
  }
}
```

### Key Points

1. **One character per node** — the path from root to leaf spells a word
2. **`isEnd` marker** — distinguishes "app" from "apple" (both are valid words)
3. **`autocomplete()`** — find the prefix node, then DFS all paths from there
4. **Time depends on word length, not dictionary size** — regardless of how many words are stored

---

## ⏱ Complexity

| Operation      | Time        | Notes             |
| -------------- | ----------- | ----------------- |
| `insert()`     | **O(k)** ✅ | k = word length   |
| `search()`     | **O(k)** ✅ | k = word length   |
| `startsWith()` | **O(k)** ✅ | k = prefix length |

---

## 🧪 Interview Questions

### 1. Implement Trie (LeetCode 208)

Just use the implementation above!

### 2. Word Search II

> Find all words from a dictionary that exist in a character grid.

```javascript
function findWords(board, words) {
  const trie = new Trie()
  for (const word of words) trie.insert(word)

  const result = new Set()
  const rows = board.length,
    cols = board[0].length

  function dfs(r, c, node, path) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return
    const ch = board[r][c]
    if (ch === '#' || !node.children[ch]) return

    node = node.children[ch]
    path += ch
    if (node.isEnd) result.add(path)

    board[r][c] = '#' // mark visited
    dfs(r + 1, c, node, path)
    dfs(r - 1, c, node, path)
    dfs(r, c + 1, node, path)
    dfs(r, c - 1, node, path)
    board[r][c] = ch // restore
  }

  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) dfs(r, c, trie.root, '')

  return Array.from(result)
}
```

---

## 📚 Summary

| Property      | Description                                   |
| ------------- | --------------------------------------------- |
| Core idea     | Tree of characters, sharing common prefixes   |
| Key ops       | insert, search, startsWith                    |
| Superpower    | Prefix search is O(k) and extremely efficient |
| vs Hash Table | Hash table = exact match, Trie = prefix match |
| Use cases     | Autocomplete, spell check, IP routing         |

### LeetCode Practice

| #                                                                | Problem        | Difficulty |
| ---------------------------------------------------------------- | -------------- | ---------- |
| [208](https://leetcode.com/problems/implement-trie-prefix-tree/) | Implement Trie | 🟡 Medium  |
| [212](https://leetcode.com/problems/word-search-ii/)             | Word Search II | 🔴 Hard    |

---

[⬅️ Back to Deque](/deque) · [Back to Home](/)
