<!-- markdownlint-disable MD033 MD041 MD036 MD026 -->

<div align='center'>

![scrappeteer](scrappeteer.svg)

Puppeteer project template made for web scraping

<br />

</div>

---

## What's this?

- [GitHub project template](https://github.com/grikomsn/scrappeteer/generate) for your next scraping project
- [Puppeteer-based](https://github.com/GoogleChrome/puppeteer) scraper, crawler, or whatever your call it
- Uses multiple pages or 'workers' to scrape in bulk
- Saves results to `.csv` using [papaparse](https://www.papaparse.com/)

## Why does this exist?

- Browser-based scraping, because some websites are just plain picky
- Learning project, because I like making things from scratch

## How to use it?

- Modify `src/config.ts` with your own values and additional Puppeter configuration
- Modify `src/urls.ts` with your own URL collection
- Modify `src/extractor.ts` with your own page evaluation to extract elements
- Or just modify `src/app.ts` with your needs
- Run `ts-node src/app.ts` or `yarn start` to start scraping
- Saved results will be stored in `data/results.csv`

Published template contains extractor for scraping 100 first pages of [Hacker News](https://news.ycombinator.com/).

## Why not use [a proper crawler](https://github.com/yujiosaka/headless-chrome-crawler)?

Because I am too lazy to Google things but too overkill on creating things.
