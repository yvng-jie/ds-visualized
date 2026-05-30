# 📊 Graph Representation

> **Adjacency Matrix vs Adjacency List** — Two ways to store a graph

---

## 📖 Concept

### The Trade-off

| Property          | Adjacency Matrix | Adjacency List |
| ----------------- | :--------------: | :------------: |
| Space             |      O(V²)       |    O(V + E)    |
| Edge check        |       O(1)       |   O(degree)    |
| Iterate neighbors |       O(V)       |   O(degree)    |
| Add edge          |       O(1)       |      O(1)      |
| Remove edge       |       O(1)       |   O(degree)    |
| Best for          |   Dense graphs   | Sparse graphs  |

### Visual Comparison

```
Adjacency Matrix:                Adjacency List:
   A  B  C  D  E                 A → [B, D]
A  0  1  0  1  0                 B → [A, C, D]
B  1  0  1  1  0                 C → [B, E]
C  0  1  0  0  1                 D → [A, B, E]
D  1  1  0  0  1                 E → [C, D]
E  0  0  1  1  0
```

### When to Use Which

| Graph Type     | V     | E      | Best Representation       |
| -------------- | ----- | ------ | ------------------------- |
| Dense          | 100   | ~4,950 | Matrix (O(1) edge checks) |
| Sparse         | 1,000 | ~5,000 | List (efficient space)    |
| Social network | 1M    | ~10M   | List (very sparse)        |
| Complete graph | 50    | 1,225  | Either is fine            |

---

## 💻 Code

### Adjacency Matrix

```javascript
class AdjacencyMatrix {
  constructor(size) {
    this.size = size
    this.matrix = Array.from({ length: size }, () => new Array(size).fill(0))
  }

  addEdge(u, v, weight = 1) {
    this.matrix[u][v] = weight
    this.matrix[v][u] = weight // Undirected
  }

  hasEdge(u, v) {
    return this.matrix[u][v] !== 0
  }
  neighbors(v) {
    const result = []
    for (let i = 0; i < this.size; i++) {
      if (this.matrix[v][i] !== 0) result.push(i)
    }
    return result
  }
}
```

### Adjacency List

```javascript
class AdjacencyList {
  constructor(size) {
    this.size = size
    this.list = Array.from({ length: size }, () => [])
  }

  addEdge(u, v, weight = 1) {
    this.list[u].push({ to: v, weight })
    this.list[v].push({ to: u, weight }) // Undirected
  }

  hasEdge(u, v) {
    return this.list[u].some((e) => e.to === v)
  }
  neighbors(v) {
    return this.list[v].map((e) => e.to)
  }
}
```

---

## ⏱ Complexity

| Operation         | Matrix |   List    |
| ----------------- | :----: | :-------: |
| Edge check        |  O(1)  | O(degree) |
| Iterate neighbors |  O(V)  | O(degree) |
| Add vertex        | O(V²)  |  O(1)\*   |
| Remove vertex     | O(V²)  |   O(E)    |
| Space             | O(V²)  | O(V + E)  |

---

## 🧪 Interview Questions

### 1. When is a Matrix better than a List?

**Answer**: When the graph is dense (E ≈ V²) or when you need very fast edge existence checks (O(1)). For example, Floyd-Warshall algorithm uses a matrix because it needs O(1) access to all pairs.

---

## 💡 Decision Guide

| Scenario                      | Recommendation                        |
| ----------------------------- | ------------------------------------- |
| Dense graph                   | ✅ Adjacency Matrix                   |
| Sparse graph                  | ✅ Adjacency List                     |
| Need fast edge checks         | ✅ Matrix                             |
| Memory constrained            | ✅ List                               |
| Need to iterate all neighbors | ✅ List (only touches existing edges) |
