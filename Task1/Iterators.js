async function processIteratorWithTimeout(iterator, timeoutSeconds) {
  const endTime = Date.now() + (timeoutSeconds * 1000);
  let sum = 0, count = 0;
  console.log(`Починаємо обробку. Тайм-аут: ${timeoutSeconds} секунд...`);

  for (let current = iterator.next(); !current.done && Date.now() < endTime; current = iterator.next()) {
    sum += current.value;
    console.log(`Ітерація ${++count} | Значення: ${current.value} | Сума: ${sum} | Середнє: ${(sum / count).toFixed(2)}`);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return { count, sum };
}

module.exports = { processIteratorWithTimeout };