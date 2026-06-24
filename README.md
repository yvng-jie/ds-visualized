<div align="center">
  <img src="docs/public/logo.svg" width="120" alt="Logo"/>
  <h1>JS Data Structures Visualized</h1>
  <p><strong>Interactive Tutorial · Animated Visualizations · Live Code Playground</strong></p>
  <p>Visual animations &bull; Interactive playground &bull; Zero to interview ready</p>

  <p>
    <a href="https://github.com/yvng-jie/ds-visualized/stargazers">
      <img src="https://img.shields.io/github/stars/yvng-jie/ds-visualized?style=flat-square&logo=github" alt="Stars"/>
    </a>
    <a href="LICENSE">
      <img src="https://img.shields.io/github/license/yvng-jie/ds-visualized?style=flat-square" alt="License"/>
    </a>
    <a href="https://github.com/yvng-jie/ds-visualized/actions/workflows/deploy.yml">
      <img src="https://img.shields.io/github/actions/workflow/status/yvng-jie/ds-visualized/deploy.yml?style=flat-square&label=deploy" alt="Deploy"/>
    </a>
    <a href="https://github.com/yvng-jie/ds-visualized/issues">
      <img src="https://img.shields.io/github/issues/yvng-jie/ds-visualized?style=flat-square" alt="Issues"/>
    </a>
    <a href="#">
      <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square" alt="PRs Welcome"/>
    </a>
  </p>

  <p>
    <a href="https://yvng-jie.github.io/ds-visualized/">Live Demo</a>
    &nbsp;|&nbsp;
    <a href="#-data-structures">Contents</a>
    &nbsp;|&nbsp;
    <a href="#-local-development">Local Dev</a>
  </p>
</div>

---

## Demo

<p align="center">
  <picture>
    <source srcset="docs/public/screenshots/2026-05-28_18-16-26_266.webp" type="image/webp">
    <img src="docs/public/screenshots/2026-05-28_18-16-26_266.png" width="95%" alt="Queue Visualization" loading="lazy"/>
  </picture>
  <br/>
  <em>Website Home</em>
</p>
<p align="center">
  <video width="95%" autoplay muted loop playsinline poster="docs/public/screenshots/2026-05-28_18-16-26_266.webp">
    <source src="docs/public/screenshots/2026-05-28_18-28-46.mp4" type="video/mp4">
  </video>
  <br/>
  <em>Graph BFS traversal</em>
</p>

---

## About

An interactive tutorial website for learning data structures in JavaScript. Every chapter includes:

| Module               | Description                                                   |
| -------------------- | ------------------------------------------------------------- |
| **Concept**          | Real-life analogies, use cases — build intuition in 5 minutes |
| **Code**             | Complete implementation with teaching-style comments          |
| **Complexity**       | Big O time & space for every operation                        |
| **Visualization**    | Interactive animations with speed control                     |
| **Interview Qs**     | LeetCode-style problems with runnable solutions               |

**English** / **简体中文** — Switch languages from the nav bar.

---

## Data Structures

| #   | Structure                                           | Difficulty | One-liner                    |
| --- | --------------------------------------------------- | ---------- | ---------------------------- |
| 1   | [Stack](docs/stack.md)                              | Beginner   | Last in, first out           |
| 2   | [Queue](docs/queue.md)                              | Beginner   | First in, first out          |
| 3   | [Priority Queue](docs/priority-queue.md)            | Intermediate | VIPs go first                |
| 4   | [Deque](docs/deque.md)                              | Intermediate | Insert/remove from both ends |
| 5   | [Dictionary](docs/dictionary.md)                    | Beginner   | Key-value storage            |
| 6   | [Set](docs/set.md)                                  | Intermediate | Unique elements + set ops    |
| 7   | [Linked List](docs/linked-list.md)                  | Intermediate | Nodes + pointers             |
| 8   | [Doubly Linked List](docs/doubly-linked-list.md)    | Advanced   | Forward and backward         |
| 9   | [Hash Table](docs/hash-table.md)                    | Advanced   | O(1) lookups                 |
| 10  | [BST](docs/binary-search-tree.md)                   | Advanced   | Sorted tree, binary search   |
| 11  | [Heap](docs/heap.md)                                | Advanced   | Priority queue done right    |
| 12  | [Trie](docs/trie.md)                                | Advanced   | Fast string prefix search    |
| 13  | [Graph](docs/graph.md)                              | Advanced   | BFS/DFS traversals           |

---

## Local Development

```bash
git clone https://github.com/yvng-jie/ds-visualized.git
cd ds-visualized
pnpm install
pnpm run docs:dev     # Start dev server
pnpm run docs:build   # Build static files
pnpm run docs:preview # Preview built site
```

---

## Contributing

Contributions welcome! Here's how:

- **Submit an Issue** — Bug reports, feature suggestions
- **Submit a PR** — Fix errors, improve translations, add visualizers
- **Translate** — Help expand the English or Chinese tutorials
- **Share** — Star the repo, share with friends!

---

## License

[MIT](LICENSE) © 2026 Jie Yang
