#  图 Graph

> **由顶点（Vertex）和边（Edge）组成的关系网络** — 像社交网络的好友关系

---

##  概念介绍

### 现实类比

<div class="analogy-box">

** 社交网络**：每个人是一个"顶点"，好友关系是一条"边"。你想知道 A 和 B 之间有多少层关系？这就是图的遍历问题。

其他例子：

- **地图导航**：路口是顶点，道路是边，求最短路径
- **互联网**：网页是顶点，超链接是边
- **推荐系统**：用户和商品组成二分图

</div>

### 图的术语

| 术语               | 含义                           | 类比               |
| ------------------ | ------------------------------ | ------------------ |
| **顶点（Vertex）** | 图中的节点                     | 社交网络中的每个人 |
| **边（Edge）**     | 顶点之间的连接                 | 好友关系           |
| **邻接**           | 两个顶点之间有边相连           | A 和 B 是好友      |
| **路径**           | 从一个顶点到另一个经过的边序列 | A → B → C          |
| **无向图**         | 边没有方向                     | 微信好友（双向）   |
| **有向图**         | 边有方向                       | 微博关注（单向）   |

### 图的表示方式

```
邻接矩阵：                           邻接表：
    A  B  C  D  E                   A → B → C
A  [0, 1, 1, 0, 0]                  B → A → E
B  [1, 0, 0, 0, 1]                  C → A → D → G
C  [1, 0, 0, 1, 0]                  D → C
D  [0, 0, 1, 0, 0]                  E → B
E  [0, 1, 0, 0, 0]
```

本教程用**邻接表**实现，因为：

- 稀疏图（边少）时更省内存
- 遍历某个顶点的邻居更高效

---

##  实现代码

```javascript
class Graph {
  constructor() {
    this.vertexes = [] // 存储所有顶点
    this.edges = {} // 邻接表：顶点名 → 相邻顶点列表
  }

  //  添加顶点
  addVertex(v) {
    this.vertexes.push(v)
    this.edges[v] = []
  }

  //  添加边（无向图）
  addEdge(v1, v2) {
    this.edges[v1].push(v2)
    this.edges[v2].push(v1)
  }

  //  打印邻接表
  toString() {
    let result = ''
    for (let i = 0; i < this.vertexes.length; i++) {
      const v = this.vertexes[i]
      result += v + ' → ' + this.edges[v].join(' ') + '\n'
    }
    return result
  }

  //  初始化顶点颜色（用于遍历）
  _initializeColor() {
    const colors = {}
    for (let i = 0; i < this.vertexes.length; i++) {
      colors[this.vertexes[i]] = 'white' // 白色：未访问
    }
    return colors
  }

  //  BFS - 广度优先搜索（层层扩散）
  bfs(initV, handler) {
    const colors = this._initializeColor()
    const queue = [initV] // 用数组模拟队列

    while (queue.length > 0) {
      const v = queue.shift()
      const vList = this.edges[v]

      colors[v] = 'gray' // 灰色：已访问

      // 遍历所有邻居
      for (let i = 0; i < vList.length; i++) {
        const e = vList[i]
        if (colors[e] === 'white') {
          colors[e] = 'gray'
          queue.push(e)
        }
      }

      handler(v) // 处理当前顶点
      colors[v] = 'black' // 黑色：已探索完成
    }
  }

  //  DFS - 深度优先搜索（一条路走到底）
  dfs(initV, handler) {
    const colors = this._initializeColor()
    this._dfsVisit(initV, colors, handler)
  }

  _dfsVisit(v, colors, handler) {
    colors[v] = 'gray'
    handler(v)

    const vList = this.edges[v]
    for (let i = 0; i < vList.length; i++) {
      const e = vList[i]
      if (colors[e] === 'white') {
        this._dfsVisit(e, colors, handler)
      }
    }

    colors[v] = 'black'
  }
}
```

### 代码要点

1. **邻接表结构** — `{ A: ['B', 'C'], B: ['A', 'E'], ... }`，每个顶点对应一个邻居列表
2. **无向图** — `addEdge` 要加两条边（v1→v2 和 v2→v1）
3. **三色标记法** — 白色（未访问）、灰色（已发现）、黑色（已探索）
4. **BFS 用队列** — 一层层扩散，适合求最短路径
5. **DFS 用递归** — 一条路走到底再回溯，适合判断连通性

