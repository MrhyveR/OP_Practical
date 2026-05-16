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

function log({ level = 'Info', format = 'json', transport = 'console' } = {}) {
    const configLevelValue = LOG_LEVELS[level.toUpperCase()] ?? LOG_LEVELS.INFO;

    return function (fn) {
        return function (...args) {
            const startTime = performance.now();
            const transportFn = transports[transport] || transports.console;

            const handleSuccess = (result) => {
                const executionTimeMs = (performance.now() - startTime).toFixed(2);
                
                if (configLevelValue <= LOG_LEVELS.INFO) {
                    const logString = createLogEntry(level, `Виконання функції ${fn.name}`, { args, result, time: `${executionTimeMs}ms` }, format);
                    transportFn(logString);
                }
                return result;
            };

            const handleError = (error) => {
                const executionTimeMs = (performance.now() - startTime).toFixed(2);
                
                const logString = createLogEntry('Error', `Виняток у функції ${fn.name}`, { args, error: error.message, time: `${executionTimeMs}ms` }, format);
                transportFn(logString);
                throw error;
            };

            try {
                const result = fn.apply(this, args);
                if (result instanceof Promise) {
                    return result.then(handleSuccess).catch(handleError);
                }
                return handleSuccess(result);
            } catch (error) {
                return handleError(error);
            }
        };
    };
}

module.exports = { log };