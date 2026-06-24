---
title: Stack — LIFO Data Structure
description: Learn Stack data structure in JavaScript with visual animations. Complete guide with code, complexity analysis, and interview questions.
---

#  Stack

> **Last-In-First-Out (LIFO)** — The last item you put in is the first one you take out

---

##  Concept

### Real-Life Analogy

<div class="analogy-box">

** Stack of plates**: When you wash plates, you put the clean ones on top. When you need one, you grab from the top. The last plate you put on is the first one you take off. That's a stack.

More examples:

- **Browser back button**: Each page you visit gets "pushed" onto the stack. Hitting "back" "pops" the current page.
- **Undo (Ctrl+Z)**: Your editor tracks every change in a stack. Undo pops the last change.
- **Function calls**: The JavaScript engine uses a Call Stack to manage function execution.

</div>

### When to Use

-  Validating parentheses: `{[]()}`
-  Decimal to binary conversion
-  Expression evaluation
-  Undo/redo systems

---

##  Code

```javascript
class Stack {
  constructor() {
    this.items = []
  }

  // Push an element onto the top of the stack
  push(element) {
    this.items.push(element)
  }

  // Pop the top element off the stack and return it
  pop() {
    return this.items.pop()
  }

  // Peek at the top element without removing it
  peek() {
    if (this.isEmpty()) return undefined
    return this.items[this.items.length - 1]
  }

  // Check if the stack is empty
  isEmpty() {
    return this.items.length === 0
  }

  // Get the number of elements in the stack
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

1. **Array as a stack** — `push()` adds to the end, `pop()` removes from the end. It's a natural stack.
2. **Top of stack = end of array** — That's why `peek()` looks at `items[length - 1]`
3. **All operations are O(1)** — Adding/removing at the end of an array doesn't involve shifting elements

---

##  Complexity

| Operation   | Time        | Notes                |
| ----------- | ----------- | -------------------- |
| `push()`    | **O(1)**  | Add to end of array  |
| `pop()`     | **O(1)**  | Remove from end      |
| `peek()`    | **O(1)**  | Index lookup         |
| `isEmpty()` | **O(1)**  | Check length         |
| `size()`    | **O(1)**  | Read length property |

---

##  Visualization

<StackVisualizer />

---

##  Interview Questions

### 1. Valid Parentheses

> Given a string with `()`, `[]`, and `{}`, check if the brackets are valid.

```javascript
function isValid(s) {
  const stack = []
  const map = { ')': '(', ']': '[', '}': '{' }

  for (let char of s) {
    if (!map[char]) {
      // Opening bracket → push
      stack.push(char)
    } else {
      // Closing bracket → check if it matches the top
      if (stack.pop() !== map[char]) return false
    }
  }

  return stack.length === 0
}

console.log(isValid('()[]{}')) // true
console.log(isValid('([)]')) // false
console.log(isValid('{[]}')) // true
```

---

##  Summary

| Property  | Description                             |
| --------- | --------------------------------------- |
| Core idea | Last-In-First-Out (LIFO)                |
| Key ops   | push, pop, peek                         |
| Time      | All core ops O(1)                       |
| Next      |  [Queue — First-In-First-Out](/queue) |

### LeetCode Practice

| #                                                        | Problem            | Difficulty |
| -------------------------------------------------------- | ------------------ | ---------- |
| [20](https://leetcode.com/problems/valid-parentheses/)   | Valid Parentheses  |  Easy    |
| [155](https://leetcode.com/problems/min-stack/)          | Min Stack          |  Easy    |
| [739](https://leetcode.com/problems/daily-temperatures/) | Daily Temperatures |  Medium  |

---

[ Back to Home](/)
