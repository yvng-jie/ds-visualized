#  Dictionary

> **Key-Value storage** — Like a real dictionary: look up a word (key), get its definition (value)

---

##  Concept

### Real-Life Analogy

<div class="analogy-box">

** Phone book**: You look up a person's name (key) and find their phone number (value). You don't need to remember which page they're on — just search by name.

More examples:

- **Configuration**: Setting name (key) → setting value (value)
- **ID card**: ID number (key) → personal info (value)
- **Cache**: URL (key) → cached response (value)

</div>

### Array vs Dictionary

| Property | Array                | Dictionary                        |
| -------- | -------------------- | --------------------------------- |
| Index    | Numeric (0, 1, 2...) | Any type (string, number, object) |
| Lookup   | By index or loop     | Directly by key                   |
| Use case | Ordered lists        | Key-value mapping                 |

---

##  Code

```javascript
class Dictionary {
  constructor() {
    this.items = {}
  }

  // Set a key-value pair
  set(key, value) {
    this.items[key] = value
  }

  // Check if a key exists
  has(key) {
    return key in this.items
  }

  // Remove a key-value pair
  remove(key) {
    if (!this.has(key)) return false
    delete this.items[key]
    return true
  }

  // Get a value by key
  get(key) {
    return this.has(key) ? this.items[key] : undefined
  }

  // Get all keys
  keys() {
    return Object.keys(this.items)
  }

  // Get all values
  values() {
    return Object.values(this.items)
  }

  // Get the number of items
  size() {
    return Object.keys(this.items).length
  }

  // Clear everything
  clear() {
    this.items = {}
  }
}
```

### Key Points

1. **Wraps a JS object** — `this.items = {}` uses JavaScript's built-in key-value feature
2. **`key in object` checks existence** — more reliable than `obj[key] !== undefined`
3. ** Gotcha**: Object keys are always strings. `set(1, 'a')` and `set('1', 'a')` will overwrite each other!

---

##  Complexity

| Operation  | Time        | Notes               |
| ---------- | ----------- | ------------------- |
| `set()`    | **O(1)**  | Property assignment |
| `get()`    | **O(1)**  | Property access     |
| `has()`    | **O(1)**  | `in` operator       |
| `remove()` | **O(1)**  | `delete` operator   |

---

##  Interview Questions

### 1. Two Sum

> Given an array of numbers and a target, find two numbers that add up to the target.

```javascript
function twoSum(nums, target) {
  const dict = new Dictionary()

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i]

    if (dict.has(complement)) {
      return [dict.get(complement), i]
    }
    dict.set(nums[i], i)
  }
  return []
}

console.log(twoSum([2, 7, 11, 15], 9)) // [0, 1]
```

---

##  Summary

| Property   | Description                                                      |
| ---------- | ---------------------------------------------------------------- |
| Core idea  | Key-value mapping                                                |
| Key ops    | set (store), get (retrieve), has (check)                         |
| Time       | All core ops O(1)                                                |
| Limitation | Keys become strings automatically                                |
| Next       |  [Hash Table — A faster, hand-crafted Dictionary](/hash-table) |

### LeetCode Practice

| #                                                   | Problem        | Difficulty |
| --------------------------------------------------- | -------------- | ---------- |
| [1](https://leetcode.com/problems/two-sum/)         | Two Sum        |  Easy    |
| [242](https://leetcode.com/problems/valid-anagram/) | Valid Anagram  |  Easy    |
| [49](https://leetcode.com/problems/group-anagrams/) | Group Anagrams |  Medium  |

---

[ Back to Priority Queue](/priority-queue) · [Back to Home](/)
