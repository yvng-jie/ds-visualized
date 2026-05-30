import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './custom.css'

// Import interactive components
import CodePlayground from '../../../components/CodePlayground.vue'
import StackVisualizer from '../../../components/StackVisualizer.vue'
import QueueVisualizer from '../../../components/QueueVisualizer.vue'
import LinkedListVisualizer from '../../../components/LinkedListVisualizer.vue'
import BSTVisualizer from '../../../components/BSTVisualizer.vue'
import GraphVisualizer from '../../../components/GraphVisualizer.vue'
import PriorityQueueVisualizer from '../../../components/PriorityQueueVisualizer.vue'
import DequeVisualizer from '../../../components/DequeVisualizer.vue'
import DoublyLinkedListVisualizer from '../../../components/DoublyLinkedListVisualizer.vue'
import SetVisualizer from '../../../components/SetVisualizer.vue'
import DictionaryVisualizer from '../../../components/DictionaryVisualizer.vue'
import HashTableVisualizer from '../../../components/HashTableVisualizer.vue'
import HeapVisualizer from '../../../components/HeapVisualizer.vue'
import TrieVisualizer from '../../../components/TrieVisualizer.vue'
import CircularQueueVisualizer from '../../../components/CircularQueueVisualizer.vue'
import AVLTreeVisualizer from '../../../components/AVLTreeVisualizer.vue'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {}),
  enhanceApp({ app, router, siteData }) {
    app.component('CodePlayground', CodePlayground)
    app.component('StackVisualizer', StackVisualizer)
    app.component('QueueVisualizer', QueueVisualizer)
    app.component('LinkedListVisualizer', LinkedListVisualizer)
    app.component('BSTVisualizer', BSTVisualizer)
    app.component('GraphVisualizer', GraphVisualizer)
    app.component('PriorityQueueVisualizer', PriorityQueueVisualizer)
    app.component('DequeVisualizer', DequeVisualizer)
    app.component('DoublyLinkedListVisualizer', DoublyLinkedListVisualizer)
    app.component('SetVisualizer', SetVisualizer)
    app.component('DictionaryVisualizer', DictionaryVisualizer)
    app.component('HashTableVisualizer', HashTableVisualizer)
    app.component('HeapVisualizer', HeapVisualizer)
    app.component('TrieVisualizer', TrieVisualizer)
    app.component('CircularQueueVisualizer', CircularQueueVisualizer)
    app.component('AVLTreeVisualizer', AVLTreeVisualizer)
  },
}
