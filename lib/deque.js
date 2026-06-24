export class Deque {
  constructor() {
    this.items = {}
    this.frontIndex = 0
    this.backIndex = 0
  }
  addFront(element) {
    if (this.isEmpty()) {
      this.addBack(element)
    } else {
      this.frontIndex--
      this.items[this.frontIndex] = element
    }
  }
  addBack(element) {
    this.items[this.backIndex] = element
    this.backIndex++
  }
  removeFront() {
    if (this.isEmpty()) return undefined
    const el = this.items[this.frontIndex]
    delete this.items[this.frontIndex]
    this.frontIndex++
    return el
  }
  removeBack() {
    if (this.isEmpty()) return undefined
    this.backIndex--
    const el = this.items[this.backIndex]
    delete this.items[this.backIndex]
    return el
  }
  peekFront() {
    return this.isEmpty() ? undefined : this.items[this.frontIndex]
  }
  peekBack() {
    return this.isEmpty() ? undefined : this.items[this.backIndex - 1]
  }
  isEmpty() {
    return this.size() === 0
  }
  size() {
    return this.backIndex - this.frontIndex
  }
}
