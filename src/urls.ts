function createUrl(page = 1) {
  return `https://news.ycombinator.com/?p=${page}`
}

export default Array(100)
  .fill(undefined)
  .map((_, i) => createUrl(i + 1))
