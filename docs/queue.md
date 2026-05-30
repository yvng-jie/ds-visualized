---
title: Queue — FIFO Data Structure
description: Learn Queue data structure in JavaScript with visual animations. Complete guide with code, complexity analysis, and interview questions.
---

# 📋 Queue

> **First-In-First-Out (FIFO)** — The first item you put in is the first one you take out

---

## 📖 Concept

### Real-Life Analogy

<div class="analogy-box">

**🚶 Waiting in line**: You go to the bank, take a number, and wait. The person who arrived first gets served first. That's a queue.

More examples:

- **Printer queue**: Documents print in the order they were sent
- **Message queues**: Like RabbitMQ or Kafka
- **BFS (Breadth-First Search)**: Uses a queue to track nodes to visit

</div>

### Stack vs Queue

| Property   | Stack                     | Queue                      |
| ---------- | ------------------------- | -------------------------- |
| Order      | LIFO (last in, first out) | FIFO (first in, first out) |
| Operations | push / pop                | enqueue / dequeue          |
| Analogy    | Stack of plates           | Waiting in line            |

---

## 💻 Code

```javascript
class Queue {
  constructor() {
    this.items = []
  }

  // Add an element to the back of the queue
  enqueue(element) {
    this.items.push(element)
  }

  // Remove and return the front element
  dequeue() {
    return this.items.shift()
  }

  // Look at the front element without removing it
  front() {
    if (this.isEmpty()) return undefined
    return this.items[0]
  }

  // Check if the queue is empty
  isEmpty() {
    return this.items.length === 0
  }

  // Get the number of elements
  size() {
    return this.items.length
  }

  // String representation
  toString() {
    return this.items.join(' ')
  }
}
```

### Key Points

1. **`enqueue()` uses `push()`** — adds to the end of the array
2. **`dequeue()` uses `shift()`** — removes the first element
3. **⚠️ `shift()` is O(n)** — removing the first element means all remaining elements shift down. Later we'll look at a faster implementation.

---

## ⏱ Complexity

| Operation   | Time        | Notes                        |
| ----------- | ----------- | ---------------------------- |
| `enqueue()` | **O(1)** ✅ | Add to end                   |
| `dequeue()` | **O(n)** ⚠️ | `shift()` moves all elements |
| `front()`   | **O(1)** ✅ | Index lookup                 |
| `isEmpty()` | **O(1)** ✅ |                              |
| `size()`    | **O(1)** ✅ |                              |

<div class="tip-box">

**💡 Optimization**: We can use an object with head/tail pointers for O(1) dequeue. But for teaching purposes, the array version is easier to understand.

</div>

---

## 🎨 Visualization

<QueueVisualizer />

---

## 🧪 Interview Questions

### 1. Implement Stack using Queues

> Use only queue operations to implement a stack (push/pop/peek).

```javascript
class StackUsingQueues {
  constructor() {
    this.q1 = new Queue()
    this.q2 = new Queue()
  }

  push(element) {
    this.q2.enqueue(element)
    while (!this.q1.isEmpty()) {
      this.q2.enqueue(this.q1.dequeue())
    }
    // Swap q1 and q2
    ;[this.q1, this.q2] = [this.q2, this.q1]
  }

  pop() {
    return this.q1.dequeue()
  }
  peek() {
    return this.q1.front()
  }
  isEmpty() {
    return this.q1.isEmpty()
  }
}
```

---

## 📚 Summary

| Property  | Description                                          |
| --------- | ---------------------------------------------------- |
| Core idea | First-In-First-Out (FIFO)                            |
| Key ops   | enqueue, dequeue, front                              |
| vs Stack  | Stack is LIFO, Queue is FIFO                         |
| Watch out | `shift()` is O(n)                                    |
| Next      | 👉 [Priority Queue — VIPs go first](/priority-queue) |

### LeetCode Practice

| #                                                                  | Problem                      | Difficulty |
| ------------------------------------------------------------------ | ---------------------------- | ---------- |
| [933](https://leetcode.com/problems/number-of-recent-calls/)       | Number of Recent Calls       | 🟢 Easy    |
| [622](https://leetcode.com/problems/design-circular-queue/)        | Design Circular Queue        | 🟡 Medium  |
| [225](https://leetcode.com/problems/implement-stack-using-queues/) | Implement Stack using Queues | 🟢 Easy    |

---

[⬅️ Back to Stack](/stack) · [Back to Home](/)
