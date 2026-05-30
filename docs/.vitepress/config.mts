import { defineConfig } from 'vitepress'

// English sidebar (default)
const enSidebar = [
  {
    text: 'Getting Started',
    items: [
      { text: 'What are Data Structures?', link: '/getting-started' },
      { text: '📊 Complexity Cheatsheet', link: '/complexity-cheatsheet' },
    ],
  },
  {
    text: 'Linear Structures',
    items: [
      { text: '📦 Stack', link: '/stack' },
      { text: '📋 Queue', link: '/queue' },
      { text: '🔢 PriorityQueue', link: '/priority-queue' },
      { text: '🔄 Deque', link: '/deque' },
      { text: '🔄 Circular Queue', link: '/circular-queue' },
    ],
  },
  {
    text: 'Linked Structures',
    items: [
      { text: '🔗 LinkedList', link: '/linked-list' },
      { text: '🔗 DoublyLinkedList', link: '/doubly-linked-list' },
    ],
  },
  {
    text: 'Hash & Set',
    items: [
      { text: '📖 Dictionary', link: '/dictionary' },
      { text: '🧩 Set', link: '/set' },
      { text: '🔑 HashTable', link: '/hash-table' },
      { text: '🌸 Bloom Filter', link: '/bloom-filter' },
    ],
  },
  {
    text: 'Tree & Graph',
    items: [
      { text: '🌳 BST', link: '/binary-search-tree' },
      { text: '🌳 AVL Tree', link: '/avl-tree' },
      { text: '⛰️ Heap', link: '/heap' },
      { text: '🌲 Trie', link: '/trie' },
      { text: '🕸️ Graph', link: '/graph' },
      { text: '📊 Graph Rep.', link: '/graph-representation' },
    ],
  },
  {
    text: 'Advanced',
    items: [
      { text: '🔗 Union-Find', link: '/union-find' },
      { text: '⚡ LRU Cache', link: '/lru-cache' },
      { text: '⏫ Skip List', link: '/skip-list' },
    ],
  },
]

// Chinese sidebar (/zh/ path)
const zhSidebar = [
  {
    text: '入门',
    items: [
      { text: '什么是数据结构', link: '/zh/getting-started' },
      { text: '📊 复杂度速查表', link: '/zh/complexity-cheatsheet' },
    ],
  },
  {
    text: '线性结构',
    items: [
      { text: '📦 栈 Stack', link: '/zh/stack' },
      { text: '📋 队列 Queue', link: '/zh/queue' },
      { text: '🔢 优先级队列 PriorityQueue', link: '/zh/priority-queue' },
      { text: '🔄 双端队列 Deque', link: '/zh/deque' },
      { text: '🔄 循环队列 CircularQueue', link: '/zh/circular-queue' },
    ],
  },
  {
    text: '链式结构',
    items: [
      { text: '🔗 单向链表 LinkedList', link: '/zh/linked-list' },
      { text: '🔗 双向链表 DoublyLinkedList', link: '/zh/doubly-linked-list' },
    ],
  },
  {
    text: '散列与集合',
    items: [
      { text: '📖 字典 Dictionary', link: '/zh/dictionary' },
      { text: '🧩 集合 Set', link: '/zh/set' },
      { text: '🔑 哈希表 HashTable', link: '/zh/hash-table' },
      { text: '🌸 布隆过滤器 BloomFilter', link: '/zh/bloom-filter' },
    ],
  },
  {
    text: '树与图',
    items: [
      { text: '🌳 二叉搜索树 BST', link: '/zh/binary-search-tree' },
      { text: '🌳 AVL 树', link: '/zh/avl-tree' },
      { text: '⛰️ 堆 Heap', link: '/zh/heap' },
      { text: '🌲 前缀树 Trie', link: '/zh/trie' },
      { text: '🕸️ 图 Graph', link: '/zh/graph' },
      { text: '📊 图表示 GraphRep', link: '/zh/graph-representation' },
    ],
  },
  {
    text: '进阶',
    items: [
      { text: '🔗 并查集 UnionFind', link: '/zh/union-find' },
      { text: '⚡ LRU 缓存', link: '/zh/lru-cache' },
      { text: '⏫ 跳表 SkipList', link: '/zh/skip-list' },
    ],
  },
]

export default defineConfig({
  base: '/ds-visualized/',
  lastUpdated: true,
  cleanUrls: true,

  sitemap: {
    hostname: 'https://yvng-jie.github.io/ds-visualized',
  },

  head: [
    ['link', { rel: 'icon', href: '/ds-visualized/favicon.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'alternate icon', href: '/ds-visualized/favicon.ico' }],
    ['link', { rel: 'manifest', href: '/ds-visualized/manifest.json' }],
    [
      'script',
      {},
      `if('serviceWorker' in navigator) { window.addEventListener('load', () => { navigator.serviceWorker.register('/ds-visualized/sw.js') }) }`,
    ],
    ['meta', { name: 'theme-color', content: '#3b82f6' }],
    [
      'meta',
      { name: 'keywords', content: 'data structures, javascript, visualization, tutorial, 数据结构, JS, 可视化' },
    ],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'JS Data Structures Visualized' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ],

  locales: {
    root: {
      label: 'English',
      lang: 'en',
      title: 'JS Data Structures Visualized',
      description: 'Interactive Tutorial with Animations & Live Playground',
      head: [
        ['meta', { property: 'og:title', content: 'JS Data Structures Visualized' }],
        [
          'meta',
          {
            property: 'og:description',
            content:
              'Interactive data structures tutorial with visual animations and live code playground for JavaScript learners',
          },
        ],
      ],
      themeConfig: {
        logo: '/logo.svg',
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Structures', link: '/stack' },
          { text: 'GitHub', link: 'https://github.com/yvng-jie/ds-visualized' },
        ],
        sidebar: enSidebar,
        socialLinks: [{ icon: 'github', link: 'https://github.com/yvng-jie/ds-visualized' }],
        footer: {
          message: 'MIT Licensed | Made with ❤️ for JS learners',
          copyright: 'Copyright © 2026 Jie Yang',
        },
        search: { provider: 'local' },
        editLink: {
          pattern: 'https://github.com/yvng-jie/ds-visualized/edit/main/docs/:path',
          text: 'Edit this page on GitHub',
        },
      },
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      title: 'JS 数据结构可视化教程',
      description: '交互式学习，可视化动画，在线 Playground',
      head: [
        ['meta', { property: 'og:title', content: 'JS 数据结构可视化教程' }],
        [
          'meta',
          { property: 'og:description', content: '交互式学习数据结构，每个结构都有可视化动画和在线代码 Playground' },
        ],
      ],
      themeConfig: {
        logo: '/logo.svg',
        nav: [
          { text: '首页', link: '/zh/' },
          { text: '数据结构', link: '/zh/stack' },
          { text: 'GitHub', link: 'https://github.com/yvng-jie/ds-visualized' },
        ],
        sidebar: zhSidebar,
        socialLinks: [{ icon: 'github', link: 'https://github.com/yvng-jie/ds-visualized' }],
        footer: {
          message: 'MIT Licensed | 用 ❤️ 为 JS 初学者制作',
          copyright: 'Copyright © 2026 Jie Yang',
        },
        search: { provider: 'local' },
        editLink: {
          pattern: 'https://github.com/yvng-jie/ds-visualized/edit/main/docs/:path',
          text: '在 GitHub 上编辑此页',
        },
      },
    },
  },
})
