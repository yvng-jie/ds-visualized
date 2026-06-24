import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './custom.css'

import CodePlayground from '../../../components/CodePlayground.vue'
import {
  AVLTreeVisualizer,
  BSTVisualizer,
  CircularQueueVisualizer,
  DequeVisualizer,
  DictionaryVisualizer,
  DoublyLinkedListVisualizer,
  GraphVisualizer,
  HashTableVisualizer,
  HeapVisualizer,
  LinkedListVisualizer,
  PriorityQueueVisualizer,
  QueueVisualizer,
  SetVisualizer,
  StackVisualizer,
  TrieVisualizer,
} from '../../../components/index.js'

const visualizers = {
  CodePlayground,
  AVLTreeVisualizer,
  BSTVisualizer,
  CircularQueueVisualizer,
  DequeVisualizer,
  DictionaryVisualizer,
  DoublyLinkedListVisualizer,
  GraphVisualizer,
  HashTableVisualizer,
  HeapVisualizer,
  LinkedListVisualizer,
  PriorityQueueVisualizer,
  QueueVisualizer,
  SetVisualizer,
  StackVisualizer,
  TrieVisualizer,
}

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {}),
  enhanceApp({ app }) {
    for (const [name, comp] of Object.entries(visualizers)) {
      app.component(name, comp)
    }
  },
}
