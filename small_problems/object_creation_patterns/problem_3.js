class CircularQueue {
  constructor(capacity) {
    this.capacity = capacity;
    this.list = new Array(this.capacity).fill(null);
    this.head = 0;
    this.tail = 0;
    this.size = 0;  // num of elements added to list
  }

  isFull() {
    return this.size === this.capacity;
  }

  isEmpty() {
    return this.size === 0;
  }

  enqueue(item) {
    this.list[this.tail] = item;
    this.tail = (this.tail + 1) % this.capacity;

    if (this.isFull()) {
      this.head = (this.head + 1) % this.capacity;
    } else { // isnt full
      this.size += 1;
    }
    return this.size;
  }

  dequeue() {
    let item = null;

    if (!this.isEmpty()) {
      item = this.list[this.head];
      this.list[this.head] = null;
      this.head = (this.head + 1) % this.capacity;
      this.size -= 1;
    }
    return item;
  }
}

let queue = new CircularQueue(3);
console.log(queue.dequeue() === null);

queue.enqueue(1);
queue.enqueue(2);
console.log(queue.dequeue() === 1);

queue.enqueue(3);
queue.enqueue(4);
console.log(queue.dequeue() === 2);

queue.enqueue(5);
queue.enqueue(6);
queue.enqueue(7);

console.log(queue.dequeue() === 5);
console.log(queue.dequeue() === 6);
console.log(queue.dequeue() === 7);
console.log(queue.dequeue() === null);

let anotherQueue = new CircularQueue(4);
console.log(anotherQueue.dequeue() === null);

anotherQueue.enqueue(1);
anotherQueue.enqueue(2);
console.log(anotherQueue.dequeue() === 1);

anotherQueue.enqueue(3);
anotherQueue.enqueue(4);
console.log(anotherQueue.dequeue() === 2);

anotherQueue.enqueue(5);
anotherQueue.enqueue(6);
anotherQueue.enqueue(7);
console.log(anotherQueue.dequeue() === 4);
console.log(anotherQueue.dequeue() === 5);
console.log(anotherQueue.dequeue() === 6);
console.log(anotherQueue.dequeue() === 7);
console.log(anotherQueue.dequeue() === null);