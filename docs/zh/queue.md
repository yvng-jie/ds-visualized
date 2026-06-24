#  队列 Queue

> **先进先出（FIFO, First-In-First-Out）** — 最先放入的元素最先被取出

---

##  概念介绍

### 现实类比

<div class="analogy-box">

** 排队**：你去银行办事，先到的人先办，后到的人排队等。这就是队列。

其他例子：

- **打印机任务队列**：先提交的文档先打印
- **消息队列**：RabbitMQ、Kafka 等消息系统
- **BFS 广度优先搜索**：用队列记录待访问节点

</div>

### 与栈的对比

| 特性 | 栈（Stack）      | 队列（Queue）     |
| ---- | ---------------- | ----------------- |
| 顺序 | LIFO（后进先出） | FIFO（先进先出）  |
| 操作 | push / pop       | enqueue / dequeue |
| 类比 | 叠盘子           | 排队              |
| 应用 | 函数调用栈       | 任务调度          |

---

##  实现代码

```javascript
class Queue {
  constructor() {
    this.items = []
  }

  //  入队：在队尾添加元素
  enqueue(element) {
    this.items.push(element)
  }

  //  出队：移除队首元素并返回
  dequeue() {
    return this.items.shift()
  }

  //  查看队首元素
  front() {
    if (this.isEmpty()) return undefined
    return this.items[0]
  }

  //  队列是空的吗？
  isEmpty() {
    return this.items.length === 0
  }

  //  队列长度
  size() {
    return this.items.length
  }

  //  字符串输出
  toString() {
    return this.items.join(' ')
  }
}
```

### 代码要点

1. **入队用 `push()`** — 在数组末尾添加
2. **出队用 `shift()`** — 移除数组第一个元素
3. ** 注意**：`shift()` 是 **O(n)** 操作，因为移除第一个元素后，所有后面的元素都要前移。后面会介绍更优的实现方式。

---

##  复杂度分析

| 操作        | 时间复杂度  | 说明                           |
| ----------- | ----------- | ------------------------------ |
| `enqueue()` | **O(1)**  | 数组末尾插入                   |
| `dequeue()` | **O(n)**  | 使用 `shift()`，所有元素需前移 |
| `front()`   | **O(1)**  | 直接索引访问                   |
| `isEmpty()` | **O(1)**  |                                |
| `size()`    | **O(1)**  |                                |

<div class="tip-box">

** 优化思路**：可以用对象 + 头尾指针实现 O(1) 出队。不过对于教学，数组实现更易理解，所以我们先用这种方式。

</div>

---

##  可视化演示

<QueueVisualizer />

---

##  常见面试题

### 1. 击鼓传花

> N 个人围成一圈，从第一个人开始报数，每数到 M 的人淘汰，最后剩下的人获胜。

```javascript
function passGame(nameList, num) {
  const queue = new Queue()

  // 所有人入队
  for (let name of nameList) {
    queue.enqueue(name)
  }

  while (queue.size() > 1) {
    // 前 num-1 个人出队再入队（模拟转圈）
    for (let i = 0; i < num - 1; i++) {
      queue.enqueue(queue.dequeue())
    }
    // 第 num 个人淘汰
    queue.dequeue()
  }

  return queue.front()
}

const names = ['Alice', 'Bob', 'Cathy', 'David', 'Eve']
console.log(passGame(names, 3)) // 获胜者
```

### 2. 用两个栈实现队列

> 只能用栈的 push/pop 操作，实现一个队列。

```javascript
class QueueByTwoStacks {
  constructor() {
    this.stack1 = [] // 入队栈
    this.stack2 = [] // 出队栈
  }

  enqueue(element) {
    this.stack1.push(element)
  }

  dequeue() {
    if (this.stack2.length === 0) {
      // 把 stack1 的元素全部倒入 stack2
      while (this.stack1.length > 0) {
        this.stack2.push(this.stack1.pop())
      }
    }
    return this.stack2.pop()
  }
}
```

---

##  总结

| 特性       | 说明                                        |
| ---------- | ------------------------------------------- |
| 核心思想   | 先进先出（FIFO）                            |
| 关键操作   | enqueue（入队）、dequeue（出队）            |
| 与栈对比   | 栈是 LIFO，队列是 FIFO                      |
| 注意事项   | `shift()` 是 O(n) 操作                      |
| 下一步学习 |  [优先级队列 — VIP 优先](/priority-queue) |

---

### LeetCode 练手题

| 题号                                                              | 题目           | 难度    |
| ----------------------------------------------------------------- | -------------- | ------- |
| [933](https://leetcode.cn/problems/number-of-recent-calls/)       | 最近的请求次数 |  简单 |
| [622](https://leetcode.cn/problems/design-circular-queue/)        | 设计循环队列   |  中等 |
| [225](https://leetcode.cn/problems/implement-stack-using-queues/) | 用队列实现栈   |  简单 |

[ 返回栈](/stack) · [返回首页](/)
