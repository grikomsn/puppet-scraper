import { Configuration } from './scrappeteer/types'

const config: Configuration = {
  filterRequests: true,
  logWorkers: true,
  numberOfWorkers: 10,
  browserOptions: {},
}

export default config
