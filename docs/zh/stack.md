#  栈 Stack

> **后进先出（LIFO, Last-In-First-Out）** — 最后放入的元素最先被取出

---

##  概念介绍

### 现实类比

<div class="analogy-box">

** 叠盘子**：你洗完盘子后，会把新盘子叠在最上面。需要用时，也是从最上面先拿。最后放上去的盘子最先被拿走——这就是栈。

其他例子：

- **浏览器后退按钮**：你访问的每个页面都被"压入"栈中，点击后退就是"弹出"当前页面
- **撤销操作（Ctrl+Z）**：编辑器记录你的每一步操作，撤销时回退到上一步
- **函数调用**：JS 引擎用调用栈（Call Stack）管理函数执行

</div>

### 适用场景

-  括号匹配检查（`{[]}()` 是否合法）
-  十进制转二进制（除二取余）
-  表达式求值（中缀转后缀）
-  函数调用栈 / 递归

---

##  实现代码

```javascript
/**
 * 栈结构 JS 实现
 *
 * 基于数组实现，栈顶 = 数组末尾
 *
 * 方法         | 时间复杂度 | 描述
 * push(ele)   |   O(1)     | 入栈
 * pop()       |   O(1)     | 出栈
 * peek()      |   O(1)     | 查看栈顶
 * isEmpty()   |   O(1)     | 是否为空
 * size()      |   O(1)     | 元素个数
 * toString()  |   O(n)     | 字符串输出
 */
class Stack {
  constructor() {
    this.items = []
  }

  //  入栈：把元素放到最上面（数组末尾）
  push(element) {
    this.items.push(element)
  }

  //  出栈：移除最上面的元素并返回
  pop() {
    return this.items.pop()
  }

  //  看一眼栈顶是什么
  peek() {
    if (this.isEmpty()) return undefined
    return this.items[this.items.length - 1]
  }

  //  栈是空的吗？
  isEmpty() {
    return this.items.length === 0
  }

  //  栈里有多少元素？
  size() {
    return this.items.length
  }

  //  输出成易读的字符串
  toString() {
    return this.items.join(' ')
  }
}
```

### 代码要点

1. **用数组模拟栈** — `push()` 在末尾加，`pop()` 从末尾删，天然就是栈操作
2. **栈顶 = 数组末尾** — 所以 `peek()` 取 `items[length - 1]`
3. **所有操作都是 O(1)** — 数组末尾的增删不涉及元素移动

---

##  复杂度分析

| 操作         | 时间复杂度  | 说明                         |
| ------------ | ----------- | ---------------------------- |
| `push()`     | **O(1)**  | 数组末尾插入，不涉及元素移动 |
| `pop()`      | **O(1)**  | 数组末尾删除                 |
| `peek()`     | **O(1)**  | 直接索引访问                 |
| `isEmpty()`  | **O(1)**  | 读 length 属性               |
| `size()`     | **O(1)**  | 读 length 属性               |
| `toString()` | **O(n)**  | 需要遍历所有元素             |

---

##  可视化演示

<StackVisualizer />

---

##  常见面试题

### 1. 有效的括号

> 给定一个只包含 `()`、`[]`、`{}` 的字符串，判断括号是否有效匹配。

```javascript
function isValidBrackets(s) {
  const stack = []
  const map = { ')': '(', ']': '[', '}': '{' }

  for (let char of s) {
    if (!map[char]) {
      // 左括号 → 入栈
      stack.push(char)
    } else {
      // 右括号 → 检查栈顶是否匹配
      if (stack.pop() !== map[char]) return false
    }
  }

  return stack.length === 0
}

// 测试
console.log(isValidBrackets('()[]{}')) // true
console.log(isValidBrackets('([)]')) // false
console.log(isValidBrackets('{[]}')) // true
```

### 2. 十进制转二进制

> 用栈实现十进制到二进制的转换（除二取余法）。

```javascript
function dec2bin(dec) {
  const stack = new Stack()

  while (dec > 0) {
    stack.push(dec % 2) // 余数入栈
    dec = Math.floor(dec / 2)
  }

  let binary = ''
  while (!stack.isEmpty()) {
    binary += stack.pop() // 出栈拼接
  }

  return binary || '0'
}

console.log(dec2bin(10)) // 1010
console.log(dec2bin(42)) // 101010
```

---

##  总结

| 特性       | 说明                                    |
| ---------- | --------------------------------------- |
| 核心思想   | 后进先出（LIFO）                        |
| 底层实现   | 数组（JS）或链表                        |
| 关键操作   | push（入栈）、pop（出栈）、peek（查看） |
| 时间复杂度 | 核心操作都是 O(1)                       |
| 下一步学习 |  [队列 — 先进先出](/queue)            |

---

### LeetCode 练手题

| 题号                                                                  | 题目             | 难度    |
| --------------------------------------------------------------------- | ---------------- | ------- |
| [20](https://leetcode.cn/problems/valid-parentheses/)                 | 有效的括号       |  简单 |
| [155](https://leetcode.cn/problems/min-stack/)                        | 最小栈           |  简单 |
| [739](https://leetcode.cn/problems/daily-temperatures/)               | 每日温度         |  中等 |
| [150](https://leetcode.cn/problems/evaluate-reverse-polish-notation/) | 逆波兰表达式求值 |  中等 |

[ 返回首页](/)
