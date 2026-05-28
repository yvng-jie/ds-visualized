# 🕸️ Graph

> **A network of vertices (nodes) connected by edges** — Like a social network of friends

---

## 📖 Concept

### Real-Life Analogy

<div class="analogy-box">

**🌐 Social network**: Each person is a "vertex", each friendship is an "edge". How many connections between you and someone famous? That's a graph traversal problem.

More examples:

- **GPS navigation**: Intersections = vertices, roads = edges, shortest path = graph algorithm
- **The internet**: Web pages = vertices, hyperlinks = edges
- **Recommendation systems**: Users and products form a bipartite graph

</div>

### Graph Terminology

| Term           | Meaning                           | Analogy                      |
| -------------- | --------------------------------- | ---------------------------- |
| **Vertex**     | A node in the graph               | A person in a social network |
| **Edge**       | Connection between two vertices   | A friendship                 |
| **Adjacent**   | Two vertices connected by an edge | Alice and Bob are friends    |
| **Path**       | Sequence of edges from A to B     | Alice → Bob → Charlie        |
| **Undirected** | Edges have no direction           | Facebook friends (mutual)    |
| **Directed**   | Edges have a direction            | Twitter follows (one-way)    |

### Adjacency List (how we'll store it)

```
    A → B → C
    B → A → E
    C → A → D → G
    D → C
    E → B
```

Each vertex has a list of its neighbors. This is memory-efficient for sparse graphs.

---

## 💻 Code

```javascript
class Graph {
  constructor() {
    this.vertexes = [] // all vertices
    this.edges = {} // adjacency list: vertex → [neighbors]
  }

  // Add a vertex
  addVertex(v) {
    this.vertexes.push(v)
    this.edges[v] = []
  }

  // Add an edge (undirected)
  addEdge(v1, v2) {
    this.edges[v1].push(v2)
    this.edges[v2].push(v1)
  }

  // Print adjacency list
  toString() {
    let result = ''
    for (const v of this.vertexes) {
      result += v + ' → ' + this.edges[v].join(' ') + '\n'
    }
    return result
  }

  // Initialize colors for traversal
  _initColor() {
    const colors = {}
    for (const v of this.vertexes) colors[v] = 'white' // white = unvisited
    return colors
  }

  // 🌊 BFS - Breadth-First Search (layer by layer)
  bfs(start, handler) {
    const colors = this._initColor()
    const queue = [start]

    while (queue.length > 0) {
      const v = queue.shift()
      const neighbors = this.edges[v]
      colors[v] = 'gray' // discovered

      for (const n of neighbors) {
        if (colors[n] === 'white') {
          colors[n] = 'gray'
          queue.push(n)
        }
      }

      handler(v)
      colors[v] = 'black' // explored
    }
  }

  // 🧗 DFS - Depth-First Search (go deep first)
  dfs(start, handler) {
    const colors = this._initColor()
    this._dfsVisit(start, colors, handler)
  }

  _dfsVisit(v, colors, handler) {
    colors[v] = 'gray'
    handler(v)
    for (const n of this.edges[v]) {
      if (colors[n] === 'white') {
        this._dfsVisit(n, colors, handler)
      }
    }
    colors[v] = 'black'
  }
}
```

### Key Points

1. **Adjacency list**: `{ A: ['B', 'C'], B: ['A', 'E'], ... }` — each vertex has a neighbor list
2. **Undirected graph**: `addEdge` adds two directions (v1→v2 AND v2→v1)
3. **3-color system**: white (unvisited), gray (discovered), black (explored)
4. **BFS uses a queue** — layer by layer, great for shortest path
5. **DFS uses recursion** — goes deep first, great for connectivity

### BFS vs DFS

```
BFS (queue):                          DFS (recursion):
     A                                      A
    / \                                    / \
   B   C                                  B   C
  /     \                                /     \
 D       E                              D       E

Order: A → B → C → D → E               Order: A → B → D → E → C
Use: shortest path                      Use: connectivity, maze solving
```

---

## ⏱ Complexity

| Operation | Time         | Notes                             |
| --------- | ------------ | --------------------------------- |
| BFS       | **O(V + E)** | Each vertex and edge visited once |
| DFS       | **O(V + E)** | Same as BFS                       |

> V = number of vertices, E = number of edges

---

## 🎨 Visualization

<GraphVisualizer />

---

## 🧪 Interview Questions

### 1. Has Path (BFS)

```javascript
function hasPath(graph, start, target) {
  if (start === target) return true
  const visited = new Set()
  const queue = [start]
  visited.add(start)
  while (queue.length > 0) {
    const v = queue.shift()
    for (const n of graph.edges[v]) {
      if (n === target) return true
      if (!visited.has(n)) {
        visited.add(n)
        queue.push(n)
      }
    }
  }
  return false
}
```

---

## 📚 Summary

| Property     | Description                                              |
| ------------ | -------------------------------------------------------- |
| Core idea    | Vertices + edges = relationships                         |
| Storage      | Adjacency list (or adjacency matrix)                     |
| 2 traversals | BFS (queue, layer by layer) and DFS (recursion, go deep) |
| 3 colors     | White = unvisited, Gray = discovered, Black = explored   |
| 🎉           | **You've completed all the core data structures!**       |

### LeetCode Practice

| #                                                       | Problem           | Difficulty |
| ------------------------------------------------------- | ----------------- | ---------- |
| [200](https://leetcode.com/problems/number-of-islands/) | Number of Islands | 🟡 Medium  |
| [207](https://leetcode.com/problems/course-schedule/)   | Course Schedule   | 🟡 Medium  |
| [133](https://leetcode.com/problems/clone-graph/)       | Clone Graph       | 🟡 Medium  |

---

[⬅️ Back to BST](/binary-search-tree) · [Back to Home](/)
