#  双端队列 Deque

> **两端都可以插入和删除的队列** — Deque = Queue + Stack 的合体

---

##  概念介绍

### 现实类比

<div class="analogy-box">

** 过山车排队**：排在最前面和最后面的人都可以上车。

其他例子：浏览器前进后退、滑动窗口最大值、撤销/重做

</div>

### Deque 是 Queue + Stack 的合体

| 结构      | 插入                | 删除                |
| --------- | ------------------- | ------------------- |
| Stack     | 尾部 push           | 尾部 pop            |
| Queue     | 尾部 enqueue        | 头部 dequeue        |
| **Deque** | **头部/尾部都可以** | **头部/尾部都可以** |

---

##  实现代码

```javascript
class Deque {
  constructor() {
    this.items = {}
    this.frontIndex = 0
    this.backIndex = 0
  }

  //  在头部插入
  addFront(element) {
    this.frontIndex--
    this.items[this.frontIndex] = element
  }

  //  在尾部插入
  addBack(element) {
    this.items[this.backIndex] = element
    this.backIndex++
  }

  //  移除头部元素
  removeFront() {
    if (this.isEmpty()) return undefined
    const result = this.items[this.frontIndex]
    delete this.items[this.frontIndex]
    this.frontIndex++
    return result
  }

  //  移除尾部元素
  removeBack() {
    if (this.isEmpty()) return undefined
    this.backIndex--
    const result = this.items[this.backIndex]
    delete this.items[this.backIndex]
    return result
  }

  //  查看头部
  peekFront() {
    return this.isEmpty() ? undefined : this.items[this.frontIndex]
  }
  peekBack() {
    return this.isEmpty() ? undefined : this.items[this.backIndex - 1]
  }

  isEmpty() {
    return this.frontIndex === this.backIndex
  }
  size() {
    return this.backIndex - this.frontIndex
  }

  toString() {
    let result = ''
    for (let i = this.frontIndex; i < this.backIndex; i++) {
      result += this.items[i] + ' '
    }
    return result.trim()
  }
}
```

### 代码要点

1. **对象 + 双指针** — 用对象存储元素，`frontIndex` 和 `backIndex` 做指针，避免数组 `shift()` 的 O(n) 问题
2. **`addFront()` 是 Deque 独有的能力** — 普通 Queue 做不到
3. **所有操作都是 O(1)**

---

##  复杂度分析

| 操作            | 时间复杂度  | 说明         |
| --------------- | ----------- | ------------ |
| `addFront()`    | **O(1)**  | 对象属性赋值 |
| `addBack()`     | **O(1)**  | 对象属性赋值 |
| `removeFront()` | **O(1)**  | 对象属性删除 |
| `removeBack()`  | **O(1)**  | 对象属性删除 |

---

##  常见面试题

### 1. 滑动窗口最大值

```javascript
function maxSlidingWindow(nums, k) {
  const deque = new Deque()
  const result = []
  for (let i = 0; i < nums.length; i++) {
    if (!deque.isEmpty() && deque.peekFront() < i - k + 1) deque.removeFront()
    while (!deque.isEmpty() && nums[deque.peekBack()] < nums[i]) deque.removeBack()
    deque.addBack(i)
    if (i >= k - 1) result.push(nums[deque.peekFront()])
  }
  return result
}
console.log(maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3))
// [3, 3, 5, 5, 6, 7]
```

### 2. 回文检查

```javascript
function isPalindrome(str) {
  const deque = new Deque()
  for (const ch of str) deque.addBack(ch)
  while (deque.size() > 1) {
    if (deque.removeFront() !== deque.removeBack()) return false
  }
  return true
}
console.log(isPalindrome('racecar')) // true
console.log(isPalindrome('hello')) // false
```

---

##  总结

| 特性          | 说明                                    |
| ------------- | --------------------------------------- |
| 核心思想      | 两端都能插入和删除                      |
| 与 Queue 关系 | Deque = Queue + Stack 的合体            |
| 关键操作      | addFront/addBack/removeFront/removeBack |
| 时间复杂度    | 所有操作 O(1)                           |
| 应用场景      | 滑动窗口、回文检查                      |

### LeetCode 练手题

| 题号                                                        | 题目             | 难度    |
| ----------------------------------------------------------- | ---------------- | ------- |
| [239](https://leetcode.cn/problems/sliding-window-maximum/) | 滑动窗口最大值   |  困难 |
| [641](https://leetcode.cn/problems/design-circular-deque/)  | 设计循环双端队列 |  中等 |

---

[ 返回堆](/heap) · [返回首页](/)
