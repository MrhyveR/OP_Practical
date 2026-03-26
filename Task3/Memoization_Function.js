function memoize(fn, options = {}) {

  const {
    maxSize = Infinity,
    strategy = 'LRU',
    ttl = 1000,
    customEvict = null
  } = options;

  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);

    if (strategy === 'TTL' && cache.has(key)) {
      const entry = cache.get(key);
      if (Date.now() - entry.timestamp > ttl) {
        console.log(`Кеш протух для ${key}`);
        cache.delete(key);
      }
    }

    if (cache.has(key)) {
      const entry = cache.get(key);

      if (strategy === 'LRU') {
        cache.delete(key);
        cache.set(key, entry);
      } else if (strategy === 'LFU') {
        entry.freq += 1;
      }

      return entry.value;
    }

    const result = fn.apply(this, args);

    const newEntry = { value: result };
    if (strategy === 'LFU') newEntry.freq = 1;
    if (strategy === 'TTL') newEntry.timestamp = Date.now();

    cache.set(key, newEntry);

    if (cache.size > maxSize) {
      if (strategy === 'LRU') {
        const oldestKey = cache.keys().next().value;
        cache.delete(oldestKey);
      } 
      else if (strategy === 'LFU') {
        let minFreq = Infinity;
        let lfuKey = null;
        for (const [k, v] of cache.entries()) {
          if (v.freq < minFreq) {
            minFreq = v.freq;
            lfuKey = k;
          }
        }
        if (lfuKey) cache.delete(lfuKey);
      } 
      else if (strategy === 'TTL') {
         let oldestTime = Infinity;
         let oldestKey = null;
         for (const [k, v] of cache.entries()) {
           if (v.timestamp < oldestTime) {
             oldestTime = v.timestamp;
             oldestKey = k;
           }
         }
         if (oldestKey) cache.delete(oldestKey);
      }
      else if (strategy === 'CUSTOM' && customEvict) {
        customEvict(cache);
      }
    }

    return result;
  };
}