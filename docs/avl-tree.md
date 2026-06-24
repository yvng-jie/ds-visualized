#  AVL Tree

> **A self-balancing Binary Search Tree where the height difference between left and right subtrees is at most 1** — Like a scale that always stays balanced

---

##  Concept

### Real-Life Analogy

<div class="analogy-box">

** Balance scale**: Imagine a scale with weights on both sides. If one side gets too heavy, you adjust by moving weights around. An AVL tree does the same — whenever a node makes the tree unbalanced, it "rotates" nodes to restore balance.

More examples:

- **Database indexing**: Many databases use self-balancing trees for fast lookups
- **File systems**: Directory structures that need consistent performance
- **Auto-complete**: When you need both fast insert and search

</div>

### Why AVL?

A regular BST can become skewed (like a linked list) if you insert sorted data. Searching a skewed BST is O(n). AVL trees guarantee O(log n) for all operations by **automatically balancing** after every insert/delete.

```
BST (skewed):       AVL (balanced):
  1                    20
   \                  /  \
    2               10    30
     \             / \   / \
      3           5  15 25  40
       \
        4
  Search: O(n)      Search: O(log n)
```

### Balance Factor

```
balance = height(left) - height(right)
```

A node is **balanced** if `|balance| ≤ 1`. If `|balance| > 1`, rotations are needed.

### Four Rotation Cases

| Case   |             Balance             | Description             | Fix                    |
| ------ | :-----------------------------: | ----------------------- | ---------------------- |
| **LL** |  > 1, inserted in left's left   | Left child is too tall  | Right rotate           |
| **RR** | < -1, inserted in right's right | Right child is too tall | Left rotate            |
| **LR** |  > 1, inserted in left's right  | Left-right imbalance    | Left then right rotate |
| **RL** | < -1, inserted in right's left  | Right-left imbalance    | Right then left rotate |

---

##  Code

```javascript
class AVLNode {
  constructor(key) {
    this.key = key
    this.left = null
    this.right = null
    this.height = 1
  }
}

class AVLTree {
  constructor() {
    this.root = null
  }

  getHeight(node) {
    return node ? node.height : 0
  }

  getBalance(node) {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0
  }

  // Right rotate: fixes LL case
  rotateRight(y) {
    const x = y.left
    const T2 = x.right
    x.right = y
    y.left = T2
    this.updateHeight(y)
    this.updateHeight(x)
    return x
  }

  // Left rotate: fixes RR case
  rotateLeft(x) {
    const y = x.right
    const T2 = y.left
    y.left = x
    x.right = T2
    this.updateHeight(x)
    this.updateHeight(y)
    return y
  }

  insert(key) {
    this.root = this._insert(this.root, key)
  }

  _insert(node, key) {
    if (!node) return new AVLNode(key)

    // 1. Standard BST insert
    if (key < node.key) node.left = this._insert(node.left, key)
    else if (key > node.key) node.right = this._insert(node.right, key)
    else return node // Duplicates not allowed

    // 2. Update height
    this.updateHeight(node)

    // 3. Check balance and rotate if needed
    const balance = this.getBalance(node)

    // LL case
    if (balance > 1 && key < node.left.key) return this.rotateRight(node)
    // RR case
    if (balance < -1 && key > node.right.key) return this.rotateLeft(node)
    // LR case
    if (balance > 1 && key > node.left.key) {
      node.left = this.rotateLeft(node.left)
      return this.rotateRight(node)
    }
    // RL case
    if (balance < -1 && key < node.right.key) {
      node.right = this.rotateRight(node.right)
      return this.rotateLeft(node)
    }

    return node // Already balanced
  }

  updateHeight(node) {
    node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right))
  }
}
```

---

##  Complexity

| Operation | AVL Tree | BST (worst) |
| --------- | :------: | :---------: |
| Search    | O(log n) |    O(n)     |
| Insert    | O(log n) |    O(n)     |
| Delete    | O(log n) |    O(n)     |

> **Space**: O(n) for the tree, plus O(log n) for the recursive call stack.

---

##  Visualization

<AVLTreeVisualizer />

---

##  Interview Questions

### 1. AVL Tree vs Red-Black Tree

> When would you choose AVL over Red-Black?

**Answer**: AVL trees are more strictly balanced, so lookups are faster (O(log n) with fewer comparisons). Red-Black trees require fewer rotations on insert/delete, making them faster for write-heavy workloads. **AVL → read-heavy, Red-Black → write-heavy.**

---

##  Common Pitfalls

| Mistake                                    | Why                                                                                  |
| ------------------------------------------ | ------------------------------------------------------------------------------------ |
| Forgetting to update height after rotation | Subsequent balance checks will be wrong                                              |
| Only checking balance at the root          | Imbalance can happen anywhere — check every node up the path                         |
| Confusing LR and RL cases                  | LR: trouble in left child's RIGHT subtree; RL: trouble in right child's LEFT subtree |

---

##  Decision Guide

| Scenario                    | Recommendation                              |
| --------------------------- | ------------------------------------------- |
| Read-heavy workload         |  AVL Tree (more balanced, faster lookups) |
| Write-heavy workload        |  Use Red-Black Tree instead               |
| Need guaranteed O(log n)    |  AVL Tree                                 |
| Small dataset (< 100 items) |  A simple array or BST is fine            |
