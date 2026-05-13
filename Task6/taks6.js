const fs = require('fs');
const readline = require('readline');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'large_events_data.jsonl');

async function generateMockData(linesCount = 100000) {
    console.log('Початок генерації тестового файлу');
    const writeStream = fs.createWriteStream(DATA_FILE);
    
    for (let i = 0; i < linesCount; i++) {
        const event = {
            id: i,
            timestamp: Date.now(),
            eventType: Math.random() > 0.5 ? 'page_view' : 'click',
            userId: `user_${Math.floor(Math.random() * 1000)}`
        };
        const canWrite = writeStream.write(JSON.stringify(event) + '\n');
        
        if (!canWrite) {
            await new Promise(resolve => writeStream.once('drain', resolve));
        }
    }
    
    writeStream.end();
    console.log(`Генерацію завершено. Файл збережено як ${DATA_FILE}`);
}

async function* createDataStreamIterator(filePath) {
    const fileStream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        yield line;
    }
}

module.isRequired = true;
module.exports = { generateMockData, createDataStreamIterator, DATA_FILE };

generateMockData(500000);