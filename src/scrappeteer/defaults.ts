import { DirectNavigationOptions } from 'puppeteer'

import { Configuration } from './types'

export const defaultConfig: Configuration = {
  blockedResources: ['font', 'image', 'stylesheet'],
  filterRequests: false,
  logWorkers: true,
  numberOfWorkers: 3,

  browserOptions: {},
}

export const defaultWorkerProps: DirectNavigationOptions = {
  waitUntil: 'networkidle0',
}
