# 📊 Complexity Cheatsheet

> Big O time & space complexity for all data structures covered in this tutorial.

---

## Linear Structures

| Structure          | Access | Search | Insert | Delete | Space |
| ------------------ | :----: | :----: | :----: | :----: | :---: |
| **Array**          |  O(1)  |  O(n)  |  O(n)  |  O(n)  | O(n)  |
| **Stack**          | O(n)¹  |  O(n)  | O(1)²  | O(1)²  | O(n)  |
| **Queue**          | O(n)¹  |  O(n)  | O(1)²  | O(1)²  | O(n)  |
| **Priority Queue** | O(n)¹  |  O(n)  |  O(n)  | O(1)²  | O(n)  |
| **Deque**          | O(n)¹  |  O(n)  | O(1)²³ | O(1)²³ | O(n)  |
| **Circular Queue** | O(1)⁴  |  O(n)  |  O(1)  |  O(1)  | O(n)  |

> ¹ Access by value (no index). Stack: peek is O(1). Queue: front/rear is O(1).
> ² At the ends only. Stack: push/pop. Queue: enqueue/dequeue.
> ³ Deque: both ends.
> ⁴ By index within the array.

---

## Linked Structures

| Structure              |  Access   |  Search   |  Insert   |  Delete   |   Space    |
| ---------------------- | :-------: | :-------: | :-------: | :-------: | :--------: |
| **Singly Linked List** |   O(n)    |   O(n)    |   O(1)¹   |   O(n)²   |    O(n)    |
| **Doubly Linked List** |   O(n)    |   O(n)    |   O(1)¹   |   O(1)²   |    O(n)    |
| **Skip List**          | O(log n)³ | O(log n)³ | O(log n)³ | O(log n)³ | O(n log n) |

> ¹ Insert at head is O(1). Insert at tail requires traversal for singly linked lists.
> ² Delete given a node reference: Doubly is O(1), Singly is O(n) (need previous node).
> ³ Average case. Worst case is O(n).

---

## Hash & Set

| Structure            | Search | Insert | Delete | Space | Notes                      |
| -------------------- | :----: | :----: | :----: | :---: | -------------------------- |
| **Dictionary** (Map) | O(1)⁴  | O(1)⁴  | O(1)⁴  | O(n)  |                            |
| **Set**              | O(1)⁴  | O(1)⁴  | O(1)⁴  | O(n)  |                            |
| **Hash Table**       | O(1)⁴  | O(1)⁴  | O(1)⁴  | O(n)  |                            |
| **Bloom Filter**     | O(k)⁵  |  O(k)  |   ❌   | O(m)  | No delete, false positives |

> ⁴ Average case. Worst case O(n) with many collisions.
> ⁵ k = number of hash functions.

---

## Trees

| Structure              |  Search  |  Insert  |  Delete   |  Space   |
| ---------------------- | :------: | :------: | :-------: | :------: |
| **BST** (balanced)     | O(log n) | O(log n) | O(log n)  |   O(n)   |
| **BST** (skewed)       |   O(n)   |   O(n)   |   O(n)    |   O(n)   |
| **AVL Tree**           | O(log n) | O(log n) | O(log n)  |   O(n)   |
| **Heap** (Min/Max)     |  O(n)¹   | O(log n) | O(log n)² |   O(n)   |
| **Trie** (Prefix Tree) |  O(k)³   |  O(k)³   |   O(k)³   | O(n × k) |

> ¹ Search in a heap is O(n) — heaps are not designed for general search. `peek()` is O(1).
> ² Extract min/max is O(log n). General delete requires search.
> ³ k = key length.

---

## Graph

| Representation       | Edge Check | Iterate Neighbors | Add Vertex | Add Edge |  Space   |
| -------------------- | :--------: | :---------------: | :--------: | :------: | :------: |
| **Adjacency Matrix** |    O(1)    |       O(V)        |   O(V²)    |   O(1)   |  O(V²)   |
| **Adjacency List**   | O(degree)  |     O(degree)     |    O(1)    |   O(1)   | O(V + E) |

### Graph Traversal

| Algorithm |   Time   | Space | Use Case                           |
| --------- | :------: | :---: | ---------------------------------- |
| **BFS**   | O(V + E) | O(V)  | Shortest path in unweighted graphs |
| **DFS**   | O(V + E) | O(V)  | Path existence, topological sort   |

---

## Caching

| Structure     | Get  | Put  | Eviction |    Space    |
| ------------- | :--: | :--: | :------: | :---------: |
| **LRU Cache** | O(1) | O(1) |   O(1)   | O(capacity) |

---

## Specialized

| Structure      |  Union  |  Find   | Connected | Space |
| -------------- | :-----: | :-----: | :-------: | :---: |
| **Union-Find** | O(α(n)) | O(α(n)) |  O(α(n))  | O(n)  |

> α(n) = Inverse Ackermann function — effectively O(1) for any practical input size.

---

<div class="tip-box">

**💡 Quick Tips**

- **O(1)** → Constant time. Best possible. Hash lookups, array indexing.
- **O(log n)** → Very fast. Binary search, tree operations.
- **O(n)** → Linear. Single pass through data.
- **O(n log n)** → Good sorting algorithms (Merge Sort, Quick Sort).
- **O(n²)** → Quadratic. Nested loops. Avoid for large datasets.

</div>
