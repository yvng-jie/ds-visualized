#  前缀树 Trie

> **一种用于快速检索字符串的数据结构** — 像字典的索引，通过前缀就能找到所有匹配的单词

---

##  概念介绍

### 现实类比

<div class="analogy-box">

** 词典的标签页**：词典侧面的字母标签让你可以直接翻到某个字母的那一页。输入 "ca"，所有以 "ca" 开头的单词都在一起。

其他例子：

- **搜索引擎自动补全**：输入 "app" → 提示 "apple", "application"
- **拼写检查**：判断一个单词是否在词典中
- **IP 路由表**：最长前缀匹配

</div>

### Trie vs 哈希表

| 特性     | 哈希表              | Trie                |
| -------- | ------------------- | ------------------- |
| 查找单词 | O(1) 平均           | O(k) — k 是单词长度 |
| 前缀查找 |  不支持           |  天然支持         |
| 自动补全 |  需要遍历所有 key |  高效             |

---

##  实现代码

```javascript
class TrieNode {
  constructor() {
    this.children = {} // 子节点：字符 → TrieNode
    this.isEnd = false // 是否是一个单词的结尾
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode()
  }

  //  插入单词
  insert(word) {
    let node = this.root
    for (const ch of word) {
      if (!node.children[ch]) node.children[ch] = new TrieNode()
      node = node.children[ch]
    }
    node.isEnd = true
  }

  //  查找单词（是否完整存在）
  search(word) {
    const node = this._find(word)
    return node !== null && node.isEnd
  }

  //  查找前缀
  startsWith(prefix) {
    return this._find(prefix) !== null
  }

  //  自动补全
  autoComplete(prefix) {
    const node = this._find(prefix)
    if (!node) return []
    const results = []
    this._dfs(node, prefix, results)
    return results
  }

  _find(prefix) {
    let node = this.root
    for (const ch of prefix) {
      if (!node.children[ch]) return null
      node = node.children[ch]
    }
    return node
  }

  _dfs(node, path, results) {
    if (node.isEnd) results.push(path)
    for (const [ch, child] of Object.entries(node.children)) {
      this._dfs(child, path + ch, results)
    }
  }
}
```

### 代码要点

1. **每个节点只存一个字符** — 从根到叶子路径上的字符拼接就是一个单词
2. **`isEnd` 标记** — 标记是否是一个完整单词的结尾（避免 "app" 和 "apple" 冲突）
3. **`autoComplete()`** — 先找到前缀节点，然后 DFS 遍历所有后续路径
4. **时间复杂度只和单词长度有关**

---

##  复杂度分析

| 操作           | 时间复杂度  | 说明         |
| -------------- | ----------- | ------------ |
| `insert()`     | **O(k)**  | k 为单词长度 |
| `search()`     | **O(k)**  | k 为单词长度 |
| `startsWith()` | **O(k)**  | k 为前缀长度 |

---

##  常见面试题

### 1. 实现 Trie

> LeetCode 208 — 直接使用上面的实现即可。

### 2. 单词搜索 II

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

    board[r][c] = '#'
    dfs(r + 1, c, node, path)
    dfs(r - 1, c, node, path)
    dfs(r, c + 1, node, path)
    dfs(r, c - 1, node, path)
    board[r][c] = ch
  }

  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) dfs(r, c, trie.root, '')

  return Array.from(result)
}
```

---

##  总结

| 特性      | 说明                                  |
| --------- | ------------------------------------- |
| 核心思想  | 用树形结构存储字符串，共享公共前缀    |
| 关键操作  | insert / search / startsWith          |
| 优势      | 前缀查找效率极高                      |
| vs 哈希表 | 哈希表适合精确查找，Trie 适合前缀匹配 |
| 应用场景  | 自动补全、拼写检查、IP 路由           |

### LeetCode 练手题

| 题号                                                            | 题目        | 难度    |
| --------------------------------------------------------------- | ----------- | ------- |
| [208](https://leetcode.cn/problems/implement-trie-prefix-tree/) | 实现 Trie   |  中等 |
| [212](https://leetcode.cn/problems/word-search-ii/)             | 单词搜索 II |  困难 |
| [648](https://leetcode.cn/problems/replace-words/)              | 单词替换    |  中等 |

---

[ 返回双端队列](/deque) · [返回首页](/)
