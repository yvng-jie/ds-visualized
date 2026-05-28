# 🔑 Hash Table

> **Use a hash function to map keys to array positions** — Makes lookups nearly O(1)

---

## 📖 Concept

### Real-Life Analogy

<div class="analogy-box">

**📮 Mailboxes**: An apartment building has numbered mailboxes. The mail carrier uses a formula to figure out which box gets which letter — no need to check every box.

More examples:

- **Library indexing**: Book title → shelf number
- **Database indexing**: Fast row lookup by key
- **Caching systems**: Direct access by key

</div>

### Dictionary vs Hash Table

In the Dictionary chapter, we used a plain JS object. With a Hash Table, we build it ourselves so you can see exactly how it works:

1. **Hash function** — turns a key into an array index
2. **Collision resolution** — what happens when two keys map to the same spot
3. **Dynamic resizing** — grows when it gets too full

---

## 💻 Code

```javascript
class HashTable {
  constructor() {
    this.storage = []
    this.count = 0
    this.limit = 7 // start with a prime number
  }

  // Hash function: key → array index
  hashFunc(str, size) {
    let hashCode = 0
    // Horner's method: efficient polynomial evaluation
    for (let i = 0; i < str.length; i++) {
      hashCode = 37 * hashCode + str.charCodeAt(i)
    }
    return hashCode % size
  }

  // Insert or update
  put(key, value) {
    const index = this.hashFunc(key, this.limit)
    let bucket = this.storage[index]
    if (!bucket) {
      bucket = []
      this.storage[index] = bucket
    }
    // Check if key already exists → update
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket[i][1] = value
        return
      }
    }
    // New key → add to bucket
    bucket.push([key, value])
    this.count++
    // Resize if load factor > 0.75
    if (this.count > this.limit * 0.75) {
      this._resize(this._getPrime(this.limit * 2))
    }
  }

  // Get value by key
  get(key) {
    const index = this.hashFunc(key, this.limit)
    const bucket = this.storage[index]
    if (!bucket) return null
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) return bucket[i][1]
    }
    return null
  }

  // Remove by key
  remove(key) {
    const index = this.hashFunc(key, this.limit)
    const bucket = this.storage[index]
    if (!bucket) return null
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        const value = bucket[i][1]
        bucket.splice(i, 1)
        this.count--
        // Shrink if load factor < 0.25
        if (this.limit > 7 && this.count < this.limit * 0.25) {
          this._resize(this._getPrime(Math.floor(this.limit / 2)))
        }
        return value
      }
    }
    return null
  }

  isEmpty() {
    return this.count === 0
  }
  size() {
    return this.count
  }

  // Resize and rehash all elements
  _resize(newLimit) {
    const oldStorage = this.storage
    this.storage = []
    this.count = 0
    this.limit = newLimit
    for (let i = 0; i < oldStorage.length; i++) {
      const bucket = oldStorage[i]
      if (bucket) {
        for (let j = 0; j < bucket.length; j++) {
          this.put(bucket[j][0], bucket[j][1])
        }
      }
    }
  }

  // Prime number helpers — prime sizes reduce collisions
  _isPrime(num) {
    if (num < 2) return false
    const sqrt = Math.sqrt(num)
    for (let i = 2; i <= sqrt; i++) {
      if (num % i === 0) return false
    }
    return true
  }

  _getPrime(num) {
    while (!this._isPrime(num)) num++
    return num
  }
}
```

### Key Points

| Concept           | Explanation                                                              |
| ----------------- | ------------------------------------------------------------------------ |
| **Hash function** | Horner's method turns strings into numbers, then % size to fit the array |
| **Chaining**      | Each array position holds a "bucket" (array) for collisions              |
| **Load factor**   | `count / limit` — resize when > 0.75, shrink when < 0.25                 |
| **Prime size**    | Array length stays prime to reduce collisions                            |
| **Rehashing**     | On resize, ALL elements get new positions                                |

---

## ⏱ Complexity

| Operation  | Average     | Worst | Notes                      |
| ---------- | ----------- | ----- | -------------------------- |
| `put()`    | **O(1)** ✅ | O(n)  | Bad hash = many collisions |
| `get()`    | **O(1)** ✅ | O(n)  |                            |
| `remove()` | **O(1)** ✅ | O(n)  |                            |
| Resize     | **O(n)** ⚠️ | O(n)  | Rehash everything          |

---

## 🧪 Interview Questions

### 1. First Unique Character

```javascript
function firstUniqChar(s) {
  const ht = new HashTable()
  for (const char of s) {
    const count = ht.get(char) || 0
    ht.put(char, count + 1)
  }
  for (let i = 0; i < s.length; i++) {
    if (ht.get(s[i]) === 1) return i
  }
  return -1
}

console.log(firstUniqChar('leetcode')) // 0
console.log(firstUniqChar('aabb')) // -1
```

---

## 📚 Summary

| Property      | Description                                                          |
| ------------- | -------------------------------------------------------------------- |
| Core idea     | Hash function + array + chaining                                     |
| Key ops       | put / get / remove — O(1) average                                    |
| 3 essentials  | Hash function, collision handling, dynamic resizing                  |
| vs Dictionary | Dictionary wraps JS object; HashTable is built from scratch          |
| Next          | 👉 [Binary Search Tree — Sorted tree structure](/binary-search-tree) |

### LeetCode Practice

| # | Problem | Difficulty |
| --- | --- | --- |
| [1](https://leetcode.com/problems/two-sum/) | Two Sum | 🟢 Easy |
| [3](https://leetcode.com/problems/longest-substring-without-repeating-characters/) | Longest Substring Without Repeating | 🟡 Medium |

---

[⬅️ Back to Set](/set) · [Back to Home](/)
