const { Scrappeteer } = require('..');

async function hnCustomBrowser() {
  const sc = await Scrappeteer.launch({
    executablePath:
      'C:\\Program Files (x86)\\Microsoft\\Edge Dev\\Application\\msedge.exe',
    headless: false,
  });

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

hnCustomBrowser();
