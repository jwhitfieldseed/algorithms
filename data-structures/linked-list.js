/*eslint no-unused-vars: [2, { "varsIgnorePattern": "_" }]*/

// This implementation stores a reference to the head (first) and tail (last)
//  elements and maintains the current length.
// The benefit of the `tail` reference is O(1) `push. 
// The benefits of the `length` property are O(1) `length` 
//  and improved performance of `push` and `pop`.
// The costs of both are lightly higher memory usage (one Number, one reference)
//  and state redundancy/complexity, therefore risk of bugs
export default class LinkedList {

  // initialValues: Iterable
  constructor (initialValues) {
    this.head = this.tail = null
    this._length = 0

    if (initialValues) {
      this.insertAll(0, initialValues)
    }
  }

  // Return the first element of the list
  // O(1)
  first () {
    return this.head
      ? this.head.value
      : null
  }

  // Return the last element of the list
  // O(1)
  last () {
    return this.tail
      ? this.tail.value
      : null
  }

  // Return the length of the list
  // O(1)
  length () {
    return this._length
  }

  // Return the node at index `index`
  // O(N)
  get (index) {
    for (const [node, i] of iterateNodes(this)) {
      if (i === index) {
        return node
      }
    }

    return null
  }

  // Add a new value to the end of the list
  // O(1)
  push (value) {
    return this.insert(this.length(), value)
  }

  // Remove a value from the end of the list
  // O(N)
  pop () {
    return this.remove(this.length() - 1)
  }

  // Add value to the start of the list
  // 0(1)
  unshift (value) {
    return this.insert(0, value)
  }

  // Remove a value from the start of the list
  // O(1)
  shift () {
    return this.remove(0)
  }

  // Insert a value at an arbitrary index
  // O(N)
  insert (index, newValue) {
    if (index < 0) {
      return null
    }

    const newNode = node(newValue)
    if (index === 0) {
      newNode.next = this.head
      this.head = newNode
    } else {
      const nodeBeforeIndex = this.get(index - 1)
      if (!nodeBeforeIndex) {
        // We tried to add a node out-of-range
        return null
      }

      const nodeAtIndex = nodeBeforeIndex.next
      if (nodeAtIndex) {
        newNode.next = nodeAtIndex
      } else {
        this.tail = newNode
      }

      nodeBeforeIndex.next = newNode
    }

    this._length ++
    return newNode
  }

  // Insert an iterable sequence of values starting at `startIndex`
  // Returns the number of elements that were added
  // O(N)
  // TODO optimise: batch inserts then set head, tail once
  insertAll (startIndex, iterable) {
    let nextIndex = startIndex
    for (const value of iterable) {
      this.insert(nextIndex++, value)
    }

    return nextIndex - startIndex
  }

  // Remove a value from an arbitrary index
  // O(N)
  remove (index) {
    let targetNode = null
    let prevNode = null

    for (const [node, i] of iterateNodes(this)) {
      if (i === index) {
        targetNode = node
        break
      } else {
        prevNode = node
      }
    }

    if (!targetNode) {
      return null
    }

    if (prevNode) {
      prevNode.next = targetNode.next
    } else {
      this.head = targetNode.next
    }

    if (targetNode === this.tail) {
      this.tail = prevNode
    }

    this._length --
    return targetNode.value
  }

  * [Symbol.iterator ] () {
    for (const [node] of iterateNodes(this)) {
      yield node.value
    }
  }
}

function node (value, next = null) {
  if (typeof value === 'undefined') {
    return null
  }

  return { value, next }
}

function * iterateNodes (list) {
  let currentNode = list.head
  let i = 0
  while (currentNode) {
    yield [currentNode, i++]
    currentNode = currentNode.next
  }
}

const list = new LinkedList([0, 1])
list.push(2)
list.pop()
list.push(3)
list.push(4)
list.push(5)
list.remove(1)
list.remove(2)
list.shift()
list.unshift(0)
list.insert(0, 10)
list.insert(list.length(), 11)
list.insert(1, 12)
list.insertAll(2, [20, 21, 22])
console.log([...list])
console.log(list.length())
console.log(list.first())
console.log(list.last())

const emptyList = new LinkedList()
console.log([...emptyList])
