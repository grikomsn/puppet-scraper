import { createInstance } from '../src/scrappeteer/index'
import { flatten, toCsv } from '../src/scrappeteer/utilities'
import fs from 'fs'
import path from 'path'
import {config as dotenvConfig} from 'dotenv';
import { resolve } from "path"
import config from './config'
import extractor from './extractor'
import urls from './urls'

async function app() {
  const sc = await createInstance(config)
  dotenvConfig({ path: resolve(__dirname, "./.env") })

  const pageResults = await sc.scrape({ urls, extractor })
  const results = flatten(pageResults)
  const destination = path.join(__dirname, process.env.TARGET_URL)

  fs.writeFileSync(destination, toCsv(results))

  await sc.close()
}

app()
