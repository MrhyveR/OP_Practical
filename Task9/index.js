const { log } = require('./task9');

const addSync = log({ level: 'Info', format: 'json', transport: 'console' })(
    function add(a, b) {
        return a + b;
    }
);

const divideAsync = log({ level: 'Error', format: 'text', transport: 'file' })(
    async function divide(a, b) {
        if (b === 0) throw new Error("Критична помилка: ділення на нуль");
        await new Promise(res => setTimeout(res, 150));
        return a / b;
    }
);

async function run() {
    console.log("Тест 1: Успішна синхронна функція (Info)");
    addSync(5, 10);

    console.log("\nТест 2: Успішна асинхронна функція (Error - логу не буде)");
    await divideAsync(10, 2);

    console.log("\nТест 3: Асинхронна функція з помилкою (Error - лог буде створено)");
    try {
        await divideAsync(10, 0);
    } catch (e) {
        console.log("Помилка була успішно прокинута далі та спіймана.");
    }
}

run();