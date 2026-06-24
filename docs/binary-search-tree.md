---
title: Binary Search Tree (BST) — Data Structure
description: Learn BST in JavaScript with interactive visualizer. Complete guide with insert, delete, traversal operations, complexity, and interview questions.
---

#  Binary Search Tree (BST)

> **Left child < parent < right child** — Like binary search, but as a tree

---

##  Concept

### Real-Life Analogy

<div class="analogy-box">

** File cabinet**: In a filing cabinet, files starting with A-M go in the left drawer, N-Z in the right drawer. To find "Data Structures", you go to the left drawer (before M), then look under "D" — you never need to search the right drawer.

More examples:

- **Dictionary search**: Open to the middle — too big? Go left. Too small? Go right.
- **Git version tree**: Each commit branches off from a parent
- **DOM tree**: HTML documents are tree structures

</div>

### Why Trees?

```
Array:    [1, 3, 5, 7, 9, 11, 13]   Binary search O(log n), but insert/delete O(n)
Linked List: 1 → 3 → 5 → 7 → 9 → 11 → 13  Insert O(1), but search O(n)
BST:                                    Both search AND insert are O(log n)!
```

BST combines the best of both: fast search (like binary search on an array) and fast insertion (like a linked list).

---

##  Code

```javascript
class Node {
  constructor(key) {
    this.key = key
    this.left = null
    this.right = null
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null
  }

  // Insert a key
  insert(key) {
    const node = new Node(key)
    if (this.root === null) {
      this.root = node
    } else {
      this._insertNode(this.root, node)
    }
  }

  _insertNode(node, newNode) {
    if (newNode.key < node.key) {
      if (node.left === null) node.left = newNode
      else this._insertNode(node.left, newNode)
    } else {
      if (node.right === null) node.right = newNode
      else this._insertNode(node.right, newNode)
    }
  }

  // Search for a key
  search(key) {
    return this._searchNode(this.root, key)
  }

  _searchNode(node, key) {
    if (node === null) return false
    if (key < node.key) return this._searchNode(node.left, key)
    if (key > node.key) return this._searchNode(node.right, key)
    return true
  }

  // Three traversal methods

  // Pre-order: root → left → right
  preOrderTraversal(handler) {
    this._preOrder(this.root, handler)
  }
  _preOrder(node, handler) {
    if (node) {
      handler(node.key)
      this._preOrder(node.left, handler)
      this._preOrder(node.right, handler)
    }
  }

  // In-order: left → root → right (gives sorted order!)
  midOrderTraversal(handler) {
    this._midOrder(this.root, handler)
  }
  _midOrder(node, handler) {
    if (node) {
      this._midOrder(node.left, handler)
      handler(node.key)
      this._midOrder(node.right, handler)
    }
  }

  // Post-order: left → right → root
  postOrderTraversal(handler) {
    this._postOrder(this.root, handler)
  }
  _postOrder(node, handler) {
    if (node) {
      this._postOrder(node.left, handler)
      this._postOrder(node.right, handler)
      handler(node.key)
    }
  }

  // Min / Max
  min() {
    if (!this.root) return null
    let node = this.root
    while (node.left) node = node.left
    return node.key
  }

  max() {
    if (!this.root) return null
    let node = this.root
    while (node.right) node = node.right
    return node.key
  }

  // Remove a node (the trickiest operation)
  remove(key) {
    let current = this.root,
      parent = null,
      isLeftChild = true

    // Find the node to delete
    while (current && current.key !== key) {
      parent = current
      if (key < current.key) {
        isLeftChild = true
        current = current.left
      } else {
        isLeftChild = false
        current = current.right
      }
    }
    if (!current) return false

    // Case 1: leaf node (no children)
    if (!current.left && !current.right) {
      if (current === this.root) this.root = null
      else if (isLeftChild) parent.left = null
      else parent.right = null
    }
    // Case 2: one child
    else if (!current.right) {
      if (current === this.root) this.root = current.left
      else if (isLeftChild) parent.left = current.left
      else parent.right = current.left
    } else if (!current.left) {
      if (current === this.root) this.root = current.right
      else if (isLeftChild) parent.left = current.right
      else parent.right = current.right
    }
    // Case 3: two children → find successor (smallest in right subtree)
    else {
      const successor = this._getSuccessor(current)
      if (current === this.root) this.root = successor
      else if (isLeftChild) parent.left = successor
      else parent.right = successor
      successor.left = current.left
    }
    return true
  }

  _getSuccessor(delNode) {
    let successor = delNode,
      current = delNode.right,
      successorParent = delNode
    while (current) {
      successorParent = successor
      successor = current
      current = current.left
    }
    if (successor !== delNode.right) {
      successorParent.left = successor.right
      successor.right = delNode.right
    }
    return successor
  }
}
```

### Key Points

1. **Insert rule**: Smaller → go left, larger or equal → go right
2. **3 traversals**: Pre (root first), In (sorted!), Post (root last)
3. **In-order = sorted output** — this is the superpower of BST
4. **Delete is complex** — 3 cases: leaf, one child, two children
5. **Successor** = smallest node in the right subtree (used for case 3)

---

##  Complexity

| Operation  | Average         | Worst | Notes                                  |
| ---------- | --------------- | ----- | -------------------------------------- |
| `insert()` | **O(log n)**  | O(n)  | Degenerates when inserting sorted data |
| `search()` | **O(log n)**  | O(n)  |                                        |
| Traversal  | **O(n)**      | O(n)  | Visits every node                      |

<div class="tip-box">

** Degeneration**: Inserting `[1,2,3,4,5]` in order makes the BST a linked list! Solution: balanced trees like AVL or Red-Black trees.

</div>

---

##  Visualization

<BSTVisualizer />

---

##  Interview Questions

### 1. Validate BST

```javascript
function isValidBST(root, min = null, max = null) {
  if (!root) return true
  if (min !== null && root.key <= min) return false
  if (max !== null && root.key >= max) return false
  return isValidBST(root.left, min, root.key) && isValidBST(root.right, root.key, max)
}
```

### 2. Max Depth

```javascript
function maxDepth(root) {
  if (!root) return 0
  return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1
}
```

---

##  Summary

| Property     | Description                                                                  |
| ------------ | ---------------------------------------------------------------------------- |
| Core idea    | Left < parent < right — binary search in tree form                           |
| 3 traversals | Pre (root-left-right), In (left-root-right = sorted), Post (left-right-root) |
| Pros         | Search and insert both O(log n) average                                      |
| Cons         | Can degenerate to O(n)                                                       |
| Next         |  [Heap — Priority queue done right](/heap)                                 |

### LeetCode Practice

| #                                                                   | Problem             | Difficulty |
| ------------------------------------------------------------------- | ------------------- | ---------- |
| [98](https://leetcode.com/problems/validate-binary-search-tree/)    | Validate BST        |  Medium  |
| [104](https://leetcode.com/problems/maximum-depth-of-binary-tree/)  | Max Depth           |  Easy    |
| [230](https://leetcode.com/problems/kth-smallest-element-in-a-bst/) | Kth Smallest in BST |  Medium  |

---

[ Back to Hash Table](/hash-table) · [Back to Home](/)
