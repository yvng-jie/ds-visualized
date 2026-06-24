#  Union-Find (Disjoint Set)

> **Track connected components efficiently** — Like grouping friends by who knows who

---

##  Concept

### Real-Life Analogy

<div class="analogy-box">

** Social network**: When two people become friends, their friend groups merge. Union-Find tracks which group each person belongs to, and can quickly answer "are these two people connected?"

More examples:

- **Maze generation**: Tracking which cells are connected
- **Network connectivity**: Are two computers in the same network?
- **Image processing**: Connected component labeling

</div>

### Key Operations

| Operation           | Description                             |  Time   |
| ------------------- | --------------------------------------- | :-----: |
| **find(x)**         | Find the root/representative of x's set | O(α(n)) |
| **union(x, y)**     | Merge the sets containing x and y       | O(α(n)) |
| **connected(x, y)** | Check if x and y are in the same set    | O(α(n)) |

> α(n) is the inverse Ackermann function — practically O(1) for any reasonable input size.

### Optimizations

1. **Path compression**: During `find`, make every node point directly to the root
2. **Union by rank**: Attach shorter tree under taller tree

---

##  Code

```javascript
class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i)
    this.rank = new Array(n).fill(0)
    this.setCount = n
  }

  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]) // Path compression
    }
    return this.parent[x]
  }

  union(x, y) {
    const rootX = this.find(x)
    const rootY = this.find(y)
    if (rootX === rootY) return false

    // Union by rank
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX
    } else {
      this.parent[rootY] = rootX
      this.rank[rootX]++
    }

    this.setCount--
    return true
  }

  connected(x, y) {
    return this.find(x) === this.find(y)
  }

  count() {
    return this.setCount
  }
}
```

---

##  Complexity

| Operation | Without Optimization | With Path Compression + Union by Rank |
| --------- | :------------------: | :-----------------------------------: |
| find      |         O(n)         |                O(α(n))                |
| union     |         O(n)         |                O(α(n))                |
| connected |         O(n)         |                O(α(n))                |

> **Space**: O(n) for parent and rank arrays.

---

##  Interview Questions

### 1. Number of Provinces

> **LeetCode 547**: Find the number of friend circles (connected components).

```javascript
function findCircleNum(isConnected) {
  const n = isConnected.length
  const uf = new UnionFind(n)

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (isConnected[i][j]) uf.union(i, j)
    }
  }

  return uf.count()
}
```

---

##  Common Pitfalls

| Mistake                                    | Why                                                                 |
| ------------------------------------------ | ------------------------------------------------------------------- |
| Forgetting path compression                | Without it, `find` can be O(n)                                      |
| Not using union by rank                    | Can lead to tall trees and slow finds                               |
| Modifying parent without updating children | Path compression is safe — it only changes parents to point to root |

---

##  Decision Guide

| Scenario                                | Recommendation                   |
| --------------------------------------- | -------------------------------- |
| Dynamic connectivity tracking           |  Union-Find                    |
| Need to merge sets and query membership |  Union-Find                    |
| Small, static dataset                   |  A simple array or Set is fine |
