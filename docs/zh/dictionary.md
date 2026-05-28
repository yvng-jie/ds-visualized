# 📖 字典 Dictionary

> **键值对（Key-Value）存储** — 像查字典一样，通过 key 找到对应的 value

---

## 📖 概念介绍

### 现实类比

<div class="analogy-box">

**📞 通讯录**：你通过联系人名字（key）找到电话号码（value）。不需要记住每个人在第几页，直接搜名字就行。

其他例子：

- **字典**：单词（key）→ 释义（value）
- **配置项**：配置名（key）→ 配置值（value）
- **身份证号**：身份证号（key）→ 个人信息（value）

</div>

### 与数组的对比

| 特性     | 数组                   | 字典           |
| -------- | ---------------------- | -------------- |
| 索引方式 | 数字索引（0, 1, 2...） | 任意类型的 key |
| 查找方式 | 遍历或已知下标         | 直接通过 key   |
| 适用场景 | 有序列表               | 键值映射       |

---

## 💻 实现代码

```javascript
class Dictionary {
  constructor() {
    this.items = {}
  }

  // 📖 设置键值对
  set(key, value) {
    this.items[key] = value
  }

  // 🔍 判断是否有某个 key
  has(key) {
    return key in this.items
  }

  // 🗑️ 移除某个 key 及其 value
  remove(key) {
    if (!this.has(key)) return false
    delete this.items[key]
    return true
  }

  // 🔍 根据 key 获取 value
  get(key) {
    return this.has(key) ? this.items[key] : undefined
  }

  // 📋 获取所有 keys
  keys() {
    return Object.keys(this.items)
  }

  // 📋 获取所有 values
  values() {
    return Object.values(this.items)
  }

  // 📏 字典大小
  size() {
    return Object.keys(this.items).length
  }

  // 🧹 清空字典
  clear() {
    this.items = {}
  }
}
```

### 代码要点

1. **直接封装 JS 对象** — `this.items = {}`，利用 JS 对象天然的键值对特性
2. **`key in object` 判断存在** — 比 `obj[key] !== undefined` 更准确
3. **`Object.keys()` / `values()`** — ES6 提供的方法，直接获取所有键或值
4. **⚠️ 局限性**：对象的 key 会被转为字符串，所以 `set(1, 'a')` 和 `set('1', 'a')` 会覆盖

---

## ⏱ 复杂度分析

| 操作       | 时间复杂度  | 说明           |
| ---------- | ----------- | -------------- |
| `set()`    | **O(1)** ✅ | 对象属性赋值   |
| `get()`    | **O(1)** ✅ | 对象属性访问   |
| `has()`    | **O(1)** ✅ | `in` 运算符    |
| `remove()` | **O(1)** ✅ | `delete` 操作  |
| `keys()`   | **O(n)** ⚠️ | 需遍历所有属性 |
| `values()` | **O(n)** ⚠️ | 需遍历所有属性 |

---

## 🧪 常见面试题

### 1. 两数之和

> 给定数组 nums 和目标值 target，找出和为 target 的两个数的下标。

```javascript
function twoSum(nums, target) {
  const dict = new Dictionary()

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i]

    if (dict.has(complement)) {
      return [dict.get(complement), i]
    }

    dict.set(nums[i], i)
  }

  return []
}

console.log(twoSum([2, 7, 11, 15], 9)) // [0, 1]
```

### 2. 字符出现次数统计

```javascript
function countChars(str) {
  const dict = new Dictionary()

  for (let char of str) {
    const count = dict.get(char) || 0
    dict.set(char, count + 1)
  }

  return dict
}

const counts = countChars('hello world')
console.log(counts.keys()) // ['h','e','l','o',' ','w','r','d']
console.log(counts.get('l')) // 3
```

---

## 📚 总结

| 特性       | 说明                                                         |
| ---------- | ------------------------------------------------------------ |
| 核心思想   | 键值对映射                                                   |
| 关键操作   | set（存）、get（取）、has（判断存在）                        |
| 时间复杂度 | 核心操作 O(1)                                                |
| 局限性     | key 会被转为字符串                                           |
| 后续关联   | 字典是哈希表的基础，👉 [哈希表是字典的优化实现](/hash-table) |

---

### LeetCode 练手题

| 题号                                               | 题目             | 难度    |
| -------------------------------------------------- | ---------------- | ------- |
| [1](https://leetcode.cn/problems/two-sum/)         | 两数之和         | 🟢 简单 |
| [242](https://leetcode.cn/problems/valid-anagram/) | 有效的字母异位词 | 🟢 简单 |
| [49](https://leetcode.cn/problems/group-anagrams/) | 字母异位词分组   | 🟡 中等 |

[⬅️ 返回双向链表](/doubly-linked-list) · [返回首页](/)
