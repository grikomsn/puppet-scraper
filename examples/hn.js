const { PuppetScraper } = require('..');

async function hn() {
  const ps = await PuppetScraper.launch();

  const data = await ps.scrapeFromUrl({
    url: 'https://news.ycombinator.com',
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

hn();
