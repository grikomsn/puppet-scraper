import { DirectNavigationOptions, LaunchOptions, ResourceType } from 'puppeteer'

export type Configuration = {
  blockedResources?: ResourceType[]
  filterRequests?: boolean
  logWorkers?: boolean
  numberOfWorkers?: number

  browserOptions?: LaunchOptions
}

export type ScrapeOnceProps<T> = {
  url: string
  extractor: () => T
  workerProps?: DirectNavigationOptions
}

export type ScrapeProps<T> = {
  urls: string[]
  extractor: () => T
  workerProps?: DirectNavigationOptions
}
