# 🔑 哈希表 HashTable

> **通过散列函数将 key 映射到数组的某个位置** — 让查找接近 O(1)

---

## 📖 概念介绍

### 现实类比

<div class="analogy-box">

**📮 信箱**：一栋楼有很多信箱，每个信箱都有编号。你根据收件人名字算出编号（散列），直接走到对应信箱前取信，不需要逐个翻找。

其他例子：

- **图书馆索引**：书名 → 书架位置编号
- **数据库索引**：通过哈希快速定位数据行
- **缓存系统**：通过 key 直接找到缓存数据

</div>

### 字典 vs 哈希表

上一节我们实现了 Dictionary，它基于 JS 对象。但 JS 对象的 key 只能是字符串，而且底层实现不透明。

哈希表是**自己实现**一个键值存储结构，能清楚地看到：

1. **散列函数** — 如何把 key 转为数组下标
2. **冲突解决** — 两个不同的 key 散列到同一个位置怎么办
3. **动态扩容** — 数据太多时自动扩展

---

## 💻 实现代码

```javascript
class HashTable {
  constructor() {
    this.storage = [] // 存储桶
    this.count = 0 // 已存储的元素个数
    this.limit = 7 // 当前数组长度（初始为质数）
  }

  // 🔑 散列函数：key → 数组下标
  hashFunc(str, size) {
    let hashCode = 0

    // 霍纳法则（Horner's method）：多项式求值优化
    for (let i = 0; i < str.length; i++) {
      hashCode = 37 * hashCode + str.charCodeAt(i)
    }

    // 取模，压缩到 [0, size) 范围内
    return hashCode % size
  }

  // 🔑 插入/更新
  put(key, value) {
    const index = this.hashFunc(key, this.limit)

    // 桶不存在则创建
    let bucket = this.storage[index]
    if (!bucket) {
      bucket = []
      this.storage[index] = bucket
    }

    // 遍历桶，查找是否已存在相同的 key
    for (let i = 0; i < bucket.length; i++) {
      const tuple = bucket[i]
      if (tuple[0] === key) {
        tuple[1] = value // 更新
        return
      }
    }

    // 新增
    bucket.push([key, value])
    this.count++

    // 检查是否需要扩容（负载因子 > 0.75）
    if (this.count > this.limit * 0.75) {
      this._resize(this._getPrime(this.limit * 2))
    }
  }

  // 🔍 获取
  get(key) {
    const index = this.hashFunc(key, this.limit)
    const bucket = this.storage[index]

    if (!bucket) return null

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        return bucket[i][1]
      }
    }

    return null
  }

  // 🗑️ 移除
  remove(key) {
    const index = this.hashFunc(key, this.limit)
    const bucket = this.storage[index]

    if (!bucket) return null

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        const value = bucket[i][1]
        bucket.splice(i, 1)
        this.count--

        // 检查是否需要缩容（负载因子 < 0.25）
        if (this.limit > 7 && this.count < this.limit * 0.25) {
          this._resize(this._getPrime(Math.floor(this.limit / 2)))
        }

        return value
      }
    }

    return null
  }

  // ❓ 是否为空
  isEmpty() {
    return this.count === 0
  }

  // 📏 元素个数
  size() {
    return this.count
  }

  // 🔄 动态扩容/缩容
  _resize(newLimit) {
    const oldStorage = this.storage

    // 重置
    this.storage = []
    this.count = 0
    this.limit = newLimit

    // 重新散列所有元素
    for (let i = 0; i < oldStorage.length; i++) {
      const bucket = oldStorage[i]
      if (bucket) {
        for (let j = 0; j < bucket.length; j++) {
          const tuple = bucket[j]
          this.put(tuple[0], tuple[1])
        }
      }
    }
  }

  // 🔢 判断是否为质数
  _isPrime(num) {
    if (num < 2) return false
    if (num === 2) return true

    // 只需要检查到平方根
    const sqrt = Math.sqrt(num)
    for (let i = 2; i <= sqrt; i++) {
      if (num % i === 0) return false
    }
    return true
  }

  // 🔢 获取不小于 num 的最小质数
  _getPrime(num) {
    while (!this._isPrime(num)) {
      num++
    }
    return num
  }
}
```

### 代码要点

| 概念         | 说明                                                              |
| ------------ | ----------------------------------------------------------------- |
| **散列函数** | 用霍纳法则把字符串转为数字，再取模压缩到数组长度内                |
| **链地址法** | 每个数组位置是一个桶（数组），多个 key 散列到同位置时存入同一个桶 |
| **负载因子** | `count / limit` > 0.75 时扩容，< 0.25 时缩容                      |
| **质数长度** | 数组长度保持质数，可以减少散列冲突                                |
| **重新散列** | 扩容/缩容时所有元素要重新计算散列位置                             |

---

## ⏱ 复杂度分析

| 操作       | 平均        | 最坏 | 说明                         |
| ---------- | ----------- | ---- | ---------------------------- |
| `put()`    | **O(1)** ✅ | O(n) | 哈希冲突严重时退化为链表查找 |
| `get()`    | **O(1)** ✅ | O(n) | 同上                         |
| `remove()` | **O(1)** ✅ | O(n) | 同上                         |
| 扩容/缩容  | **O(n)** ⚠️ | O(n) | 需要重新散列所有元素         |

---

## 🧪 常见面试题

### 1. 第一个只出现一次的字符

```javascript
function firstUniqChar(s) {
  const ht = new HashTable()

  for (let char of s) {
    const count = ht.get(char)
    ht.put(char, (count || 0) + 1)
  }

  for (let i = 0; i < s.length; i++) {
    if (ht.get(s[i]) === 1) return i
  }

  return -1
}

console.log(firstUniqChar('leetcode')) // 0 (l)
console.log(firstUniqChar('aabb')) // -1
```

### 2. 有效的字母异位词

```javascript
function isAnagram(s, t) {
  if (s.length !== t.length) return false

  const ht = new HashTable()

  for (let char of s) {
    const count = ht.get(char) || 0
    ht.put(char, count + 1)
  }

  for (let char of t) {
    const count = ht.get(char)
    if (!count) return false
    ht.put(char, count - 1)
  }

  return true
}

console.log(isAnagram('anagram', 'nagaram')) // true
console.log(isAnagram('rat', 'car')) // false
```

---

## 📚 总结

| 特性       | 说明                                              |
| ---------- | ------------------------------------------------- |
| 核心思想   | 散列函数 + 数组 + 链地址法                        |
| 关键操作   | put / get / remove，平均 O(1)                     |
| 三个关键点 | 散列函数、冲突解决、动态扩容                      |
| 与字典关系 | 字典是哈希表的简化版（基于 JS 对象）              |
| 下一步学习 | 👉 [二叉搜索树 — 有序树结构](/binary-search-tree) |

---

### LeetCode 练手题

| 题号                                                                              | 题目                 | 难度    |
| --------------------------------------------------------------------------------- | -------------------- | ------- |
| [1](https://leetcode.cn/problems/two-sum/)                                        | 两数之和             | 🟢 简单 |
| [3](https://leetcode.cn/problems/longest-substring-without-repeating-characters/) | 无重复字符的最长子串 | 🟡 中等 |
| [36](https://leetcode.cn/problems/valid-sudoku/)                                  | 有效的数独           | 🟡 中等 |

[⬅️ 返回集合](/set) · [返回首页](/)
