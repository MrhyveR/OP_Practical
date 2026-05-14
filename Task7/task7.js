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

class Logger {
    constructor(bus) {
        this.bus = bus;
        this.logHandler = this.logHandler.bind(this);
    }

    startLogging() {
        this.bus.subscribe('userAction', this.logHandler);
        console.log('Logger: Підписався на події (Логування увімкнено).');
    }

    logHandler(data) {
        console.log(`[LOG]: Користувач ${data.user} виконав дію: ${data.action}`);
    }
}

class NotificationService {
    constructor(bus) {
        this.bus = bus;
        this.notifyHandler = this.notifyHandler.bind(this);
    }

    enableNotifications() {
        this.bus.subscribe('userAction', this.notifyHandler);
        console.log('NotificationService: Підписався на події (Сповіщення увімкнено).');
    }

    disableNotifications() {
        this.bus.unsubscribe('userAction', this.notifyHandler);
        console.log('NotificationService: Відписався від подій (Сповіщення вимкнено).');
    }

    notifyHandler(data) {
        console.log(`[ALERT]: Надсилання email. Користувач ${data.user} зробив: ${data.action}`);
    }
}

class User {
    constructor(name, bus) {
        this.name = name;
        this.bus = bus;
    }

    performAction(action) {
        console.log(`\nІніціація: ${this.name} виконує "${action}" ---`);
        this.bus.publish('userAction', { user: this.name, action: action });
    }
}

const logger = new Logger(bus);
const notifier = new NotificationService(bus);
const user1 = new User('Олексій', bus);
const user2 = new User('Марія', bus);

console.log('Етап ініціалізації');
logger.startLogging();
notifier.enableNotifications();

user1.performAction('Увійшов у систему');

console.log('\nЗміна налаштувань');
notifier.disableNotifications();

user2.performAction('Завантажив великий файл .jsonl');