const EventEmitter = require('events');

class EventBus extends EventEmitter {
    subscribe(eventName, listener) {
        this.on(eventName, listener);
    }

    unsubscribe(eventName, listener) {
        this.off(eventName, listener);
    }

    publish(eventName, data) {
        this.emit(eventName, data);
    }
}

const bus = new EventBus();