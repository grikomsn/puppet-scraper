import { puppeteer } from 'chrome-aws-lambda'
import { Browser, Page, ResourceType } from 'puppeteer-core'

import { defaultConfig, defaultWorkerProps } from './defaults'
import { Configuration, ScrapeOnceProps, ScrapeProps } from './types'
import { curryEvaluate } from './utilities'

export async function createInstance(config: Configuration = {}) {
  config = { ...defaultConfig, ...config }

  const browser: Browser = await puppeteer.launch(config.browserOptions)
  const workers: Page[] = await Promise.all(
    Array(config.numberOfWorkers)
      .fill(undefined)
      .map(() => browser.newPage())
  )

  if (config.filterRequests) {
    await Promise.all(
      workers.map(async worker => {
        await worker.setRequestInterception(true)

        worker.on('request', request => {
          function matchType(type: ResourceType) {
            return request.resourceType() === type
          }

          if (config.blockedResources.some(matchType)) {
            request.abort()
          } else {
            request.continue()
          }
        })
      })
    )
  }

  async function scrapeOnce<T>({
    url,
    extractor,
    workerProps = {},
  }: ScrapeOnceProps<T>) {
    workerProps = { ...defaultWorkerProps, ...workerProps }
    const worker = workers[0]

    if (config.logWorkers) {
      console.log(url)
    }
    await worker.goto(url, workerProps)

    return worker.evaluate(curryEvaluate(extractor, workerProps))
  }

  async function scrape<T>({
    urls,
    extractor,
    workerProps = {},
  }: ScrapeProps<T>) {
    workerProps = { ...defaultWorkerProps, ...workerProps }

    let results: T[] = []
    let index = 0

    while (index < urls.length) {
      const finishedWorkers = await Promise.all(
        workers.reduce(
          (finished, worker) => {
            if (index < urls.length) {
              const url = urls[index++]

              if (config.logWorkers) {
                console.log(`(${index}/${urls.length}) ${url}`)
              }

              return finished.concat(
                worker.goto(url, workerProps).then(() => worker)
              )
            }
            return finished
          },
          [] as Promise<Page>[]
        )
      )

      const extracted = await Promise.all(
        finishedWorkers.map(curryEvaluate(extractor, workerProps))
      )

      results.push(...extracted)
    }

    return results
  }

  function close() {
    return browser.close()
  }

  return { browser, workers, scrapeOnce, scrape, close }
}
