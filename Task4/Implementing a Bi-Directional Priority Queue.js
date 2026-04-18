class BiDirectionalPriorityQueue {
  constructor() {
    this.queue = [];
    this.counter = 0;
  }

  /**
   * @param {any} item
   * @param {number} priority
   */
  enqueue(item, priority) {
    const node = {
      item: item,
      priority: priority,
      insertOrder: this.counter++
    };
    this.queue.push(node);
  }

  peek(mode) {
    if (this.queue.length === 0) return null;

    switch (mode) {
      case 'highest':
        return this.queue.reduce((max, node) => (node.priority > max.priority ? node : max)).item;
      case 'lowest':
        return this.queue.reduce((min, node) => (node.priority < min.priority ? node : min)).item;
      case 'oldest':
        return this.queue[0].item;
      case 'newest':
        return this.queue[this.queue.length - 1].item;
      default:
        throw new Error("Invalid mode");
    }
  }

  dequeue(mode) {
    if (this.queue.length === 0) return null;

    let indexToRemove = -1;

    switch (mode) {
      case 'highest':
        indexToRemove = this.queue.reduce((idxMax, node, idx, arr) => 
          node.priority > arr[idxMax].priority ? idx : idxMax, 0);
        break;

      case 'lowest':
        indexToRemove = this.queue.reduce((idxMin, node, idx, arr) => 
          node.priority < arr[idxMin].priority ? idx : idxMin, 0);
        break;

      case 'oldest':
        return this.queue.shift().item;

      case 'newest':
        return this.queue.pop().item;

      default:
        throw new Error("Invalid mode");
    }

    if (indexToRemove !== -1) {
      return this.queue.splice(indexToRemove, 1)[0].item;
    }
  }
}

const myQueue = new BiDirectionalPriorityQueue();

myQueue.enqueue("Низький пріоритет", 10);
myQueue.enqueue("Середній пріоритет", 50);
myQueue.enqueue("Критичний пріоритет", 100);
myQueue.enqueue("Останнє завдання", 5);

console.log("Стан черги (Peek)");
console.log("Найвищий пріоритет:", myQueue.peek('highest'));
console.log("Найстаріше (FIFO):", myQueue.peek('oldest'));
console.log("Найно́віше (LIFO):", myQueue.peek('newest'));

console.log("\nВилучення (Dequeue)");
console.log("Вилучено за пріоритетом (highest):", myQueue.dequeue('highest')); 
console.log("Вилучено за часом (oldest):", myQueue.dequeue('oldest'));
console.log("Залишилося елементів:", myQueue.queue.length);