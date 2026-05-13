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