# 🌳 二叉搜索树 BST

> **左子节点 < 父节点 < 右子节点** — 像二分查找的树形结构

---

## 📖 概念介绍

### 现实类比

<div class="analogy-box">

**📂 文件目录**：文件夹里，文件名小于"中"的放左边抽屉，大于"中"的放右边抽屉。要找"大"字开头的文件？直接去左边抽屉，不用翻右边。

其他例子：

- **字典查找**：查单词时，翻到中间——比目标大就往左翻，比目标小就往右翻
- **Git 版本树**：每次提交形成一棵树
- **DOM 树**：HTML 文档的树形结构

</div>

### 为什么用树？

```
数组查找：   [1, 3, 5, 7, 9, 11, 13]  二分查找 O(log n)，但插入删除 O(n)
链表查找：    1 → 3 → 5 → 7 → 9 → 11 → 13  插入 O(1)，但查找 O(n)
BST 查找：       🌳 树结构            查找和插入都是 O(log n)！
```

BST 结合了数组的快速查找和链表的快速插入。

---

## 💻 实现代码

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

  // 🌳 插入节点
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
      // 比当前节点小 → 放左边
      if (node.left === null) {
        node.left = newNode
      } else {
        this._insertNode(node.left, newNode)
      }
    } else {
      // 比当前节点大（或相等）→ 放右边
      if (node.right === null) {
        node.right = newNode
      } else {
        this._insertNode(node.right, newNode)
      }
    }
  }

  // 🔍 查找
  search(key) {
    return this._searchNode(this.root, key)
  }

  _searchNode(node, key) {
    if (node === null) return false
    if (key < node.key) return this._searchNode(node.left, key)
    if (key > node.key) return this._searchNode(node.right, key)
    return true // 找到了
  }

  // 🌲 三种遍历方式

  // 1️⃣ 先序遍历：根 → 左 → 右
  preOrderTraversal(handler) {
    this._preOrderTraversalNode(this.root, handler)
  }
  _preOrderTraversalNode(node, handler) {
    if (node) {
      handler(node.key) // 先处理根
      this._preOrderTraversalNode(node.left, handler) // 再左
      this._preOrderTraversalNode(node.right, handler) // 再右
    }
  }

  // 2️⃣ 中序遍历：左 → 根 → 右（输出有序序列）
  midOrderTraversal(handler) {
    this._midOrderTraversalNode(this.root, handler)
  }
  _midOrderTraversalNode(node, handler) {
    if (node) {
      this._midOrderTraversalNode(node.left, handler)
      handler(node.key) // 处理根
      this._midOrderTraversalNode(node.right, handler)
    }
  }

  // 3️⃣ 后序遍历：左 → 右 → 根
  postOrderTraversal(handler) {
    this._postOrderTraversalNode(this.root, handler)
  }
  _postOrderTraversalNode(node, handler) {
    if (node) {
      this._postOrderTraversalNode(node.left, handler) // 先左
      this._postOrderTraversalNode(node.right, handler) // 再右
      handler(node.key) // 最后根
    }
  }

  // ⬇️ 最小值（最左边的节点）
  min() {
    if (!this.root) return null
    let node = this.root
    while (node.left) node = node.left
    return node.key
  }

  // ⬆️ 最大值（最右边的节点）
  max() {
    if (!this.root) return null
    let node = this.root
    while (node.right) node = node.right
    return node.key
  }

  // 🗑️ 删除节点（最复杂的操作）
  remove(key) {
    let current = this.root
    let parent = null
    let isLeftChild = true

    // 1️⃣ 查找要删除的节点
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

    // 2️⃣ 删除 - 三种情况

    // 情况1：叶子节点（没有子节点）
    if (!current.left && !current.right) {
      if (current === this.root) this.root = null
      else if (isLeftChild) parent.left = null
      else parent.right = null
    }
    // 情况2：只有一个子节点
    else if (!current.right) {
      if (current === this.root) this.root = current.left
      else if (isLeftChild) parent.left = current.left
      else parent.right = current.left
    } else if (!current.left) {
      if (current === this.root) this.root = current.right
      else if (isLeftChild) parent.left = current.right
      else parent.right = current.right
    }
    // 情况3：有两个子节点 → 找后继节点替换
    else {
      const successor = this._getSuccessor(current)
      if (current === this.root) this.root = successor
      else if (isLeftChild) parent.left = successor
      else parent.right = successor
      successor.left = current.left
    }
    return true
  }

  // 查找后继节点（右子树中最小的节点）
  _getSuccessor(delNode) {
    let successor = delNode
    let current = delNode.right
    let successorParent = delNode

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

### 代码要点

1. **插入规则** — 比当前小走左边，比当前大（或相等）走右边
2. **三种遍历** — 先序/中序/后序的区别在于**处理根节点的时机**
3. **中序遍历 = 排序输出** — BST 的中序遍历就是升序序列
4. **删除最复杂** — 分三种情况：叶子节点 / 一个子节点 / 两个子节点
5. **后继节点** — 删除有两个子节点的节点时，用**右子树中最小的节点**替换它

---

## 🎨 可视化演示

<BSTVisualizer />

---

## ⏱ 复杂度分析

| 操作       | 平均            | 最坏 | 说明                       |
| ---------- | --------------- | ---- | -------------------------- |
| `insert()` | **O(log n)** ✅ | O(n) | 树退化时（如插入有序序列） |
| `search()` | **O(log n)** ✅ | O(n) | 平衡时 log n，退化时变链表 |
| `remove()` | **O(log n)** ✅ | O(n) | 同上                       |
| 遍历       | **O(n)** ⚠️     | O(n) | 需要访问所有节点           |

<div class="tip-box">

**⚠️ 退化问题**：如果按顺序插入 `[1,2,3,4,5]`，BST 会退化成链表，查找变成 O(n)。解决方案是**平衡二叉树**（AVL 树、红黑树），后续会介绍。

</div>

---

## 🧪 常见面试题

### 1. 验证二叉搜索树

```javascript
function isValidBST(root, min = null, max = null) {
  if (!root) return true

  if (min !== null && root.key <= min) return false
  if (max !== null && root.key >= max) return false

  return isValidBST(root.left, min, root.key) && isValidBST(root.right, root.key, max)
}
```

### 2. 二叉树的最大深度

```javascript
function maxDepth(root) {
  if (!root) return 0
  return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1
}
```

---

## 📚 总结

| 特性       | 说明                                                |
| ---------- | --------------------------------------------------- |
| 核心思想   | 左小右大，二分查找的树形实现                        |
| 三种遍历   | 先序（根左右）、中序（左根右=有序）、后序（左右根） |
| 优点       | 查找和插入都是 O(log n)                             |
| 缺点       | 可能退化为链表 O(n)                                 |
| 下一步学习 | 👉 [图 — 更复杂的关系网络](/graph)                  |

---

### LeetCode 练手题

| 题号                                                                | 题目                    | 难度    |
| ------------------------------------------------------------------- | ----------------------- | ------- |
| [98](https://leetcode.cn/problems/validate-binary-search-tree/)     | 验证二叉搜索树          | 🟡 中等 |
| [104](https://leetcode.cn/problems/maximum-depth-of-binary-tree/)   | 二叉树的最大深度        | 🟢 简单 |
| [230](https://leetcode.cn/problems/kth-smallest-element-in-a-bst/)  | 二叉搜索树中第K小的元素 | 🟡 中等 |
| [700](https://leetcode.cn/problems/search-in-a-binary-search-tree/) | 二叉搜索树中的搜索      | 🟢 简单 |

[⬅️ 返回哈希表](/hash-table) · [返回首页](/)
