const { Scrappeteer } = require('..');

async function hn() {
  const sc = await Scrappeteer.launch();

  const data = await sc.scrapeFromUrl({
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

  await sc.close();
}

hn();
