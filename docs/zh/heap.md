#  堆 Heap

> **一种特殊的完全二叉树，父节点总是大于（或小于）子节点** — 像金字塔，最大的在最上面

---

##  概念介绍

### 现实类比

<div class="analogy-box">

** 排行榜**：得分最高的永远在第一名。如果有人分数更高，他就升到第一，原来的第一名往下移。

其他例子：

- **任务调度**：优先级最高的任务先执行
- **数据流中位数**：用最大堆 + 最小堆求中位数
- **Dijkstra 最短路径**：用最小堆优化

</div>

### 最大堆 vs 最小堆

| 类型                  | 规则            | 顶部元素 |
| --------------------- | --------------- | -------- |
| **最大堆（MaxHeap）** | 父节点 ≥ 子节点 | 最大值   |
| **最小堆（MinHeap）** | 父节点 ≤ 子节点 | 最小值   |

### 堆 vs 优先级队列

前面我们学了优先级队列（数组实现，插入 O(n)）。**堆是实现优先级队列的最佳方式**，插入和删除都是 O(log n)。

---

##  实现代码

```javascript
class MinHeap {
  constructor() {
    this.heap = []
  }

  //  获取左子节点索引
  _leftChild(index) {
    return index * 2 + 1
  }
  //  获取右子节点索引
  _rightChild(index) {
    return index * 2 + 2
  }
  //  获取父节点索引
  _parent(index) {
    return Math.floor((index - 1) / 2)
  }

  //  交换两个位置的值
  _swap(i, j) {
    ;[this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]]
  }

  //  上浮：新插入的元素向上调整
  _siftUp(index) {
    while (index > 0 && this.heap[index] < this.heap[this._parent(index)]) {
      this._swap(index, this._parent(index))
      index = this._parent(index)
    }
  }

  //  下沉：删除顶部后，将新顶部向下调整
  _siftDown(index) {
    const size = this.heap.length
    while (this._leftChild(index) < size) {
      let smaller = this._leftChild(index)
      const right = this._rightChild(index)
      if (right < size && this.heap[right] < this.heap[smaller]) {
        smaller = right
      }
      if (this.heap[index] <= this.heap[smaller]) break
      this._swap(index, smaller)
      index = smaller
    }
  }

  //  插入
  insert(value) {
    this.heap.push(value)
    this._siftUp(this.heap.length - 1)
  }

  //  删除堆顶（最小值/最大值）
  extract() {
    if (this.heap.length === 0) return null
    if (this.heap.length === 1) return this.heap.pop()
    const root = this.heap[0]
    this.heap[0] = this.heap.pop()
    this._siftDown(0)
    return root
  }

  //  查看堆顶
  peek() {
    return this.heap.length > 0 ? this.heap[0] : null
  }
  size() {
    return this.heap.length
  }
  isEmpty() {
    return this.heap.length === 0
  }
}

// 最大堆：只需要比较符号反过来
class MaxHeap extends MinHeap {
  _siftUp(index) {
    while (index > 0 && this.heap[index] > this.heap[this._parent(index)]) {
      this._swap(index, this._parent(index))
      index = this._parent(index)
    }
  }
  _siftDown(index) {
    const size = this.heap.length
    while (this._leftChild(index) < size) {
      let larger = this._leftChild(index)
      const right = this._rightChild(index)
      if (right < size && this.heap[right] > this.heap[larger]) {
        larger = right
      }
      if (this.heap[index] >= this.heap[larger]) break
      this._swap(index, larger)
      index = larger
    }
  }
}
```

### 代码要点

1. **底层用数组** — 堆逻辑上是完全二叉树，但用数组存储：`heap[0]` 是根，`heap[i]` 的左子 = `heap[2i+1]`，右子 = `heap[2i+2]`
2. **上浮（siftUp）** — 插入时把新元素放到末尾，然后不断和父节点比较交换
3. **下沉（siftDown）** — 删除堆顶后把末尾元素移到堆顶，然后不断和子节点比较交换

---

##  复杂度分析

| 操作        | 时间复杂度      | 说明              |
| ----------- | --------------- | ----------------- |
| `insert()`  | **O(log n)**  | 上浮最多 log n 层 |
| `extract()` | **O(log n)**  | 下沉最多 log n 层 |
| `peek()`    | **O(1)**      | 直接取数组第一个  |
| 建堆        | **O(n)**      | 从底层开始下沉    |

---

##  常见面试题

### 1. 数组中的第 K 大元素

```javascript
function findKthLargest(nums, k) {
  const heap = new MinHeap()
  for (const num of nums) {
    heap.insert(num)
    if (heap.size() > k) heap.extract()
  }
  return heap.peek()
}
console.log(findKthLargest([3, 2, 1, 5, 6, 4], 2)) // 5
```

### 2. 前 K 个高频元素

```javascript
function topKFrequent(nums, k) {
  const freq = {}
  for (const n of nums) freq[n] = (freq[n] || 0) + 1
  const heap = new MinHeap()
  for (const [num, count] of Object.entries(freq)) {
    heap.insert({ num: +num, count })
    if (heap.size() > k) heap.extract()
  }
  return heap.heap.map((n) => n.num)
}
```

---

##  总结

| 特性       | 说明                                   |
| ---------- | -------------------------------------- |
| 核心思想   | 完全二叉树 + 父节点始终大于/小于子节点 |
| 存储方式   | 数组（不需要指针）                     |
| 关键操作   | siftUp（上浮）、siftDown（下沉）       |
| 时间复杂度 | insert/extract 都是 O(log n)           |
| 应用场景   | 优先级队列、Top K 问题、Dijkstra 算法  |

### LeetCode 练手题

| 题号                                                                 | 题目                  | 难度    |
| -------------------------------------------------------------------- | --------------------- | ------- |
| [215](https://leetcode.cn/problems/kth-largest-element-in-an-array/) | 数组中的第K个最大元素 |  中等 |
| [347](https://leetcode.cn/problems/top-k-frequent-elements/)         | 前 K 个高频元素       |  中等 |
| [295](https://leetcode.cn/problems/find-median-from-data-stream/)    | 数据流的中位数        |  困难 |

---

[ 返回图](/graph) · [返回首页](/)
