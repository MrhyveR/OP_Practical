class BiDirectionalPriorityQueue {
  constructor() {
    this.queue = [];
    this.counter = 0;
  }

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
        throw new Error("Невідомий режим. Використовуйте 'highest', 'lowest', 'oldest', або 'newest'.");
    }
  }
}