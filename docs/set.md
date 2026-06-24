#  Set

> **Unique elements, no duplicates** — Like a bag of marbles where each color appears only once

---

##  Concept

### Real-Life Analogy

<div class="analogy-box">

** Paint set**: Each color appears once. You don't have two tubes of the exact same red.

More examples:

- **Class roster**: Each student appears only once
- **IP blacklist**: Each IP is listed once
- **Voting system**: Each person votes once (deduplication)

</div>

### Set Operations

| Operation          | Meaning                            | Example                   |
| ------------------ | ---------------------------------- | ------------------------- |
| **Union** ∪        | All elements from A and B combined | `{1,2} ∪ {2,3} = {1,2,3}` |
| **Intersection** ∩ | Elements that are in both A and B  | `{1,2} ∩ {2,3} = {2}`     |
| **Difference** -   | Elements in A but not in B         | `{1,2} - {2,3} = {1}`     |
| **Subset** ⊆       | All elements of A are also in B    | `{1,2} ⊆ {1,2,3}` → true  |

---

##  Code

```javascript
class Set {
  constructor() {
    this.items = {}
  }

  // Add an element (no duplicates)
  add(element) {
    if (this.has(element)) return false
    this.items[element] = element
    return true
  }

  // Remove an element
  remove(element) {
    if (!this.has(element)) return false
    delete this.items[element]
    return true
  }

  // Check if element exists
  has(element) {
    return Object.prototype.hasOwnProperty.call(this.items, element)
  }

  clear() {
    this.items = {}
  }
  size() {
    return Object.keys(this.items).length
  }
  values() {
    return Object.keys(this.items)
  }

  // Union: A ∪ B
  union(otherSet) {
    const unionSet = new Set()
    for (const v of this.values()) unionSet.add(v)
    for (const v of otherSet.values()) unionSet.add(v)
    return unionSet
  }

  // Intersection: A ∩ B
  intersection(otherSet) {
    const result = new Set()
    for (const v of this.values()) {
      if (otherSet.has(v)) result.add(v)
    }
    return result
  }

  // Difference: A - B
  difference(otherSet) {
    const result = new Set()
    for (const v of this.values()) {
      if (!otherSet.has(v)) result.add(v)
    }
    return result
  }

  // Subset: A ⊆ B ?
  subset(otherSet) {
    for (const v of this.values()) {
      if (!otherSet.has(v)) return false
    }
    return true
  }
}
```

### Key Points

1. **Built on an object** — uses object keys to enforce uniqueness
2. **`has()` uses `hasOwnProperty`** — safer than `in`, doesn't check prototype chain
3. **Union = add everything together** — `add()` automatically skips duplicates
4. **Intersection = find common elements** — loop through A, check if in B

---

##  Complexity

| Operation                | Time        | Notes               |
| ------------------------ | ----------- | ------------------- |
| `add()`                  | **O(1)**  | Property assignment |
| `remove()`               | **O(1)**  | `delete` operator   |
| `has()`                  | **O(1)**  | Property check      |
| `union()/intersection()` | **O(n)**  | Must iterate        |

---

##  Interview Questions

### 1. Array Deduplication

```javascript
function unique(arr) {
  const set = new Set()
  for (const item of arr) set.add(item)
  return set.values()
}

console.log(unique([1, 2, 2, 3, 3, 3])) // ['1', '2', '3']
```

---

##  Summary

| Property      | Description                                             |
| ------------- | ------------------------------------------------------- |
| Core idea     | Unique elements, set operations                         |
| Key ops       | add, remove, has + union/intersection/difference/subset |
| vs Dictionary | A Set is like a Dictionary with only keys (no values)   |
| Next          |  [Hash Table — Fast key-value storage](/hash-table)   |

### LeetCode Practice

| #                                                                  | Problem                      | Difficulty |
| ------------------------------------------------------------------ | ---------------------------- | ---------- |
| [217](https://leetcode.com/problems/contains-duplicate/)           | Contains Duplicate           |  Easy    |
| [349](https://leetcode.com/problems/intersection-of-two-arrays/)   | Intersection of Two Arrays   |  Easy    |
| [128](https://leetcode.com/problems/longest-consecutive-sequence/) | Longest Consecutive Sequence |  Medium  |

---

[ Back to Dictionary](/dictionary) · [Back to Home](/)
