function* numberGenerator() {
  let i = 1;
  while (true) {
    yield i++;
  }
}

module.exports = { numberGenerator };