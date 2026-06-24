#  循环队列 Circular Queue

> **固定大小的队列，头尾指针循环使用** — 就像旋转寿司吧台

---

##  概念

### 现实类比

<div class="analogy-box">

** 旋转寿司**：寿司在传送带上移动，到达终点后绕回起点。传送带位置固定 — 一旦满了就不能再添加，直到有人取走。

更多例子：

- **CPU 任务调度**：操作系统中的固定大小任务队列
- **数据缓冲区**：音视频流媒体缓冲区
- **红绿灯系统**：固定周期的交通控制

</div>

### 为什么需要循环队列？

普通队列（基于数组）会浪费空间：`dequeue` 后，队首位置变空但无法复用。**循环队列**通过指针绕回，复用这些位置。

```
普通队列（浪费空间）：
  [ ][ ][C][D][E]  ← 队首 A、B 的位置浪费了
   ↑        ↑
  front    rear

循环队列（高效）：
  [F][G][C][D][E]  ← F 和 G 填入了空出的位置
       ↑     ↑
     front rear
```

### 何时使用

-  固定大小的缓冲区场景
-  流式数据处理
-  内存有限的嵌入式系统
-  预先知道最大队列大小

---

##  代码

```javascript
class CircularQueue {
  constructor(capacity = 5) {
    this.items = new Array(capacity)
    this.capacity = capacity
    this._front = -1
    this._rear = -1
    this.count = 0
  }

  enqueue(element) {
    if (this.isFull()) return false
    if (this.isEmpty()) {
      this.front = 0
      this.rear = 0
    } else {
      this.rear = (this.rear + 1) % this.capacity
    }
    this.items[this.rear] = element
    this.count++
    return true
  }

  dequeue() {
    if (this.isEmpty()) return undefined
    const element = this.items[this.front]
    if (this.front === this.rear) {
      this.front = -1
      this.rear = -1
    } else {
      this.front = (this.front + 1) % this.capacity
    }
    this.count--
    return element
  }

  front() {
    return this.isEmpty() ? undefined : this.items[this.front]
  }
  rear() {
    return this.isEmpty() ? undefined : this.items[this.rear]
  }
  isEmpty() {
    return this.count === 0
  }
  isFull() {
    return this.count === this.capacity
  }
  size() {
    return this.count
  }
}
```

**关键点**：

- `(index + 1) % capacity` 是绕回技巧 — 索引到达末尾时跳回 0
- 用 `count` 区分空和满（两者 `front === rear` 都成立）

---

##  复杂度

| 操作           | 时间 | 空间 |
| -------------- | :--: | :--: |
| enqueue        | O(1) | O(1) |
| dequeue        | O(1) | O(1) |
| front/rear     | O(1) | O(1) |
| isEmpty/isFull | O(1) | O(1) |

> **空间**：O(n)，n 为容量。与动态队列不同，内存是固定预分配的。

---

##  可视化

<CircularQueueVisualizer />

---

##  面试题

### 1. 设计循环队列

> LeetCode 622：设计循环队列

<CodePlayground :initialCode="`class MyCircularQueue {\n  constructor(k) {\n    this.items = new Array(k)\n    this.capacity = k\n    this.front = -1\n    this.rear = -1\n    this.count = 0\n  }\n\n  enQueue(value) {\n    if (this.isFull()) return false\n    if (this.isEmpty()) { this.front = 0; this.rear = 0 }\n    else { this.rear = (this.rear + 1) % this.capacity }\n    this.items[this.rear] = value\n    this.count++\n    return true\n  }\n\n  deQueue() {\n    if (this.isEmpty()) return false\n    if (this.front === this.rear) { this.front = -1; this.rear = -1 }\n    else { this.front = (this.front + 1) % this.capacity }\n    this.count--\n    return true\n  }\n\n  Front() { return this.isEmpty() ? -1 : this.items[this.front] }\n  Rear() { return this.isEmpty() ? -1 : this.items[this.rear] }\n  isEmpty() { return this.count === 0 }\n  isFull() { return this.count === this.capacity }\n}`" :testCode="`const q = new MyCircularQueue(3)\nconsole.log(q.enQueue(1))   // true\nconsole.log(q.enQueue(2))   // true\nconsole.log(q.enQueue(3))   // true\nconsole.log(q.enQueue(4))   // false (full)\nconsole.log(q.Rear())       // 3\nconsole.log(q.isFull())     // true\nconsole.log(q.deQueue())    // true\nconsole.log(q.enQueue(4))   // true\nconsole.log(q.Rear())       // 4`" />

---

##  常见误区

| 错误                        | 原因                               |
| --------------------------- | ---------------------------------- |
| 用 `front === rear` 判断空  | 满的时候也成立 — 用 `count` 区分   |
| 忘记取模                    | `rear++` 超出数组范围              |
| 最后一次 dequeue 未重置指针 | 移除最后一个元素后指针指向无效位置 |

---

##  决策指南

| 场景              | 推荐                  |
| ----------------- | --------------------- |
| 固定最大大小      |  循环队列           |
| 未知大小          |  用动态队列         |
| 需要所有操作 O(1) |  循环队列           |
| 内存受限          |  循环队列（预分配） |
