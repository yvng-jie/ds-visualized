# 🔗 单向链表 LinkedList

> **由节点组成的线性结构，每个节点指向下一个节点** — 像火车车厢一节连一节

---

## 📖 概念介绍

### 现实类比

<div class="analogy-box">

**🚃 火车**：火车由一节节车厢连接而成。每节车厢都只知道自己后面那节车厢是谁。要走到中间某节车厢，只能从车头开始一节节数过去。

其他例子：

- **照片胶卷**：每张胶片连着下一张，查看某张照片得从头卷到那个位置
- **寻宝游戏**：每个线索指向下一个线索的位置

</div>

### 链表 vs 数组

| 特性              | 数组                   | 链表                 |
| ----------------- | ---------------------- | -------------------- |
| 内存              | 连续空间               | 分散空间，用指针连接 |
| 随机访问          | O(1) — `arr[5]` 直接取 | O(n) — 要从头遍历    |
| 插入/删除（中间） | O(n) — 需移动元素      | O(1) — 改指针即可    |
| 长度              | 固定（JS 会自动扩容）  | 动态，随时增减       |

---

## 💻 实现代码

```javascript
// 节点类
class Node {
  constructor(element) {
    this.element = element // 节点保存的数据
    this.next = null // 指向下一个节点
  }
}

class LinkedList {
  constructor() {
    this.head = null // 头节点
    this.length = 0 // 链表长度
  }

  // 🔗 在末尾追加
  append(element) {
    const node = new Node(element)

    if (this.head === null) {
      this.head = node
    } else {
      let current = this.head
      while (current.next) {
        current = current.next
      }
      current.next = node
    }

    this.length++
  }

  // 🔗 在指定位置插入
  insert(position, element) {
    if (position < 0 || position > this.length) return false

    const node = new Node(element)

    if (position === 0) {
      // 插入到头节点
      node.next = this.head
      this.head = node
    } else {
      // 找到位置的前一个节点
      let current = this.head
      let previous = null
      let index = 0

      while (index < position) {
        previous = current
        current = current.next
        index++
      }

      // 插入：previous → node → current
      previous.next = node
      node.next = current
    }

    this.length++
    return true
  }

  // 🔗 移除指定位置的节点
  removeAt(position) {
    if (position < 0 || position >= this.length) return null

    let current = this.head

    if (position === 0) {
      // 移除头节点
      this.head = current.next
    } else {
      let previous = null
      let index = 0

      while (index < position) {
        previous = current
        current = current.next
        index++
      }

      // 跳过 current：previous → current.next
      previous.next = current.next
    }

    this.length--
    return current.element
  }

  // 🔗 移除指定元素（第一次出现）
  remove(element) {
    const index = this.indexOf(element)
    if (index === -1) return false
    this.removeAt(index)
    return true
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

  // 🔍 获取指定位置的元素
  get(position) {
    if (position < 0 || position >= this.length) return null

    let current = this.head
    let index = 0

    while (index < position) {
      current = current.next
      index++
    }

    return current.element
  }

  // 🔄 更新指定位置的元素
  update(position, element) {
    if (position < 0 || position >= this.length) return false

    let current = this.head
    let index = 0

    while (index < position) {
      current = current.next
      index++
    }

    current.element = element
    return true
  }

  // ❓ 链表是空的吗？
  isEmpty() {
    return this.length === 0
  }

  // 📏 链表长度
  size() {
    return this.length
  }

  // 📝 字符串输出
  toString() {
    let current = this.head
    let result = ''

    while (current) {
      result += current.element + ' → '
      current = current.next
    }

    return result + 'null'
  }
}
```

### 代码要点

1. **Node 类** — 每个节点包含数据和指向下一个节点的指针
2. **头节点（head）** — 链表的入口，找到 head 就能遍历整个链表
3. **插入/删除核心** — 修改前后节点的 `next` 指针，不需要移动其他元素
4. **遍历查找** — 从 head 开始，沿着 next 逐个访问，直到找到目标

---

## ⏱ 复杂度分析

| 操作         | 时间复杂度  | 说明               |
| ------------ | ----------- | ------------------ |
| `append()`   | **O(n)** ⚠️ | 需要遍历到末尾     |
| `insert()`   | **O(n)** ⚠️ | 需要遍历到插入位置 |
| `removeAt()` | **O(n)** ⚠️ | 需要遍历到删除位置 |
| `indexOf()`  | **O(n)** ⚠️ | 需要遍历查找       |
| `get()`      | **O(n)** ⚠️ | 需要遍历           |
| `isEmpty()`  | **O(1)** ✅ |                    |
| `size()`     | **O(1)** ✅ |                    |

---

## 🎨 可视化演示

<LinkedListVisualizer />

---

## 🧪 常见面试题

### 1. 反转链表

> 将链表反转，返回新的头节点。

```javascript
function reverseLinkedList(list) {
  let prev = null
  let current = list.head

  while (current) {
    const next = current.next // 保存下一个节点
    current.next = prev // 反转指针
    prev = current // prev 前移
    current = next // current 前移
  }

  return prev // 新的头节点
}
```

### 2. 检测链表是否有环

> 用快慢指针判断链表是否有环。

```javascript
function hasCycle(head) {
  if (!head || !head.next) return false

  let slow = head // 慢指针，每次走一步
  let fast = head.next // 快指针，每次走两步

  while (slow !== fast) {
    if (!fast || !fast.next) return false
    slow = slow.next
    fast = fast.next.next
  }

  return true // 相遇了，说明有环
}
```

---

## 📚 总结

| 特性       | 说明                                            |
| ---------- | ----------------------------------------------- |
| 核心思想   | 节点 + 指针，动态连接                           |
| 与数组对比 | 插入/删除快（O(1)），查找慢（O(n)）             |
| 优点       | 动态大小，中间插入/删除高效                     |
| 缺点       | 不能随机访问，需要从头遍历                      |
| 下一步学习 | 👉 [双向链表 — 前后都能走](/doubly-linked-list) |

---

### LeetCode 练手题

| 题号                                                           | 题目             | 难度    |
| -------------------------------------------------------------- | ---------------- | ------- |
| [206](https://leetcode.cn/problems/reverse-linked-list/)       | 反转链表         | 🟢 简单 |
| [141](https://leetcode.cn/problems/linked-list-cycle/)         | 环形链表         | 🟢 简单 |
| [21](https://leetcode.cn/problems/merge-two-sorted-lists/)     | 合并两个有序链表 | 🟢 简单 |
| [876](https://leetcode.cn/problems/middle-of-the-linked-list/) | 链表的中间结点   | 🟢 简单 |

[⬅️ 返回优先级队列](/priority-queue) · [返回首页](/)
