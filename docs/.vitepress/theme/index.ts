import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './custom.css'

// 导入交互组件
import CodePlayground from '../../../components/CodePlayground.vue'
import StackVisualizer from '../../../components/StackVisualizer.vue'
import QueueVisualizer from '../../../components/QueueVisualizer.vue'
import LinkedListVisualizer from '../../../components/LinkedListVisualizer.vue'
import BSTVisualizer from '../../../components/BSTVisualizer.vue'
import GraphVisualizer from '../../../components/GraphVisualizer.vue'
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
  },
}
