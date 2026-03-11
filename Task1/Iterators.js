function* numberGenerator() {
  let i = 1;
  while (true) {
    yield i++;
  }
}

async function processIteratorWithTimeout(iterator, timeoutSeconds) {

  const endTime = Date.now() + (timeoutSeconds * 1000);
  
  let sum = 0;
  let count = 0;

  console.log(`Починаємо обробку. Тайм-аут: ${timeoutSeconds} секунд...`);

  let current = iterator.next();

  while (!current.done && Date.now() < endTime) {
    const value = current.value;
    sum += value;
    count++;

    const average = (sum / count).toFixed(2);
    
    console.log(`Ітерація ${count} | Значення: ${value} | Загальна сума: ${sum} | Середнє: ${average}`);

    await new Promise(resolve => setTimeout(resolve, 100));

    current = iterator.next();
  }

  console.log('Час вийшов або ітератор завершив роботу!');
  console.log(`Фінальна статистика: оброблено ${count} чисел. Сума: ${sum}.`);
}

const myIterator = numberGenerator();

processIteratorWithTimeout(myIterator, 3);