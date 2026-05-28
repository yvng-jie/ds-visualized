# 🔄 Deque (Double-Ended Queue)

> **Insert and remove from both ends** — Like a queue that's also a stack

---

## 📖 Concept

### Real-Life Analogy

<div class="analogy-box">

**🎢 Roller coaster line**: The ride operator says "We need two more people!" — people from both the front AND the back of the line can jump on.

More examples:

- **Browser history**: Go forward and backward
- **Sliding window maximum**: Efficiently track max in a moving window
- **Undo/Redo**: Operate from both ends of the history

</div>

### Deque = Queue + Stack

| Structure | Insert            | Remove             |
| --------- | ----------------- | ------------------ |
| Stack     | push at back      | pop from back      |
| Queue     | enqueue at back   | dequeue from front |
| **Deque** | **front OR back** | **front OR back**  |

---

## 💻 Code

```javascript
class Deque {
  constructor() {
    this.items = {}
    this.frontIndex = 0
    this.backIndex = 0
  }

  // Add to the front
  addFront(element) {
    this.frontIndex--
    this.items[this.frontIndex] = element
  }

  // Add to the back
  addBack(element) {
    this.items[this.backIndex] = element
    this.backIndex++
  }

  // Remove from the front
  removeFront() {
    if (this.isEmpty()) return undefined
    const result = this.items[this.frontIndex]
    delete this.items[this.frontIndex]
    this.frontIndex++
    return result
  }

  // Remove from the back
  removeBack() {
    if (this.isEmpty()) return undefined
    this.backIndex--
    const result = this.items[this.backIndex]
    delete this.items[this.backIndex]
    return result
  }

  peekFront() {
    return this.isEmpty() ? undefined : this.items[this.frontIndex]
  }
  peekBack() {
    return this.isEmpty() ? undefined : this.items[this.backIndex - 1]
  }
  isEmpty() {
    return this.frontIndex === this.backIndex
  }
  size() {
    return this.backIndex - this.frontIndex
  }
}
```

### Key Points

1. **Object + two pointers** — Uses an object with `frontIndex`/`backIndex` instead of an array, avoiding O(n) `shift()` operations
2. **`addFront()` is the unique superpower** — regular queues can't do this
3. **All operations are O(1)** — object property operations don't involve shifting

---

## ⏱ Complexity

| Operation       | Time        | Notes               |
| --------------- | ----------- | ------------------- |
| `addFront()`    | **O(1)** ✅ | Property assignment |
| `addBack()`     | **O(1)** ✅ | Property assignment |
| `removeFront()` | **O(1)** ✅ | Delete property     |
| `removeBack()`  | **O(1)** ✅ | Delete property     |

---

## 🧪 Interview Questions

### 1. Sliding Window Maximum

> Given an array and window size k, find the maximum in each window.

```javascript
function maxSlidingWindow(nums, k) {
  const deque = new Deque()
  const result = []
  for (let i = 0; i < nums.length; i++) {
    if (!deque.isEmpty() && deque.peekFront() < i - k + 1) deque.removeFront()
    while (!deque.isEmpty() && nums[deque.peekBack()] < nums[i]) deque.removeBack()
    deque.addBack(i)
    if (i >= k - 1) result.push(nums[deque.peekFront()])
  }
  return result
}
// [3, 3, 5, 5, 6, 7]
console.log(maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3))
```

### 2. Palindrome Checker

```javascript
function isPalindrome(str) {
  const deque = new Deque()
  for (const ch of str) deque.addBack(ch)
  while (deque.size() > 1) {
    if (deque.removeFront() !== deque.removeBack()) return false
  }
  return true
}
console.log(isPalindrome('racecar')) // true
console.log(isPalindrome('hello')) // false
```

---

## 📚 Summary

| Property        | Description                             |
| --------------- | --------------------------------------- |
| Core idea       | Insert and remove from both ends        |
| = Queue + Stack | Combines FIFO and LIFO                  |
| Key ops         | addFront/addBack/removeFront/removeBack |
| Time            | All O(1)                                |
| Use cases       | Sliding window, palindrome check        |

### LeetCode Practice

| #                                                            | Problem                | Difficulty |
| ------------------------------------------------------------ | ---------------------- | ---------- |
| [239](https://leetcode.com/problems/sliding-window-maximum/) | Sliding Window Maximum | 🔴 Hard    |
| [641](https://leetcode.com/problems/design-circular-deque/)  | Design Circular Deque  | 🟡 Medium  |

---

[⬅️ Back to Heap](/heap) · [Back to Home](/)
