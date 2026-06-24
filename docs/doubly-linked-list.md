#  Doubly Linked List

> **Each node points to both the next node and the previous one** — Like a two-way street

---

##  Concept

### Real-Life Analogy

<div class="analogy-box">

** Music playlist**: You can skip to the next song OR go back to the previous one. Each song knows what comes before and after it.

More examples:

- **Subway line**: Trains run in both directions
- **Browser forward/back**: Knows both the next and previous pages
- **LRU Cache**: Uses a doubly linked list + hash map to track recently used items

</div>

### Singly vs Doubly

| Property       | Singly Linked      | Doubly Linked               |
| -------------- | ------------------ | --------------------------- |
| Pointers       | Only `next`        | `next` + `prev`             |
| Traversal      | Head to tail only  | Both directions             |
| Memory         | Less               | More (extra `prev` pointer) |
| Delete node    | Need previous node | Direct access               |
| Reverse output | Not supported      | Yes (`backwardString`)      |

---

##  Code

```javascript
class Node {
  constructor(element) {
    this.element = element
    this.prev = null
    this.next = null
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null
    this.tail = null
    this.length = 0
  }

  // Add to the end
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

  // Insert at position
  insert(position, element) {
    if (position < 0 || position > this.length) return false
    const node = new Node(element)

    if (this.length === 0) {
      this.head = node
      this.tail = node
    } else if (position === 0) {
      node.next = this.head
      this.head.prev = node
      this.head = node
    } else if (position === this.length) {
      node.prev = this.tail
      this.tail.next = node
      this.tail = node
    } else {
      let current = this._getNode(position)
      node.prev = current.prev
      node.next = current
      current.prev.next = node
      current.prev = node
    }
    this.length++
    return true
  }

  // Remove at position
  removeAt(position) {
    if (position < 0 || position >= this.length) return null
    let current
    if (this.length === 1) {
      current = this.head
      this.head = null
      this.tail = null
    } else if (position === 0) {
      current = this.head
      this.head = current.next
      this.head.prev = null
    } else if (position === this.length - 1) {
      current = this.tail
      this.tail = current.prev
      this.tail.next = null
    } else {
      current = this._getNode(position)
      current.prev.next = current.next
      current.next.prev = current.prev
    }
    this.length--
    return current.element
  }

  //  Smart traversal: walk from head or tail, whichever is closer
  _getNode(position) {
    if (position < 0 || position >= this.length) return null
    if (position < this.length / 2) {
      let current = this.head
      let index = 0
      while (index < position) {
        current = current.next
        index++
      }
      return current
    } else {
      let current = this.tail
      let index = this.length - 1
      while (index > position) {
        current = current.prev
        index--
      }
      return current
    }
  }

  get(position) {
    const node = this._getNode(position)
    return node ? node.element : null
  }

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

  isEmpty() {
    return this.length === 0
  }
  size() {
    return this.length
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

  // Walk backward from tail! This is the superpower of doubly linked lists.
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

### Key Points

1. **`tail` pointer** — makes `append()` O(1) instead of O(n)
2. **`_getNode()` is smart** — checks if the position is closer to head or tail, cutting average time in half
3. **Deletion is simpler** — with `prev` pointers, you don't need to track the previous node separately
4. **`backwardString()`** — only possible with a doubly linked list!

---

##  Complexity

| Operation    | Singly | Doubly        | Notes                               |
| ------------ | ------ | ------------- | ----------------------------------- |
| `append()`   | O(n)   | **O(1) **   | Tail pointer                        |
| `removeAt()` | O(n)   | O(n)          | But pointer manipulation is cleaner |
| `get()`      | O(n)   | **O(n/2) ** | Smart traversal                     |

---

##  Interview Questions

### 1. LRU Cache (Core Logic)

> The LRU Cache combines a HashMap (for O(1) lookup) with a Doubly Linked List (for O(1) reordering).

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
      if (this.map.size > this.capacity) this._removeTail()
    }
  }
  // ... (pointer manipulation omitted for brevity)
}
```

---

##  Summary

| Property         | Description                                      |
| ---------------- | ------------------------------------------------ |
| vs Singly Linked | Extra `prev` pointer + `tail` reference          |
| Superpower       | Reverse traversal, O(1) tail operations          |
| Trade-off        | More memory per node (extra pointer)             |
| Use cases        | LRU Cache, music player, browser history         |
| Next             |  [Dictionary — Key-Value Storage](/dictionary) |

### LeetCode Practice

| #                                                                             | Problem                | Difficulty |
| ----------------------------------------------------------------------------- | ---------------------- | ---------- |
| [146](https://leetcode.com/problems/lru-cache/)                               | LRU Cache              |  Medium  |
| [430](https://leetcode.com/problems/flatten-a-multilevel-doubly-linked-list/) | Flatten Multilevel DLL |  Medium  |

---

[ Back to Linked List](/linked-list) · [Back to Home](/)
