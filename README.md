<!-- markdownlint-disable MD014 MD033 MD041 -->

<div align="center">

[![puppet-scraper](./header.png)](.)

![github release](https://badgen.net/github/release/grikomsn/puppet-scraper?icon=github)
![npm version](https://badgen.net/npm/v/puppet-scraper?icon=npm)

</div>

---

- [Brief example](#brief-example)
- [Usage](#usage)
  - [Installing dependency](#installing-dependency)
  - [Instantiation](#instantiation)
  - [Customize options](#customize-options)
  - [Scraping single page](#scraping-single-page)
  - [Scraping multiple pages](#scraping-multiple-pages)
  - [Closing instance](#closing-instance)
  - [Access the browser instance](#access-the-browser-instance)
- [Contributing](#contributing)
- [License](#license)

---

**PuppetScraper is a opinionated wrapper library for utilizing [Puppeteer](https://github.com/puppeteer/puppeteer) to scrape pages easily, bootstrapped using [Jared Palmer's tsdx](https://github.com/jaredpalmer/tsdx).**

Most people create a new scraping project by `require`-ing Puppeteer and create their own logic to scrape pages, and that logic will get more complicated when trying to use multiple pages.

PuppetScraper allows you to just pass the URLs to scrape, the function to evaluate (the scraping logic), and how many pages (or tabs) to open at a time. Basically, PuppetScraper abstracts the need to create multiple page instances and retrying the evaluation logic.

**Version 0.1.0 note**: PuppetScraper was initially made as a project template rather than a wrapper library, but the core logic is still the same with various improvements and without extra libraries, so you can include PuppetScraper in your project easily using `npm` or `yarn`.

## Brief example

Here's a [basic example](./examples/hn.js) on scraping the entries on [first page Hacker News](https://news.ycombinator.com):

```js
// examples/hn.js

const { PuppetScraper } = require('puppet-scraper');

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
```

View more examples on the [`examples` directory](./examples).

## Usage

### Installing dependency

Install `puppet-scraper` via `npm` or `yarn`:

```console
$ npm install puppet-scraper
      --- or ---
$ yarn add puppet-scraper
```

Install peer dependency `puppeteer` or Puppeteer equivalent ([`chrome-aws-lambda`](https://github.com/alixaxel/chrome-aws-lambda), untested):

```console
$ npm install puppeteer
      --- or ---
$ yarn add puppeteer
```

### Instantiation

Create the PuppetScraper instance, either launching a new browser instance, connect or use an existing browser instance:

```js
const { PuppetScraper } = require('puppet-scraper');
const Puppeteer = require('puppeteer');

// launches a new browser instance
const instance = await PuppetScraper.launch();

// connect to an existing browser instance
const external = await PuppetScraper.connect({
  browserWSEndpoint: 'ws://127.0.0.1:9222/devtools/browser/...',
});

// use an existing browser instance
const browser = await Puppeteer.launch();
const existing = await PuppetScraper.use({ browser });
```

### Customize options

`launch` and `connect` has the same props with `Puppeteer.launch` and `Puppeteer.connect`, but with an extra `concurrentPages` and `maxEvaluationRetries` property:

```js
const { PuppetScraper } = require('puppet-scraper');

const instance = await PuppetScraper.launch({
  concurrentPages: 3,
  maxEvaluationRetries: 10
  headless: false,
});
```

`concurrentPages` is for how many pages/tabs will be opened and use for scraping.

`maxEvaluationRetries` is for how many times the page will try to evaluate the given function on `evaluateFn` (see below), where if the evaluation throws an error, the page will reload and try to re-evaluate again.

If `concurrentPages` and `maxEvaluationRetries` is not determined, it will use the [default values](./src/defaults.ts):

```ts
export const DEFAULT_CONCURRENT_PAGES = 3;
export const DEFAULT_EVALUATION_RETRIES = 10;
```

### Scraping single page

As shown like the example above, use `.scrapeFromUrl` and pass an object with the following properties:

- `url: string`, page URL to be opened
- `evaluateFn: function`, function to evaluate (scraper method)
- `pageOptions: object`, [`Puppeteer.DirectNavigationOptions`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/puppeteer/index.d.ts#L551) props to override page behaviors

```js
const data = await instance.scrapeFromUrl({
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
```

`pageOptions` defaults the `waitUntil` property to `networkidle0`, which you can read more on the [API documentation](https://pptr.dev/#?product=Puppeteer&version=v3.0.2&show=api-pagegotourl-options).

### Scraping multiple pages

Same as `.scrapeFromUrl` but passes `urls` property which contain `string`s of URL:

- `urls: string[]`, page URLs to be opened
- `evaluateFn: function`, function to evaluate (scraper method)
- `pageOptions: object`, [`Puppeteer.DirectNavigationOptions`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/puppeteer/index.d.ts#L551) props to override page behaviors

```js
const urls = Array.from({ length: 5 }).map(
  (_, i) => `https://news.ycombinator.com/news?p=${i + 1}`,
);

const data = await instance.scrapeFromUrls({
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
```

### Closing instance

When there's nothing left to do, don't forget to close the instance with closes the browser:

```js
await instance.close();
```

### Access the browser instance

PuppetScraper also exposes the browser instance if you want to do things manually:

```js
const browser = instance.___internal.browser;
```

## Contributing

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://griko.id"><img src="https://avatars1.githubusercontent.com/u/8220954?v=4" width="100px;" alt=""/><br /><sub><b>Griko Nibras</b></sub></a><br /><a href="https://github.com/grikomsn/puppet-scraper/commits?author=grikomsn" title="Code">💻</a> <a href="#maintenance-grikomsn" title="Maintenance">🚧</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors][all-contributors] specification.
Contributions of any kind welcome!

## License

[MIT License, Copyright (c) 2020 Griko Nibras](./LICENSE)

[all-contributors]: https://github.com/all-contributors/all-contributors
