function memoizeBasic(fn, maxSize = Infinity) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log(`Беремо з кешу для ${key}`);
      return cache.get(key);
    }

    console.log(`Рахуємо для ${key}...`);
    const result = fn.apply(this, args);
    cache.set(key, result);

    if (cache.size > maxSize) {
      const oldestKey = cache.keys().next().value;
      cache.delete(oldestKey);
    }

    return result;
  };
}