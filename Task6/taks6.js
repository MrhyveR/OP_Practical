const fs = require('fs');
const readline = require('readline');
const path = require('path');

const FILE_NAME = 'large_data.jsonl';
const FILE_PATH = path.join(__dirname, FILE_NAME);

async function generateLargeFile(recordsCount = 500000) {
    console.log(`Генерація даних (${recordsCount} рядків)`);
    const writeStream = fs.createWriteStream(FILE_PATH);

    for (let i = 0; i < recordsCount; i++) {
        const record = {
            id: i,
            timestamp: new Date().toISOString(),
            value: Math.floor(Math.random() * 100),
            type: i % 2 === 0 ? 'sensor_reading' : 'error_log'
        };

        const canWrite = writeStream.write(JSON.stringify(record) + '\n');

        if (!canWrite) {
            await new Promise(resolve => writeStream.once('drain', resolve));
        }
    }

    writeStream.end();
    return new Promise(resolve => writeStream.on('finish', () => {
        console.log(`Файл успішно створено: ${FILE_NAME}\n`);
        resolve();
    }));
}

async function* getLineIterator() {
    const fileStream = fs.createReadStream(FILE_PATH);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        yield line;
    }
}

async function processData() {
    console.log('Інкрементальна обробка потоку');
    
    let totalValue = 0;
    let count = 0;
    let errorCount = 0;
    const startTime = Date.now();

    try {
        for await (const line of getLineIterator()) {
            if (!line) continue;

            const data = JSON.parse(line);
            
            totalValue += data.value;
            count++;
            if (data.type === 'error_log') errorCount++;

            if (count % 100000 === 0) {
                console.log(`Опрацьовано ${count} записів`);
            }
        }

        const duration = (Date.now() - startTime) / 1000;

        console.log('\nПідсумковий звіт');
        console.log(`Усього оброблено рядків: ${count}`);
        console.log(`З них помилок (error_log): ${errorCount}`);
        console.log(`Сума всіх значень: ${totalValue}`);
        console.log(`Середнє значення: ${(totalValue / count).toFixed(2)}`);
        console.log(`Час обробки: ${duration} сек.`);
        console.log(`Використання RAM: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`);

    } catch (err) {
        console.error('Помилка під час обробки:', err);
    }
}

(async () => {
    if (!fs.existsSync(FILE_PATH)) {
        await generateLargeFile(1000000); 
    }

    await processData();
})();