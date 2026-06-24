#  Bloom Filter

> **A space-efficient probabilistic data structure for set membership** — Like a checklist that sometimes says "maybe" but never says "no" when it should say "yes"

---

##  Concept

### Real-Life Analogy

<div class="analogy-box">

** Airport security checklist**: Security has a list of banned items. If your item is NOT on the list, you pass 100%. But if it IS "on the list"... it might be a false alarm. Bloom filters work the same way.

More examples:

- **Medium**: Recommending articles you haven't read
- **Databases**: Bloom filters avoid expensive disk lookups for non-existent keys
- **Web crawlers**: Avoid re-crawling URLs

</div>

### Key Properties

| Property                     | Description                                                          |
| ---------------------------- | -------------------------------------------------------------------- |
| **No false negatives**       | If `contains()` returns false, the item is definitely NOT in the set |
| **False positives possible** | `contains()` may return true for items never added                   |
| **Cannot remove items**      | Once a bit is set, you can't clear it (without advanced variants)    |
| **Space efficient**          | Uses a fraction of the memory of a hash table                        |

### How It Works

```
Add "apple":     hash1("apple") → bit[3]=1, hash2("apple") → bit[7]=1, hash3("apple") → bit[2]=1
Add "banana":    hash1 → bit[5]=1, hash2 → bit[1]=1, hash3 → bit[7]=1

Check "apple":    bit[3]=1,  bit[7]=1,  bit[2]=1 → "Probably in set"
Check "grape":    bit[5]=1,  bit[4]=0, ... → "Definitely NOT in set"
```

---

##  Code

```javascript
class BloomFilter {
  constructor(size = 100, numHashes = 3) {
    this.size = size
    this.numHashes = numHashes
    this.bits = new Array(size).fill(false)
    this.itemsAdded = 0
  }

  _hash(item, seed) {
    let hash = seed
    const str = String(item)
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 33) ^ str.charCodeAt(i)
    }
    return Math.abs(hash) % this.size
  }

  _getPositions(item) {
    const positions = []
    for (let i = 0; i < this.numHashes; i++) {
      positions.push(this._hash(item, i * 0x9e3779b9 + 0x9e3779b9))
    }
    return positions
  }

  add(item) {
    const positions = this._getPositions(item)
    for (const pos of positions) {
      this.bits[pos] = true
    }
    this.itemsAdded++
  }

  contains(item) {
    const positions = this._getPositions(item)
    for (const pos of positions) {
      if (!this.bits[pos]) return false
    }
    return true // Might be a false positive
  }

  getFalsePositiveRate() {
    const k = this.numHashes
    const m = this.size
    const n = this.itemsAdded
    return Math.pow(1 - Math.exp((-k * n) / m), k)
  }
}
```

---

##  Complexity

| Operation | Time | Space |
| --------- | :--: | :---: |
| add       | O(k) | O(m)  |
| contains  | O(k) | O(m)  |

> k = number of hash functions, m = bit array size

---

##  Interview Questions

### 1. When would you use a Bloom Filter?

**Answer**: When you need fast membership checks and can tolerate some false positives. For example: checking if a username is taken (false positive means "sorry, that name is taken" when it's not — annoying but acceptable).

---

##  Common Pitfalls

| Mistake                           | Why                                           |
| --------------------------------- | --------------------------------------------- |
| Using too few hash functions      | High false positive rate                      |
| Using too many hash functions     | Slower operations, bits saturate quickly      |
| Not sizing the bit array properly | Small array → high false positive rate        |
| Trying to remove items            | Standard Bloom Filters don't support deletion |

---

##  Decision Guide

| Scenario                                         | Recommendation                         |
| ------------------------------------------------ | -------------------------------------- |
| Need exact answers                               |  Use a HashSet instead               |
| Memory constrained, can tolerate false positives |  Bloom Filter                        |
| Need to remove items                             |  Use a Counting Bloom Filter variant |
