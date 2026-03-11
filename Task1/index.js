const { numberGenerator } = require('./Generators');
const { processIteratorWithTimeout } = require('./Iterators');

module.exports = { numberGenerator, processIteratorWithTimeout };

if (require.main === module) {
  const timeoutSeconds = parseFloat(process.argv[2]) || 2;
  const iterator = numberGenerator();
  processIteratorWithTimeout(iterator, timeoutSeconds)
    .then(({ count, sum }) => console.log(`Finished after ${count} iterations, sum=${sum}`))
    .catch(console.error);
}