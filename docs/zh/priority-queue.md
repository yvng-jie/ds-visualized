#  优先级队列 PriorityQueue

> **每个元素都有优先级，优先级高的先出队** — 就像急诊室先处理危重病人

---

##  概念介绍

### 现实类比

<div class="analogy-box">

** 急诊分诊**：医院急诊室会根据病人病情的严重程度决定救治顺序。心脏病发作（高优先级）比轻微擦伤（低优先级）先得到处理。

其他例子：

- **操作系统进程调度**：高优先级进程先获得 CPU
- **网络数据包**：实时音视频数据优先传输
- **任务队列**：VIP 用户的任务优先执行

</div>

### 与普通队列的对比

| 特性     | 普通队列                  | 优先级队列                     |
| -------- | ------------------------- | ------------------------------ |
| 出队顺序 | 按入队时间                | 按优先级（数字越小优先级越高） |
| 插入位置 | 始终在尾部                | 按优先级找到合适位置           |
| 核心操作 | enqueue/dequeue 都是 O(1) | enqueue O(n)，dequeue O(1)     |

---

##  实现代码

```javascript
// 队列元素类：保存数据和优先级
class QueueElement {
  constructor(element, priority) {
    this.element = element
    this.priority = priority // 数字越小，优先级越高
  }
}

class PriorityQueue {
  constructor() {
    this.items = []
  }

  //  入队：按优先级插入
  enqueue(element, priority) {
    const queueElement = new QueueElement(element, priority)

    // 空队列直接插入
    if (this.isEmpty()) {
      this.items.push(queueElement)
      return
    }

    // 找到第一个优先级比当前大的位置，插在它前面
    let added = false
    for (let i = 0; i < this.items.length; i++) {
      if (queueElement.priority < this.items[i].priority) {
        this.items.splice(i, 0, queueElement)
        added = true
        break
      }
    }

    // 如果没找到（当前优先级最低），放到队尾
    if (!added) {
      this.items.push(queueElement)
    }
  }

  //  出队：移除队首（优先级最高的）元素
  dequeue() {
    return this.items.shift()
  }

  //  查看优先级最高的元素
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

  //  字符串输出（元素:优先级）
  toString() {
    return this.items.map((item) => `${item.element}:${item.priority}`).join(' ')
  }
}
```

### 代码要点

1. **`QueueElement` 包装类** — 把元素和优先级打包在一起
2. **数字越小优先级越高** — 这是常见约定，也可以反过来
3. **插入时排序** — 遍历找到合适位置插入，O(n)
4. **出队和普通队列一样** — 直接从队首取

---

##  复杂度分析

| 操作        | 时间复杂度  | 说明                   |
| ----------- | ----------- | ---------------------- |
| `enqueue()` | **O(n)**  | 需要遍历找到插入位置   |
| `dequeue()` | **O(n)**  | `shift()` 引起元素前移 |
| `front()`   | **O(1)**  | 直接取第一个           |
| `isEmpty()` | **O(1)**  |                        |
| `size()`    | **O(1)**  |                        |

<div class="tip-box">

** 性能优化**：如果数据量大，可以用**二叉堆（Binary Heap）** 实现优先级队列，这样 enqueue 和 dequeue 都是 O(log n)。我们将在后续章节介绍堆。

</div>

---

##  可视化演示

<QueueVisualizer />

>  优先级队列的可视化与普通队列类似，区别在于入队时按优先级排序插入。当前用普通队列可视化作为示意。可查看 [栈的可视化](/stack#可视化演示) 了解交互式组件的工作方式。

---

##  常见面试题

### 1. 合并 K 个有序数组

> 有 K 个已经排好序的数组，把它们合并成一个有序数组。

```javascript
function mergeKSortedArrays(arrays) {
  const pq = new PriorityQueue()
  const result = []

  // 先把每个数组的第一个元素入队
  for (let i = 0; i < arrays.length; i++) {
    if (arrays[i].length > 0) {
      pq.enqueue({ value: arrays[i][0], arrIndex: i, index: 0 }, arrays[i][0])
    }
  }

  while (!pq.isEmpty()) {
    const min = pq.dequeue()
    result.push(min.element.value)

    // 把同一个数组的下一个元素入队
    const nextIndex = min.element.index + 1
    if (nextIndex < arrays[min.element.arrIndex].length) {
      const arr = arrays[min.element.arrIndex]
      pq.enqueue({ value: arr[nextIndex], arrIndex: min.element.arrIndex, index: nextIndex }, arr[nextIndex])
    }
  }

  return result
}
```

---

##  总结

| 特性       | 说明                                               |
| ---------- | -------------------------------------------------- |
| 核心思想   | 优先级高的先出队                                   |
| 与队列关系 | 队列的升级版，增加了优先级排序                     |
| 关键操作   | enqueue（按优先级插入）、dequeue（取优先级最高的） |
| 时间复杂度 | enqueue 是 O(n)                                    |
| 优化方向   | 用二叉堆实现可优化到 O(log n)                      |
| 下一步学习 |  [单向链表 — 动态数据结构](/linked-list)         |

---

### LeetCode 练手题

| 题号                                                                 | 题目                  | 难度    |
| -------------------------------------------------------------------- | --------------------- | ------- |
| [215](https://leetcode.cn/problems/kth-largest-element-in-an-array/) | 数组中的第K个最大元素 |  中等 |
| [347](https://leetcode.cn/problems/top-k-frequent-elements/)         | 前 K 个高频元素       |  中等 |
| [703](https://leetcode.cn/problems/kth-largest-element-in-a-stream/) | 数据流中的第 K 大元素 |  简单 |

[ 返回队列](/queue) · [返回首页](/)
