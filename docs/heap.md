# ⛰️ Heap

> **A complete binary tree where every parent is greater (or smaller) than its children** — Like a pyramid with the biggest at the top

---

## 📖 Concept

### Real-Life Analogy

<div class="analogy-box">

**🏆 Leaderboard**: The highest score is always at #1. If someone scores higher, they take the top spot and everyone else shifts down.

More examples:

- **Task scheduling**: Highest priority task runs first
- **Median tracking**: Use a max-heap + min-heap together
- **Dijkstra's algorithm**: Uses a min-heap for efficiency

</div>

### Max-Heap vs Min-Heap

| Type         | Rule              | Top element   |
| ------------ | ----------------- | ------------- |
| **Max-Heap** | Parent ≥ Children | Maximum value |
| **Min-Heap** | Parent ≤ Children | Minimum value |

### Heap vs Priority Queue

Remember our Priority Queue from earlier? It used an array and insertion was O(n). A **heap** is the efficient way to build a priority queue — both insert and extract are O(log n).

---

## 💻 Code

```javascript
class MinHeap {
  constructor() {
    this.heap = []
  }

  _leftChild(i) {
    return i * 2 + 1
  }
  _rightChild(i) {
    return i * 2 + 2
  }
  _parent(i) {
    return Math.floor((i - 1) / 2)
  }

  _swap(i, j) {
    ;[this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]]
  }

  // Bubble up: new element swims up to its correct position
  _siftUp(index) {
    while (index > 0 && this.heap[index] < this.heap[this._parent(index)]) {
      this._swap(index, this._parent(index))
      index = this._parent(index)
    }
  }

  // Sink down: after extracting root, the replacement sinks to its spot
  _siftDown(index) {
    const size = this.heap.length
    while (this._leftChild(index) < size) {
      let smaller = this._leftChild(index)
      const right = this._rightChild(index)
      if (right < size && this.heap[right] < this.heap[smaller]) smaller = right
      if (this.heap[index] <= this.heap[smaller]) break
      this._swap(index, smaller)
      index = smaller
    }
  }

  insert(value) {
    this.heap.push(value)
    this._siftUp(this.heap.length - 1)
  }

  extract() {
    if (this.heap.length === 0) return null
    if (this.heap.length === 1) return this.heap.pop()
    const root = this.heap[0]
    this.heap[0] = this.heap.pop()
    this._siftDown(0)
    return root
  }

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

// Max-Heap: same as MinHeap, just flip the comparisons
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
      if (right < size && this.heap[right] > this.heap[larger]) larger = right
      if (this.heap[index] >= this.heap[larger]) break
      this._swap(index, larger)
      index = larger
    }
  }
}
```

### Key Points

1. **Array storage** — A heap is logically a tree but stored in an array. Root = `heap[0]`, children of `heap[i]` are `heap[2i+1]` and `heap[2i+2]`
2. **Sift Up** — New element goes to the end, then swims up comparing with parents
3. **Sift Down** — After extracting the root, the last element takes its place and sinks down
4. **Max vs Min** — Same logic, just reversed comparison signs

---

## ⏱ Complexity

| Operation       | Time            | Notes                  |
| --------------- | --------------- | ---------------------- |
| `insert()`      | **O(log n)** ✅ | Sift up log n levels   |
| `extract()`     | **O(log n)** ✅ | Sift down log n levels |
| `peek()`        | **O(1)** ✅     | First array element    |
| Building a heap | **O(n)** ✅     | Sift down from bottom  |

---

## 🧪 Interview Questions

### 1. Kth Largest Element

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

---

## 📚 Summary

| Property  | Description                                          |
| --------- | ---------------------------------------------------- |
| Core idea | Complete binary tree + parent always > or < children |
| Storage   | Array (no pointers needed!)                          |
| Key ops   | Sift Up (insert), Sift Down (extract)                |
| Time      | Both O(log n)                                        |
| Use cases | Priority queues, Top K, Dijkstra                     |
| Next      | 👉 [Trie — Fast string search](/trie)                |

### LeetCode Practice

| #                                                                     | Problem                      | Difficulty |
| --------------------------------------------------------------------- | ---------------------------- | ---------- |
| [215](https://leetcode.com/problems/kth-largest-element-in-an-array/) | Kth Largest Element          | 🟡 Medium  |
| [347](https://leetcode.com/problems/top-k-frequent-elements/)         | Top K Frequent Elements      | 🟡 Medium  |
| [295](https://leetcode.com/problems/find-median-from-data-stream/)    | Find Median from Data Stream | 🔴 Hard    |

---

[⬅️ Back to Graph](/graph) · [Back to Home](/)
