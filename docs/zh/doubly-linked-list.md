# 🔗 双向链表 DoublyLinkedList

> **每个节点既指向下一个节点，也指向上一个节点** — 就像双向车道，前后都能走

---

## 📖 概念介绍

### 现实类比

<div class="analogy-box">

**🎵 音乐播放列表**：播放器可以"下一首"也可以"上一首"。每首歌都知道自己前面和后面是哪首歌。

其他例子：

- **地铁线路**：双向运行，可以正向也可以反向
- **浏览器的前进/后退**：知道上一个和下一个页面
- **LRU 缓存**：用双向链表 + 哈希表实现最近最少使用淘汰

</div>

### 单向 vs 双向

| 特性     | 单向链表           | 双向链表                   |
| -------- | ------------------ | -------------------------- |
| 指针     | 只有 `next`        | `next` + `prev`            |
| 遍历方向 | 只能从头到尾       | 可以前向/后向              |
| 内存     | 较少               | 较多（多一个 `prev` 指针） |
| 删除节点 | 需要知道前一个节点 | 无需遍历，直接操作         |
| 反向输出 | 不支持             | 支持（`backwardString`）   |

---

## 💻 实现代码

```javascript
class Node {
  constructor(element) {
    this.element = element
    this.prev = null // 指向前一个节点
    this.next = null // 指向后一个节点
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null
    this.tail = null // 尾节点（双向链表特有的优化）
    this.length = 0
  }

  // 🔗 在末尾追加
  append(element) {
    const node = new Node(element)

    if (this.length === 0) {
      this.head = node
      this.tail = node
    } else {
      node.prev = this.tail
      this.tail.next = node
      this.tail = node
    }

    this.length++
  }

  // 🔗 在指定位置插入
  insert(position, element) {
    if (position < 0 || position > this.length) return false

    const node = new Node(element)

    if (this.length === 0) {
      // 空链表
      this.head = node
      this.tail = node
    } else if (position === 0) {
      // 插入到头部
      node.next = this.head
      this.head.prev = node
      this.head = node
    } else if (position === this.length) {
      // 插入到尾部
      node.prev = this.tail
      this.tail.next = node
      this.tail = node
    } else {
      // 插入到中间
      let current = this._getNode(position)
      node.prev = current.prev
      node.next = current
      current.prev.next = node
      current.prev = node
    }

    this.length++
    return true
  }

  // 🔗 移除指定位置的节点
  removeAt(position) {
    if (position < 0 || position >= this.length) return null

    let current

    if (this.length === 1) {
      // 只有一个节点
      current = this.head
      this.head = null
      this.tail = null
    } else if (position === 0) {
      // 移除头节点
      current = this.head
      this.head = current.next
      this.head.prev = null
    } else if (position === this.length - 1) {
      // 移除尾节点
      current = this.tail
      this.tail = current.prev
      this.tail.next = null
    } else {
      // 移除中间节点
      current = this._getNode(position)
      current.prev.next = current.next
      current.next.prev = current.prev
    }

    this.length--
    return current.element
  }

  // 🔍 获取指定位置的节点（内部方法）
  _getNode(position) {
    if (position < 0 || position >= this.length) return null

    // 🎯 优化：判断从头还是从尾遍历更快
    if (position < this.length / 2) {
      // 从头开始遍历
      let current = this.head
      let index = 0
      while (index < position) {
        current = current.next
        index++
      }
      return current
    } else {
      // 从尾开始遍历
      let current = this.tail
      let index = this.length - 1
      while (index > position) {
        current = current.prev
        index--
      }
      return current
    }
  }

  // 🔍 获取指定位置的元素
  get(position) {
    const node = this._getNode(position)
    return node ? node.element : null
  }

  // 🔍 查找元素的位置
  indexOf(element) {
    let current = this.head
    let index = 0

    while (current) {
      if (current.element === element) return index
      current = current.next
      index++
    }

    return -1
  }

  // 🔄 更新指定位置的元素
  update(position, element) {
    const node = this._getNode(position)
    if (!node) return false
    node.element = element
    return true
  }

  // ❓ 链表是空的吗？
  isEmpty() {
    return this.length === 0
  }
  size() {
    return this.length
  }

  // 📝 正向输出（head → tail）
  toString() {
    return this.forwardString()
  }
  forwardString() {
    let current = this.head
    let result = ''
    while (current) {
      result += current.element + ' '
      current = current.next
    }
    return result.trim()
  }

  // 📝 反向输出（tail → head）
  backwardString() {
    let current = this.tail
    let result = ''
    while (current) {
      result += current.element + ' '
      current = current.prev
    }
    return result.trim()
  }
}
```

### 代码要点

1. **`tail` 尾指针** — 双向链表特有的优化，`append()` 直接 O(1)
2. **`_getNode()` 的智能遍历** — 根据位置判断从头还是从尾遍历，平均时间复杂度从 O(n) 降到 O(n/2)
3. **删除操作** — 直接修改前后节点的 `prev`/`next`，不需要像单向链表那样记录前一个节点
4. **`backwardString()`** — 反向输出，单向链表做不到

---

## ⏱ 复杂度分析

| 操作         | 单向链表 | 双向链表      | 说明         |
| ------------ | -------- | ------------- | ------------ |
| `append()`   | O(n)     | **O(1) ✅**   | 有 tail 指针 |
| `insert()`   | O(n)     | O(n)          | 遍历查找位置 |
| `removeAt()` | O(n)     | O(n)          | 遍历查找位置 |
| `get()`      | O(n)     | **O(n/2) ✅** | 智能遍历优化 |
| `indexOf()`  | O(n)     | O(n)          |              |

---

## 🧪 常见面试题

### 1. 在双向链表中实现 LRU 缓存的核心操作

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity
    this.map = new Map()
    this.head = null
    this.tail = null
  }

  get(key) {
    if (!this.map.has(key)) return -1
    const node = this.map.get(key)
    this._moveToHead(node)
    return node.value
  }

  put(key, value) {
    if (this.map.has(key)) {
      const node = this.map.get(key)
      node.value = value
      this._moveToHead(node)
    } else {
      const node = { key, value, prev: null, next: null }
      this.map.set(key, node)
      this._addToHead(node)
      if (this.map.size > this.capacity) {
        this._removeTail()
      }
    }
  }

  _addToHead(node) {
    /* ... */
  }
  _moveToHead(node) {
    /* ... */
  }
  _removeTail(node) {
    /* ... */
  }
}
```

---

## 📚 总结

| 特性           | 说明                                |
| -------------- | ----------------------------------- |
| 与单向链表区别 | 多了 `prev` 指针和 `tail` 尾指针    |
| 核心优势       | 反向遍历、尾部操作 O(1)             |
| 内存消耗       | 比单向链表多一个 `prev` 指针        |
| 典型应用       | LRU 缓存、音乐播放列表、浏览器历史  |
| 下一步学习     | 👉 [字典 — 键值对存储](/dictionary) |

---

### LeetCode 练手题

| 题号 | 题目 | 难度 |
| --- | --- | --- |
| [146](https://leetcode.cn/problems/lru-cache/) | LRU 缓存 | 🟡 中等 |
| [430](https://leetcode.cn/problems/flatten-a-multilevel-doubly-linked-list/) | 扁平化多级双向链表 | 🟡 中等 |
| [426](https://leetcode.cn/problems/convert-binary-search-tree-to-sorted-doubly-linked-list/) | 将二叉搜索树转化为排序的双向链表 | 🟡 中等 |

[⬅️ 返回单向链表](/linked-list) · [返回首页](/)
