import promiseRetry from 'promise-retry';
import Puppeteer, { Page } from 'puppeteer-core';

import {
  DEFAULT_CONCURRENT_PAGES,
  DEFAULT_EVALUATION_RETRIES,
  DEFAULT_PAGE_OPTIONS,
} from './defaults';
import {
  PSBootstrap,
  PSConnect,
  PSLaunch,
  PSUse,
  ScrapeFromUrl,
  ScrapeFromUrls,
} from './types';

const bootstrap: PSBootstrap = async ({
  browser,
  concurrentPages = DEFAULT_CONCURRENT_PAGES,
  maxEvaluationRetries = DEFAULT_EVALUATION_RETRIES,
} = {}) => {
  let pages: Page[] = Array.from({ length: concurrentPages });

  const scrapeFromUrl: ScrapeFromUrl = async (props) => {
    const { url, evaluateFn, pageOptions } = props;

    const mergedPageOptions = {
      ...DEFAULT_PAGE_OPTIONS,
      ...pageOptions,
    };

    let page = pages[0];
    if (!page) {
      page = await browser.newPage();
    }

    return page.goto(url, mergedPageOptions).then(() =>
      promiseRetry(
        async (retry) => {
          try {
            return page.evaluate(evaluateFn);
          } catch (error) {
            await page.reload();
            return retry(error);
          }
        },
        { maxRetryTime: maxEvaluationRetries },
      ),
    );
  };

  const scrapeFromUrls: ScrapeFromUrls = async (props) => {
    const { urls, evaluateFn, pageOptions } = props;

    const mergedPageOptions = {
      ...DEFAULT_PAGE_OPTIONS,
      ...pageOptions,
    };

    pages = await Promise.all(
      pages.map(async (page) => {
        if (!page) page = await browser.newPage();
        return page;
      }),
    );

    let current = 0;
    let total = urls.length;

    const results = [];
    while (current < total) {
      const finishedPages = await Promise.all(
        // eslint-disable-next-line no-loop-func
        pages.reduce<Promise<Page>[]>((finishedPages, page) => {
          if (current <= total) {
            const finishedPage = page
              .goto(urls[current++], mergedPageOptions)
              .then(() => page);

            return finishedPages.concat(finishedPage);
          }
          return finishedPages;
        }, []),
      );

      const evaluatingPages = finishedPages.map((page) =>
        promiseRetry(
          async (retry) => {
            try {
              return page.evaluate(evaluateFn);
            } catch (error) {
              await page.reload();
              return retry(error);
            }
          },
          { maxRetryTime: maxEvaluationRetries },
        ),
      );

      const data = await Promise.all(evaluatingPages);
      results.push(...data);
    }

    return results;
  };

  const close = () => browser.close();

  return {
    scrapeFromUrl,
    scrapeFromUrls,
    close,
    ___internal: {
      browser,
    },
  };
};

const connect: PSConnect = async ({
  concurrentPages,
  maxEvaluationRetries,
  ...opts
} = {}) => {
  const browser = await Puppeteer.connect(opts);
  return bootstrap({ browser, concurrentPages, maxEvaluationRetries });
};

const launch: PSLaunch = async ({
  concurrentPages,
  maxEvaluationRetries,
  ...opts
} = {}) => {
  const browser = await Puppeteer.launch(opts);
  return bootstrap({ browser, concurrentPages, maxEvaluationRetries });
};

const use: PSUse = (opts) => {
  if (!opts.browser) {
    throw new Error('browser is not defined');
  }
  return bootstrap(opts);
};

export const PuppetScraper = { connect, launch, use };
