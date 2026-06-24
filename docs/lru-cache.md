#  LRU Cache

> **Evicts the least recently used item when full** — Like a desk where you push old papers aside for new ones

---

##  Concept

### Real-Life Analogy

<div class="analogy-box">

** Desk workspace**: You have room for 3 books on your desk. When you need a new book, you pull it from the shelf (slow) and put it on your desk. If your desk is full, you remove the book you haven't touched in the longest time.

More examples:

- **Browser cache**: Stores recently visited pages
- **Database query cache**: Caches frequent query results
- **CDN**: Caches frequently accessed files

</div>

### LRU Cache = HashMap + Doubly Linked List

```
         HashMap (O(1) lookup)
         
          key → Node*      
         
                
                
  Head  [3:C] ⇄ [2:B] ⇄ [1:A]  Tail
  (MRU)                          (LRU)
```

| Operation           | How                                                                   | Time |
| ------------------- | --------------------------------------------------------------------- | :--: |
| **get(key)**        | Look up in HashMap, move node to head                                 | O(1) |
| **put(key, value)** | If exists: update + move to head. If full: evict tail, insert at head | O(1) |

---

##  Code

```javascript
class ListNode {
  constructor(key, value) {
    this.key = key
    this.value = value
    this.prev = null
    this.next = null
  }
}

class LRUCache {
  constructor(capacity = 5) {
    this.capacity = capacity
    this.cache = new Map()
    this.head = new ListNode(0, 0) // Dummy head
    this.tail = new ListNode(0, 0) // Dummy tail
    this.head.next = this.tail
    this.tail.prev = this.head
  }

  _remove(node) {
    node.prev.next = node.next
    node.next.prev = node.prev
  }

  _addToHead(node) {
    node.next = this.head.next
    node.prev = this.head
    this.head.next.prev = node
    this.head.next = node
  }

  get(key) {
    if (!this.cache.has(key)) return -1
    const node = this.cache.get(key)
    this._remove(node)
    this._addToHead(node)
    return node.value
  }

  put(key, value) {
    if (this.cache.has(key)) {
      const node = this.cache.get(key)
      node.value = value
      this._remove(node)
      this._addToHead(node)
      return
    }

    if (this.cache.size >= this.capacity) {
      const lru = this.tail.prev
      this._remove(lru)
      this.cache.delete(lru.key)
    }

    const newNode = new ListNode(key, value)
    this.cache.set(key, newNode)
    this._addToHead(newNode)
  }

  size() {
    return this.cache.size
  }
}
```

---

##  Complexity

| Operation | Time |
| --------- | :--: |
| get       | O(1) |
| put       | O(1) |

> **Space**: O(capacity) for the linked list + O(capacity) for the hash map.

---

##  Interview Questions

### 1. LRU Cache (LeetCode 146)

> Implement an LRU Cache with O(1) get and put.

<CodePlayground :initialCode="`class LRUCache {\n  constructor(cap) {\n    this.cap = cap\n    this.map = new Map()\n    this.head = {}\n    this.tail = {}\n    this.head.next = this.tail\n    this.tail.prev = this.head\n  }\n\n  _remove(node) {\n    node.prev.next = node.next\n    node.next.prev = node.prev\n  }\n\n  _addToHead(node) {\n    node.next = this.head.next\n    node.prev = this.head\n    this.head.next.prev = node\n    this.head.next = node\n  }\n\n  get(key) {\n    if (!this.map.has(key)) return -1\n    const node = this.map.get(key)\n    this._remove(node)\n    this._addToHead(node)\n    return node.value\n  }\n\n  put(key, value) {\n    if (this.map.has(key)) {\n      const node = this.map.get(key)\n      node.value = value\n      this._remove(node)\n      this._addToHead(node)\n      return\n    }\n    if (this.map.size >= this.cap) {\n      const lru = this.tail.prev\n      this._remove(lru)\n      this.map.delete(lru.key)\n    }\n    const node = { key, value }\n    this.map.set(key, node)\n    this._addToHead(node)\n  }\n}`" :testCode="`const cache = new LRUCache(3)\ncache.put(1, 'A')\ncache.put(2, 'B')\ncache.put(3, 'C')\ncache.get(1)\ncache.put(4, 'D')  // Evicts 2\nconsole.log(cache.get(2))  // -1 (evicted)\nconsole.log(cache.get(1))  // 'A'\nconsole.log(cache.get(3))  // 'C'\nconsole.log(cache.get(4))  // 'D'`" />

---

##  Common Pitfalls

| Mistake                                 | Why                            |
| --------------------------------------- | ------------------------------ |
| Not using dummy head/tail               | Makes edge case handling messy |
| Forgetting to update both prev and next | Breaks the linked list         |
| Not deleting from Map on eviction       | Memory leak + stale data       |

---

##  Decision Guide

| Scenario                              | Recommendation                |
| ------------------------------------- | ----------------------------- |
| Need O(1) get/put with bounded memory |  LRU Cache                  |
| Items have different expiration times |  Use LFU or TTL-based cache |
| Simple caching, no eviction needed    |  A plain Map is simpler     |