### BFS vs DFS 对比

```
BFS（广度优先）:                          DFS（深度优先）:
     A                                          A
    / \                                        / \
   B   C                                      B   C
  /     \                                    /     \
 D       E                                  D       E

顺序: A → B → C → D → E                    顺序: A → B → D → E → C
特点: 一层层扩散                            特点: 一条路走到底
应用: 最短路径、层级遍历                     应用: 连通性、拓扑排序
```

---

##  可视化演示

<GraphVisualizer />

---

##  复杂度分析

| 操作          | 时间复杂度    | 说明                             |
| ------------- | ------------- | -------------------------------- |
| `addVertex()` | **O(1)**    | 数组末尾插入                     |
| `addEdge()`   | **O(1)**    | 数组末尾插入                     |
| `toString()`  | **O(V+E)**  | 遍历所有顶点和边                 |
| BFS           | **O(V+E)**  | 每个顶点入队一次，每条边检查一次 |
| DFS           | **O(V+E)**  | 同上                             |

> V = 顶点数，E = 边数

---

##  常见面试题

### 1. 是否存在路径（BFS）

```javascript
function hasPath(graph, start, target) {
  if (start === target) return true

  const visited = new Set()
  const queue = [start]
  visited.add(start)

  while (queue.length > 0) {
    const v = queue.shift()
    for (const neighbor of graph.edges[v]) {
      if (neighbor === target) return true
      if (!visited.has(neighbor)) {
        visited.add(neighbor)
        queue.push(neighbor)
      }
    }
  }

  return false
}
```

### 2. 图的克隆

```javascript
function cloneGraph(graph) {
  const cloned = new Graph()
  const map = {} // 原顶点 → 新顶点

  // 复制顶点
  for (const v of graph.vertexes) {
    cloned.addVertex(v)
    map[v] = v
  }

  // 复制边
  for (const v of graph.vertexes) {
    for (const neighbor of graph.edges[v]) {
      cloned.addEdge(v, neighbor)
    }
  }

  return cloned
}
```

---

##  总结

| 特性       | 说明                                              |
| ---------- | ------------------------------------------------- |
| 核心思想   | 顶点 + 边，表示任意关系网络                       |
| 存储方式   | 邻接表（本教程）或邻接矩阵                        |
| 两种遍历   | BFS（队列，层层扩散）和 DFS（递归，一条路走到底） |
| 三色标记   | 白色=未访问，灰色=已发现，黑色=已探索             |
| BFS vs DFS | BFS 适合求最短路径，DFS 适合判断连通性            |
| 恭喜     | **你已经学完了所有 10 个数据结构！**              |

---

##  你已经完成了所有数据结构的学习！

### 回顾一下你的学习路线

```
 栈 Stack       →  LIFO，叠盘子
 队列 Queue      →  FIFO，排队
 优先级队列      →  VIP 优先
 字典            →  键值对
 集合            →  元素唯一 + 集合运算
 单向链表        →  节点 + 指针
 双向链表        →  前后都能走
 哈希表          →  散列 O(1) 查找
 二叉搜索树      →  左小右大，二分查找
 图              →  关系网络，BFS/DFS
```

### 接下来可以做什么？

1. **刷题** — 去 LeetCode 用学到的数据结构刷题
2. **学算法** — 排序、搜索、动态规划…
3. **看看源码** — Vue/React 源码中大量用到这些数据结构
4. **贡献本教程** — 在 GitHub 上提 Issue 或 PR

### LeetCode 练手题

| 题号                                                   | 题目       | 难度    |
| ------------------------------------------------------ | ---------- | ------- |
| [200](https://leetcode.cn/problems/number-of-islands/) | 岛屿数量   |  中等 |
| [207](https://leetcode.cn/problems/course-schedule/)   | 课程表     |  中等 |
| [133](https://leetcode.cn/problems/clone-graph/)       | 克隆图     |  中等 |
| [994](https://leetcode.cn/problems/rotting-oranges/)   | 腐烂的橘子 |  中等 |

[ 返回二叉搜索树](/binary-search-tree) · [ 返回首页](/)
