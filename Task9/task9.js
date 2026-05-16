const { performance } = require('perf_hooks');

const LOG_LEVELS = { DEBUG: 0, INFO: 1, ERROR: 2 };

const formatters = {
    json: (entry) => JSON.stringify(entry),
    text: (entry) => `[${entry.timestamp}] [${entry.level}] ${entry.message} Дані: ${JSON.stringify(entry.data)}`
};

const transports = {
    console: (logString) => console.log(logString),
    file: (logString) => console.log(`[File_mock] Запис у файл: ${logString}`),
    external: (logString) => console.log(`[Api_mock] Відправка на сервер: ${logString}`)
};

function createLogEntry(level, message, data, format) {
    const entry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        data
    };
    const formatFn = formatters[format] || formatters.json;
    return formatFn(entry);
}