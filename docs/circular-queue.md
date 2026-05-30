# 🔄 Circular Queue

> **A fixed-size queue where the front and rear pointers wrap around** — Like a rotary sushi bar

---

## 📖 Concept

### Real-Life Analogy

<div class="analogy-box">

**🍣 Rotary sushi bar**: Plates move around on a conveyor belt. When a plate reaches the end, it loops back to the start. The belt has a fixed number of positions — once it's full, no more plates can be added until someone takes one.

More examples:

- **CPU task scheduling**: Fixed-size task queue in an operating system
- **Data buffer**: Audio/video streaming buffers use circular queues
- **Traffic light system**: Fixed-cycle traffic control

</div>

### Why Circular Queue?

A regular queue using an array wastes space: after `dequeue`, the front position becomes empty but can't be reused. A **circular queue** reuses those positions by wrapping around.

```
Regular Queue (wasteful):
  [ ][ ][C][D][E]  ← front positions A, B are wasted
   ↑        ↑
  front    rear

Circular Queue (efficient):
  [F][G][C][D][E]  ← F and G fill the freed spots
       ↑     ↑
     front rear
```

### When to Use

- ✅ Fixed-size buffer scenarios
- ✅ Streaming data processing
- ✅ Embedded systems with limited memory
- ✅ When you know the maximum queue size in advance

---

## 💻 Code

```javascript
class CircularQueue {
  constructor(capacity = 5) {
    this.items = new Array(capacity)
    this.capacity = capacity
    this._front = -1
    this._rear = -1
    this.count = 0
  }

  // Add an element to the rear
  enqueue(element) {
    if (this.isFull()) return false

    if (this.isEmpty()) {
      this._front = 0
      this._rear = 0
    } else {
      this._rear = (this._rear + 1) % this.capacity
    }

    this.items[this._rear] = element
    this.count++
    return true
  }

  // Remove and return the front element
  dequeue() {
    if (this.isEmpty()) return undefined

    const element = this.items[this._front]

    if (this._front === this._rear) {
      // Last element — reset queue
      this._front = -1
      this._rear = -1
    } else {
      this._front = (this._front + 1) % this.capacity
    }

    this.count--
    return element
  }

  // View front element without removing
  front() {
    return this.isEmpty() ? undefined : this.items[this.front]
  }

  // View rear element without removing
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

**Key points**:

- `(index + 1) % capacity` is the wrap-around trick — when `index` reaches the end, it jumps back to 0
- Tracking `count` separately lets us distinguish empty vs full (both have `front === rear`)

---

## ⏱ Complexity

| Operation | Time | Space |
| --------- | :--: | :---: |
| enqueue   | O(1) | O(1)  |
| dequeue   | O(1) | O(1)  |
| front     | O(1) | O(1)  |
| rear      | O(1) | O(1)  |
| isEmpty   | O(1) | O(1)  |
| isFull    | O(1) | O(1)  |

> **Space**: O(n) where n is the capacity. Unlike a dynamic queue, the memory is fixed and pre-allocated.

---

## 🎨 Visualization

<CircularQueueVisualizer />

---

## 🧪 Interview Questions

### 1. Design a Circular Queue

> **LeetCode 622**: Design Circular Queue

Implement a circular queue with `enQueue`, `deQueue`, `Front`, `Rear`, `isEmpty`, and `isFull`.

<CodePlayground :initialCode="`class MyCircularQueue {\n  constructor(k) {\n    this.items = new Array(k)\n    this.capacity = k\n    this.front = -1\n    this.rear = -1\n    this.count = 0\n  }\n\n  enQueue(value) {\n    if (this.isFull()) return false\n    if (this.isEmpty()) { this.front = 0; this.rear = 0 }\n    else { this.rear = (this.rear + 1) % this.capacity }\n    this.items[this.rear] = value\n    this.count++\n    return true\n  }\n\n  deQueue() {\n    if (this.isEmpty()) return false\n    if (this.front === this.rear) { this.front = -1; this.rear = -1 }\n    else { this.front = (this.front + 1) % this.capacity }\n    this.count--\n    return true\n  }\n\n  Front() { return this.isEmpty() ? -1 : this.items[this.front] }\n  Rear() { return this.isEmpty() ? -1 : this.items[this.rear] }\n  isEmpty() { return this.count === 0 }\n  isFull() { return this.count === this.capacity }\n}`" :testCode="`const q = new MyCircularQueue(3)\nconsole.log(q.enQueue(1))   // true\nconsole.log(q.enQueue(2))   // true\nconsole.log(q.enQueue(3))   // true\nconsole.log(q.enQueue(4))   // false (full)\nconsole.log(q.Rear())       // 3\nconsole.log(q.isFull())     // true\nconsole.log(q.deQueue())    // true\nconsole.log(q.enQueue(4))   // true\nconsole.log(q.Rear())       // 4`" />

---

## ⚠️ Common Pitfalls

| Mistake                                | Why it's wrong                                                                  |
| -------------------------------------- | ------------------------------------------------------------------------------- |
| Using `front === rear` to detect empty | Also true when the queue is full — use `count` instead                          |
| Forgetting modulo on pointer increment | `rear++` will go out of bounds after the last index                             |
| Not resetting pointers on last dequeue | After removing the last element, `front` and `rear` both point to a stale index |

---

## 💡 Decision Guide

| Scenario                     | Use Case                          |
| ---------------------------- | --------------------------------- |
| **Fixed max size**           | ✅ Circular Queue                 |
| **Unknown max size**         | ❌ Use a dynamic Queue instead    |
| **Need O(1) all operations** | ✅ Circular Queue                 |
| **Memory is constrained**    | ✅ Circular Queue (pre-allocated) |
