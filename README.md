<!-- markdownlint-disable MD033 MD041 MD036 -->

<div align='center'>

![scrappeteer](scrappeteer.svg)

Puppeteer project template made for web scraping

> _This is a work in progress but usable template. <br /> Future version of scrappeteer will be published as an npm package. Probably._

<br />

</div>

---

- [What's this](#whats-this)
- [Why does this exist](#why-does-this-exist)
- [How to use it](#how-to-use-it)
- [Why not use a proper crawler](#why-not-use-a-proper-crawler)
- [How do I contribute](#how-do-i-contribute)
- [License](#license)

---

## What's this

- [GitHub project template](https://github.com/grikomsn/scrappeteer/generate) for your next scraping project
- [Puppeteer-based](https://github.com/GoogleChrome/puppeteer) scraper, crawler, or whatever your call it
- Uses multiple pages or 'workers' to scrape in bulk
- Saves results to `.csv` using [papaparse](https://www.papaparse.com/)

## Why does this exist

- Browser-based scraping, because some websites are just plain picky
- Dead simple scraper, because too much features is too much
- Learning project, because I like making things from scratch

## How to use it

- Modify [`src/config.ts`](src/config.ts) with your own values and additional Puppeter configuration
- Modify [`src/urls.ts`](src/urls.ts) with your own URL collection
- Modify [`src/extractor.ts`](src/extractor.ts) with your own page evaluation to extract elements
- Or just modify [`src/app.ts`](src/app.ts) with your own needs
- Run `ts-node src/app.ts` or `yarn start` to start scraping
- Saved results will be stored in `data/results.csv`

Published template contains extractor for scraping 100 first pages of [Hacker News](https://news.ycombinator.com/).

## Why not use [a proper crawler](https://github.com/yujiosaka/headless-chrome-crawler)

Because I am too lazy to Google things but too overkill on creating things.

## How do I contribute

- The original plan was creating scrappeteer as an npm package, so helping me with this would be nice
- Any kind of improvements are welcome, do send a pull request if you'd like

## License

MIT
