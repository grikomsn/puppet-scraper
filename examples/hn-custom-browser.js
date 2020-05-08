const { PuppetScraper } = require('..');

async function hnCustomBrowser() {
  const ps = await PuppetScraper.launch({
    executablePath:
      'C:\\Program Files (x86)\\Microsoft\\Edge Dev\\Application\\msedge.exe',
    headless: false,
  });

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

hnCustomBrowser();
