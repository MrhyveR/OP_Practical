function asyncMapCallback(array, asyncCallback, finalCallback) {
  if (array.length === 0) return finalCallback(null, []);

  const results = new Array(array.length);
  let completedCount = 0;
  let hasErrored = false;

  array.forEach((item, index) => {
    asyncCallback(item, (error, result) => {
      if (hasErrored) return;

      if (error) {
        hasErrored = true;
        return finalCallback(error);
      }

      results[index] = result;
      completedCount++;

      if (completedCount === array.length) {
        finalCallback(null, results);
      }
    });
  });
}

console.log("Запуск Callback версії");
const multiplyAsync = (num, cb) => {
  setTimeout(() => cb(null, num * 2), Math.random() * 500);
};

asyncMapCallback([1, 2, 3, 4], multiplyAsync, (err, results) => {
  if (err) console.error("Помилка:", err);
  else console.log("Результат Callback map:", results);
});


function asyncMapPromise(array, asyncFn) {
  return new Promise((resolve, reject) => {
    if (array.length === 0) return resolve([]);

    const results = new Array(array.length);
    let completedCount = 0;
    let hasErrored = false;

    array.forEach((item, index) => {
      asyncFn(item)
        .then(result => {
          if (hasErrored) return;
          results[index] = result;
          completedCount++;
          
          if (completedCount === array.length) resolve(results);
        })
        .catch(error => {
          if (!hasErrored) {
            hasErrored = true;
            reject(error);
          }
        });
    });
  });
}

const multiplyPromise = (num) => {
  return new Promise(resolve => setTimeout(() => resolve(num * 10), Math.random() * 500));
};

setTimeout(() => {
    console.log("\nЗапуск Promise версії");
    asyncMapPromise([1, 2, 3], multiplyPromise)
    .then(res => console.log("Результат Promise map:", res))
    .catch(err => console.error("Помилка:", err));
}, 1000);

const fetchUserData = async (id) => {
  return new Promise(resolve => setTimeout(() => resolve(`Користувач_ID:${id}`), 300));
};

async function demoAsyncAwait() {
  console.log("Запуск Async/Await версії");
  const userIds = [101, 102, 103];
  
  try {
    const promises = userIds.map(id => fetchUserData(id));
    const users = await Promise.all(promises);
    console.log("Отримані дані:", users); 
  } catch (error) {
    console.error("Сталася помилка при завантаженні:", error);
  }
}

demoAsyncAwait();


async function asyncMapAbortable(array, asyncFn, options = {}) {
  const { signal } = options;

  if (signal?.aborted) {
    throw new Error(signal.reason || "Операція була скасована перед початком");
  }

  const promises = array.map(async (item) => {
    if (signal?.aborted) {
       throw new Error(signal.reason || "Операція була скасована під час виконання");
    }
    return await asyncFn(item, signal);
  });

  return Promise.all(promises);
}

async function demoAbortable() {
  console.log("\nЗапуск Abortable версії");
  
  const controller = new AbortController();
  const data = [10, 20, 30, 40];

  const slowTask = (num, signal) => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => resolve(num * 100), 2000);
      
      if (signal) {
        signal.addEventListener('abort', () => {
          clearTimeout(timer);
          reject(new Error(signal.reason || "Перервано користувачем"));
        });
      }
    });
  };

  try {
    const mapPromise = asyncMapAbortable(data, slowTask, { signal: controller.signal });
    
    setTimeout(() => {
      console.log("Сигнал на скасування відправлено");
      controller.abort("Скасування за таймаутом"); 
    }, 500);

    const result = await mapPromise;
    console.log("Успішний результат:", result);
  } catch (error) {
    console.error("Перехоплена помилка:", error.message);
  }
}

setTimeout(demoAbortable, 1000);