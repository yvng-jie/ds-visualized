# ⏫ Skip List

> **A multi-level linked list for fast search** — Like an express highway with local roads

---

## 📖 Concept

### Real-Life Analogy

<div class="analogy-box">

**🚗 Highways vs local roads**: To get across town, you take the express highway (fewer stops), then exit to local roads. Skip lists work the same way — upper levels "skip" over many nodes to reach the target area quickly, then lower levels fine-tune the search.

More examples:

- **In-memory databases**: Redis uses skip lists for sorted sets
- **Leaderboards**: Efficient insertion and ranking queries

</div>

### Structure

```
Level 3:  10 ────────────────────→ 50
Level 2:  10 ────────→ 30 ──────→ 50
Level 1:  10 ─→ 20 ─→ 30 ─→ 40 ─→ 50
Level 0:  10→15→20→25→30→35→40→45→50
```

Each level is a subset of the level below. Search starts at the top level and drops down when the next node is too far.

### Complexity

| Operation | Average  | Worst |
| --------- | :------: | :---: |
| Search    | O(log n) | O(n)  |
| Insert    | O(log n) | O(n)  |
| Delete    | O(log n) | O(n)  |

---

## 💻 Code

```javascript
class SkipNode {
  constructor(key, level) {
    this.key = key
    this.next = new Array(level + 1).fill(null)
  }
}

class SkipList {
  constructor(maxLevel = 4, probability = 0.5) {
    this.maxLevel = maxLevel
    this.probability = probability
    this.head = new SkipNode(-Infinity, maxLevel)
    this.level = 0
  }

  _randomLevel() {
    let lvl = 0
    while (Math.random() < this.probability && lvl < this.maxLevel) lvl++
    return lvl
  }

  insert(key) {
    const update = new Array(this.maxLevel + 1).fill(null)
    let current = this.head

    for (let i = this.level; i >= 0; i--) {
      while (current.next[i] && current.next[i].key < key) {
        current = current.next[i]
      }
      update[i] = current
    }

    current = current.next[0]
    if (current && current.key === key) return false

    const newLevel = this._randomLevel()
    if (newLevel > this.level) {
      for (let i = this.level + 1; i <= newLevel; i++) update[i] = this.head
      this.level = newLevel
    }

    const newNode = new SkipNode(key, newLevel)
    for (let i = 0; i <= newLevel; i++) {
      newNode.next[i] = update[i].next[i]
      update[i].next[i] = newNode
    }
    return true
  }

  search(key) {
    let current = this.head
    for (let i = this.level; i >= 0; i--) {
      while (current.next[i] && current.next[i].key < key) {
        current = current.next[i]
      }
    }
    current = current.next[0]
    return current && current.key === key
  }
}
```

---

## 🧪 Interview Questions

### 1. Why use Skip List over Balanced BST?

**Answer**: Skip lists are simpler to implement, have good average performance, and support efficient range scans (traversing all items in order). Redis uses skip lists for sorted sets because they're lock-friendly in concurrent environments.

---

## ⚠️ Common Pitfalls

| Mistake                              | Why                                            |
| ------------------------------------ | ---------------------------------------------- |
| Too high maxLevel                    | Wastes memory (most nodes only use low levels) |
| Too low maxLevel                     | Degrades to O(n) search                        |
| Not updating head level after insert | New high-level nodes won't be reachable        |

---

## 💡 Decision Guide

| Scenario                       | Recommendation                      |
| ------------------------------ | ----------------------------------- |
| Need O(log n) with simple code | ✅ Skip List                        |
| Worst-case guarantees required | ❌ Use balanced BST (AVL/Red-Black) |
| Concurrent access needed       | ✅ Skip List (lock-friendly)        |
