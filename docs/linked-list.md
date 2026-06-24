---
title: Linked List — Linear Data Structure
description: Learn Singly Linked List in JavaScript with visual animations. Complete guide with code, complexity analysis, and interview questions.
---

#  Linked List

> **A chain of nodes, each pointing to the next one** — Like train cars connected together

---

##  Concept

### Real-Life Analogy

<div class="analogy-box">

** Train**: Each train car is connected to the one behind it. To get to a specific car, you have to walk from the front, counting cars as you go.

More examples:

- **Photo negatives**: Each frame connects to the next one
- **Treasure hunt**: Each clue tells you where to find the next one
- **Music playlist**: Each song points to the next one

</div>

### Linked List vs Array

| Property               | Array                 | Linked List                      |
| ---------------------- | --------------------- | -------------------------------- |
| Memory                 | Contiguous block      | Scattered, connected by pointers |
| Random access          | O(1) — `arr[5]`       | O(n) — must walk from head       |
| Insert/delete (middle) | O(n) — shift elements | O(1) — just change pointers      |
| Size                   | Fixed (JS auto-grows) | Dynamic                          |

---

##  Code

```javascript
class Node {
  constructor(element) {
    this.element = element
    this.next = null
  }
}

class LinkedList {
  constructor() {
    this.head = null
    this.length = 0
  }

  // Add an element to the end
  append(element) {
    const node = new Node(element)
    if (this.head === null) {
      this.head = node
    } else {
      let current = this.head
      while (current.next) current = current.next
      current.next = node
    }
    this.length++
  }

  // Insert at a specific position
  insert(position, element) {
    if (position < 0 || position > this.length) return false
    const node = new Node(element)

    if (position === 0) {
      node.next = this.head
      this.head = node
    } else {
      let current = this.head
      let previous = null
      let index = 0
      while (index < position) {
        previous = current
        current = current.next
        index++
      }
      previous.next = node
      node.next = current
    }
    this.length++
    return true
  }

  // Remove element at a specific position
  removeAt(position) {
    if (position < 0 || position >= this.length) return null
    let current = this.head
    if (position === 0) {
      this.head = current.next
    } else {
      let previous = null
      let index = 0
      while (index < position) {
        previous = current
        current = current.next
        index++
      }
      previous.next = current.next
    }
    this.length--
    return current.element
  }

  // Find the index of an element
  indexOf(element) {
    let current = this.head
    let index = 0
    while (current) {
      if (current.element === element) return index
      current = current.next
      index++
    }
    return -1
  }

  // Get element at a position
  get(position) {
    if (position < 0 || position >= this.length) return null
    let current = this.head
    let index = 0
    while (index < position) {
      current = current.next
      index++
    }
    return current.element
  }

  isEmpty() {
    return this.length === 0
  }
  size() {
    return this.length
  }

  toString() {
    let current = this.head
    let result = ''
    while (current) {
      result += current.element + ' → '
      current = current.next
    }
    return result + 'null'
  }
}
```

### Key Points

1. **Node class** — each node has data and a `next` pointer to the next node
2. **Head pointer** — the entry point to the list. Follow `next` from head to traverse.
3. **Insert/delete = pointer manipulation** — just change what nodes point to, no shifting
4. **Search is O(n)** — you must walk the list from head to find anything

---

##  Complexity

| Operation    | Time        | Notes            |
| ------------ | ----------- | ---------------- |
| `append()`   | **O(n)**  | Walk to the end  |
| `insert()`   | **O(n)**  | Walk to position |
| `removeAt()` | **O(n)**  | Walk to position |
| `indexOf()`  | **O(n)**  | Walk and compare |
| `get()`      | **O(n)**  | Walk to position |

---

##  Visualization

<LinkedListVisualizer />

---

##  Interview Questions

### 1. Reverse a Linked List

```javascript
function reverseLinkedList(list) {
  let prev = null
  let current = list.head

  while (current) {
    const next = current.next
    current.next = prev
    prev = current
    current = next
  }

  return prev
}
```

### 2. Detect Cycle

```javascript
function hasCycle(head) {
  if (!head || !head.next) return false

  let slow = head // moves 1 step
  let fast = head.next // moves 2 steps

  while (slow !== fast) {
    if (!fast || !fast.next) return false
    slow = slow.next
    fast = fast.next.next
  }
  return true // they met → cycle!
}
```

---

##  Summary

| Property  | Description                                                 |
| --------- | ----------------------------------------------------------- |
| Core idea | Nodes + pointers, dynamic connection                        |
| vs Array  | Fast insert/delete (O(1)), slow search (O(n))               |
| Pros      | Dynamic size, efficient middle insert/delete                |
| Cons      | No random access, must walk from head                       |
| Next      |  [Doubly Linked List — Go both ways](/doubly-linked-list) |

### LeetCode Practice

| #                                                           | Problem                | Difficulty |
| ----------------------------------------------------------- | ---------------------- | ---------- |
| [206](https://leetcode.com/problems/reverse-linked-list/)   | Reverse Linked List    |  Easy    |
| [141](https://leetcode.com/problems/linked-list-cycle/)     | Linked List Cycle      |  Easy    |
| [21](https://leetcode.com/problems/merge-two-sorted-lists/) | Merge Two Sorted Lists |  Easy    |

---

[ Back to Priority Queue](/priority-queue) · [Back to Home](/)
