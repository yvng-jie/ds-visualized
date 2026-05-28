# 🧩 集合 Set

> **元素唯一、无序** — 就像一袋弹珠，每种颜色只能有一颗

---

## 📖 概念介绍

### 现实类比

<div class="analogy-box">

**🎨 颜料盒**：一套颜料中每种颜色只有一支。红色就是红色，不会有两支相同的红色。

其他例子：

- **班级名单**：每个学生只出现一次
- **IP 黑名单**：每个 IP 地址只记录一次
- **投票系统**：每人只能投一票（去重）

</div>

### 集合的核心运算

| 运算       | 含义                     | 示例                      |
| ---------- | ------------------------ | ------------------------- |
| **并集** ∪ | A 和 B 的所有元素        | `{1,2} ∪ {2,3} = {1,2,3}` |
| **交集** ∩ | A 和 B 共有的元素        | `{1,2} ∩ {2,3} = {2}`     |
| **差集** - | 在 A 中但不在 B 中的元素 | `{1,2} - {2,3} = {1}`     |
| **子集** ⊆ | A 的所有元素都在 B 中    | `{1,2} ⊆ {1,2,3}` = true  |

---

## 💻 实现代码

```javascript
class Set {
  constructor() {
    this.items = {}
  }

  // 🧩 添加元素（重复添加不会报错，但只保留一个）
  add(element) {
    if (this.has(element)) return false
    this.items[element] = element
    return true
  }

  // 🗑️ 移除元素
  remove(element) {
    if (!this.has(element)) return false
    delete this.items[element]
    return true
  }

  // 🔍 判断元素是否存在
  has(element) {
    return Object.prototype.hasOwnProperty.call(this.items, element)
  }

  // 🧹 清空集合
  clear() {
    this.items = {}
  }

  // 📏 集合大小
  size() {
    return Object.keys(this.items).length
  }

  // 📋 获取所有元素
  values() {
    return Object.keys(this.items)
  }

  // 🧩 并集：A ∪ B
  union(otherSet) {
    const unionSet = new Set()

    // 先把 A 的所有元素加入
    let values = this.values()
    for (let i = 0; i < values.length; i++) {
      unionSet.add(values[i])
    }

    // 再把 B 的所有元素加入（重复的会被自动忽略）
    values = otherSet.values()
    for (let i = 0; i < values.length; i++) {
      unionSet.add(values[i])
    }

    return unionSet
  }

  // 🧩 交集：A ∩ B
  intersection(otherSet) {
    const intersectionSet = new Set()

    let values = this.values()
    for (let i = 0; i < values.length; i++) {
      const item = values[i]
      if (otherSet.has(item)) {
        intersectionSet.add(item)
      }
    }

    return intersectionSet
  }

  // 🧩 差集：A - B（在 A 中但不在 B 中的元素）
  difference(otherSet) {
    const differenceSet = new Set()

    let values = this.values()
    for (let i = 0; i < values.length; i++) {
      const item = values[i]
      if (!otherSet.has(item)) {
        differenceSet.add(item)
      }
    }

    return differenceSet
  }

  // 🧩 子集：A ⊆ B（A 的所有元素都在 B 中）
  subset(otherSet) {
    let values = this.values()
    for (let i = 0; i < values.length; i++) {
      if (!otherSet.has(values[i])) {
        return false // 只要有一个不在，就不是子集
      }
    }
    return true // 全部都在，是子集
  }
}
```

### 代码要点

1. **基于对象实现** — 利用对象的 key 唯一性保证元素不重复
2. **`has()` 用 `hasOwnProperty`** — 比 `in` 运算符更安全，不会检查原型链
3. **并集 = 全部加一起** — 利用 add 的去重特性自动去重
4. **交集 = 找共同的** — 遍历 A，检查是否在 B 中
5. **差集 = A 有 B 没有** — 遍历 A，检查是否不在 B 中
6. **子集 = 全部都在** — 遍历 A，只要有一个不在 B 中就 false

---

## ⏱ 复杂度分析

| 操作             | 时间复杂度    | 说明           |
| ---------------- | ------------- | -------------- |
| `add()`          | **O(1)** ✅   | 对象属性赋值   |
| `remove()`       | **O(1)** ✅   | `delete` 操作  |
| `has()`          | **O(1)** ✅   | 属性检查       |
| `union()`        | **O(n+m)** ⚠️ | 需遍历两个集合 |
| `intersection()` | **O(n)** ⚠️   | 需遍历一个集合 |
| `difference()`   | **O(n)** ⚠️   | 需遍历一个集合 |
| `subset()`       | **O(n)** ⚠️   | 需遍历一个集合 |

---

## 🧪 常见面试题

### 1. 数组去重

```javascript
function unique(arr) {
  const set = new Set()
  for (let item of arr) {
    set.add(item)
  }
  return set.values()
}

console.log(unique([1, 2, 2, 3, 3, 3])) // ['1', '2', '3']
```

### 2. 两个数组的交集

```javascript
function intersectionOfArrays(arr1, arr2) {
  const set1 = new Set()
  for (let item of arr1) set1.add(item)

  const result = []
  for (let item of arr2) {
    if (set1.has(item)) {
      result.push(item)
      set1.remove(item) // 防止重复
    }
  }

  return result
}

console.log(intersectionOfArrays([1, 2, 2, 3], [2, 2, 4])) // [2]
```

---

## 📚 总结

| 特性       | 说明                                        |
| ---------- | ------------------------------------------- |
| 核心思想   | 元素唯一、集合运算                          |
| 关键操作   | add / remove / has + 集合四则运算           |
| 与字典关系 | 集合≈只有 key 没有 value 的字典             |
| 典型应用   | 去重、权限检查、标签系统                    |
| 下一步学习 | 👉 [哈希表 — 更高效的键值存储](/hash-table) |

---

### LeetCode 练手题

| 题号                                                              | 题目           | 难度    |
| ----------------------------------------------------------------- | -------------- | ------- |
| [217](https://leetcode.cn/problems/contains-duplicate/)           | 存在重复元素   | 🟢 简单 |
| [349](https://leetcode.cn/problems/intersection-of-two-arrays/)   | 两个数组的交集 | 🟢 简单 |
| [128](https://leetcode.cn/problems/longest-consecutive-sequence/) | 最长连续序列   | 🟡 中等 |

[⬅️ 返回字典](/dictionary) · [返回首页](/)
