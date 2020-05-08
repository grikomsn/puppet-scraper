import { PSInstance, PuppetScraper } from '..';
import { sleep } from './utils';
import { launchOptions, timeout } from './variables';

type DataType = { title: string; url: string };

describe('launching instance', () => {
  it(
    'should launch and close without errors',
    () => {
      let instance: PSInstance;

      const instantiateAndClose = async () => {
        instance = await PuppetScraper.launch(launchOptions);
        await instance.close();
      };

      expect(instantiateAndClose).not.toThrow();
    },
    timeout,
  );
});

describe('scrape hacker news from single url', () => {
  let instance: PSInstance;

  beforeAll(() => {
    const creating = PuppetScraper.launch(launchOptions);
    return creating.then((created) => (instance = created));
  }, timeout);

  it(
    'should scrape without errors',
    () => {
      const data = instance
        .scrapeFromUrl({
          url: 'https://news.ycombinator.com',
          evaluateFn: () => {
            let data: DataType[] = [];

            document.querySelectorAll('.storylink').forEach((node) => {
              data.push({
                title: (node as HTMLAnchorElement).innerText,
                url: (node as HTMLAnchorElement).href,
              });
            });

            return data;
          },
        })
        .catch();

      expect(data).resolves.not.toBeNull();
      expect(data).resolves.toHaveLength(30);
      expect(data).resolves.toHaveProperty([0, 'title']);
      expect(data).resolves.toHaveProperty([0, 'url']);

      return data;
    },
    timeout,
  );

  it(
    'should instantiate one page',
    async () => {
      let totalPages = 0;
      const expectedPages = 2;

      // 2 pages due to 1 is default tab opening
      while (totalPages < expectedPages) {
        const pages = await instance.___internal.browser.pages();
        totalPages = pages.length;
        await sleep(1000);
      }

      expect(totalPages).toEqual(expectedPages);
    },
    timeout,
  );

  afterAll(() => {
    return instance.close();
  }, timeout);
});

describe('scrape hacker news from multiple urls', () => {
  let instance: PSInstance;

  beforeAll(async () => {
    const creating = PuppetScraper.launch(launchOptions);
    return creating.then((created) => (instance = created));
  }, timeout);

  it(
    'should scrape without errors',
    () => {
      const pages = 5;
      const urls = Array.from({ length: pages }).map(
        (_, i) => `https://news.ycombinator.com/news?p=${i + 1}`,
      );

      const data = instance
        .scrapeFromUrls({
          urls,
          evaluateFn: () => {
            let items: DataType[] = [];

            document.querySelectorAll('.storylink').forEach((node) => {
              items.push({
                title: (node as HTMLAnchorElement).innerText,
                url: (node as HTMLAnchorElement).href,
              });
            });

            return items;
          },
        })
        .catch();

      expect(data).resolves.not.toBeNull();
      expect(data).resolves.toHaveLength(pages);
      expect(data).resolves.toHaveProperty([0, 0, 'title']);
      expect(data).resolves.toHaveProperty([0, 0, 'url']);

      return data;
    },
    timeout,
  );

  it(
    'should instantiate all pages',
    async () => {
      let totalPages = 0;
      const expectedPages = launchOptions.concurrentPages + 1;

      // concurrent pages + 1 due to default tab opening
      while (totalPages < expectedPages) {
        const pages = await instance.___internal.browser.pages();
        totalPages = pages.length;
        await sleep(1000);
      }

      expect(totalPages).toEqual(expectedPages);
    },
    timeout,
  );

  afterAll(() => {
    return instance.close();
  }, timeout);
});
