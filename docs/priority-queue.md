#  Priority Queue

> **Every element has a priority. Higher priority elements get served first.** — Like an emergency room treating critical patients before minor ones.

---

##  Concept

### Real-Life Analogy

<div class="analogy-box">

** Emergency Room**: Heart attack patients (high priority) get treated before someone with a small cut (low priority), even if the small cut arrived earlier.

More examples:

- **OS process scheduling**: High-priority processes get CPU time first
- **Network packets**: Video calls get priority over file downloads
- **Task queues**: VIP user tasks run before free user tasks

</div>

### Queue vs Priority Queue

| Property        | Queue                      | Priority Queue                               |
| --------------- | -------------------------- | -------------------------------------------- |
| Dequeue order   | By arrival time            | By priority (lower number = higher priority) |
| Insert position | Always at the back         | Sorted by priority                           |
| Performance     | enqueue O(1), dequeue O(n) | enqueue O(n), dequeue O(n)                   |

---

##  Code

```javascript
// Wrapper class: holds data + priority
class QueueElement {
  constructor(element, priority) {
    this.element = element
    this.priority = priority // smaller number = higher priority
  }
}

class PriorityQueue {
  constructor() {
    this.items = []
  }

  // Insert sorted by priority
  enqueue(element, priority) {
    const queueElement = new QueueElement(element, priority)

    if (this.isEmpty()) {
      this.items.push(queueElement)
      return
    }

    // Find the right spot (sorted by priority, ascending)
    let added = false
    for (let i = 0; i < this.items.length; i++) {
      if (queueElement.priority < this.items[i].priority) {
        this.items.splice(i, 0, queueElement)
        added = true
        break
      }
    }

    // Lowest priority? Put it at the back
    if (!added) {
      this.items.push(queueElement)
    }
  }

  // Remove and return the highest priority element
  dequeue() {
    return this.items.shift()
  }

  // Look at the highest priority element
  front() {
    return this.isEmpty() ? undefined : this.items[0]
  }

  isEmpty() {
    return this.items.length === 0
  }
  size() {
    return this.items.length
  }

  toString() {
    return this.items.map((i) => `${i.element}:${i.priority}`).join(' ')
  }
}
```

### Key Points

1. **`QueueElement` wrapper** — bundles the data with its priority
2. **Smaller number = higher priority** — common convention, but could be reversed
3. **Insertion sorts** — walks through the array to find the right spot, O(n)
4. **Dequeue is the same as Queue** — just grab the first element

---

##  Complexity

| Operation   | Time        | Notes                            |
| ----------- | ----------- | -------------------------------- |
| `enqueue()` | **O(n)**  | Linear search for insertion spot |
| `dequeue()` | **O(n)**  | `shift()` shifts elements        |

<div class="tip-box">

** Pro tip**: For better performance, use a **Binary Heap** for priority queues. Both enqueue and dequeue become O(log n). Check out the [Heap](/heap) chapter.

</div>

---

##  Visualization

<QueueVisualizer />

---

##  Interview Questions

### 1. Kth Largest Element in an Array

```javascript
function findKthLargest(nums, k) {
  // Use a min-heap approach (not array-based PQ)
  const minHeap = []
  // This is a simplified version — see Heap chapter for details
  for (const num of nums) {
    minHeap.push(num)
    if (minHeap.length > k) minHeap.sort((a, b) => a - b).shift()
  }
  return minHeap.sort((a, b) => a - b)[0]
}
```

---

##  Summary

| Property          | Description                                      |
| ----------------- | ------------------------------------------------ |
| Core idea         | Higher priority = served first                   |
| Compared to Queue | Adds priority-based ordering                     |
| Key ops           | enqueue (sorted insert), dequeue (take first)    |
| Optimization      | Use a Binary Heap for O(log n)                   |
| Next              |  [Dictionary — Key-Value Storage](/dictionary) |

### LeetCode Practice

| #                                                                     | Problem                         | Difficulty |
| --------------------------------------------------------------------- | ------------------------------- | ---------- |
| [215](https://leetcode.com/problems/kth-largest-element-in-an-array/) | Kth Largest Element             |  Medium  |
| [347](https://leetcode.com/problems/top-k-frequent-elements/)         | Top K Frequent Elements         |  Medium  |
| [703](https://leetcode.com/problems/kth-largest-element-in-a-stream/) | Kth Largest Element in a Stream |  Easy    |

---

[ Back to Queue](/queue) · [Back to Home](/)
