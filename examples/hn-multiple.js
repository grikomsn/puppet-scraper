const { PuppetScraper } = require('..');

async function hnMultiple() {
  const ps = await PuppetScraper.launch({
    concurrentPages: 5,
  });

  const urls = Array.from({ length: 5 }).map(
    (_, i) => `https://news.ycombinator.com/news?p=${i + 1}`,
  );

  const data = await ps.scrapeFromUrls({
    urls,
    evaluateFn: () => {
      let items = [];

      document.querySelectorAll('.storylink').forEach((node) => {
        items.push({
          title: node.innerText,
          url: node.href,
        });
      });

      return items;
    },
  });

  console.log({ data });

  await ps.close();
}

hnMultiple();
