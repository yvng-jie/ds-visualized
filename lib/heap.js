export class MinHeap {
  constructor() {
    this.heap = []
  }
  _left(i) {
    return i * 2 + 1
  }
  _right(i) {
    return i * 2 + 2
  }
  _parent(i) {
    return Math.floor((i - 1) / 2)
  }
  _swap(i, j) {
    ;[this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]]
  }

  _siftUp(i) {
    while (i > 0) {
      const p = this._parent(i)
      if (this.heap[p] <= this.heap[i]) break
      this._swap(p, i)
      i = p
    }
  }

  _siftDown(i) {
    const size = this.heap.length
    while (true) {
      let smallest = i
      const l = this._left(i),
        r = this._right(i)
      if (l < size && this.heap[l] < this.heap[smallest]) smallest = l
      if (r < size && this.heap[r] < this.heap[smallest]) smallest = r
      if (smallest === i) break
      this._swap(i, smallest)
      i = smallest
    }
  }

  insert(v) {
    this.heap.push(v)
    this._siftUp(this.heap.length - 1)
  }
  extract() {
    if (this.isEmpty()) return undefined
    if (this.heap.length === 1) return this.heap.pop()
    const min = this.heap[0]
    this.heap[0] = this.heap.pop()
    this._siftDown(0)
    return min
  }
  peek() {
    return this.isEmpty() ? undefined : this.heap[0]
  }
  size() {
    return this.heap.length
  }
  isEmpty() {
    return this.heap.length === 0
  }
}
