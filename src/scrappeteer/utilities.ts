import csv, { ParseConfig, UnparseConfig, UnparseObject } from 'papaparse'
import { DirectNavigationOptions, Page } from 'puppeteer'

export function curryEvaluate<T>(
  extractor: () => T,
  workerProps: DirectNavigationOptions
) {
  return async function evaluate(worker: Page, i: number): Promise<T> {
    try {
      return worker.evaluate(extractor)
    } catch (e) {
      await worker.reload(workerProps)
      return evaluate(worker, i)
    }
  }
}

export function parseCsv(
  data: string | File | NodeJS.ReadableStream,
  config?: ParseConfig
) {
  return csv.parse(data, {
    dynamicTyping: true,
    header: true,
    skipEmptyLines: true,
    ...config,
  })
}

export function toCsv(
  data: Object[] | any[][] | UnparseObject,
  config?: UnparseConfig
) {
  return csv.unparse(data, {
    header: true,
    skipEmptyLines: true,
    ...config,
  })
}

export function parseJson(
  text: string,
  reviver?: (this: any, key: string, value: any) => any
) {
  try {
    return JSON.parse(text, reviver)
  } catch (e) {
    return null
  }
}

export function toJson(
  value: any,
  replacer?: (this: any, key: string, value: any) => any,
  space?: string | number
) {
  return JSON.stringify(value, replacer, space)
}

export function flatten<T>(data: T[][]) {
  return data.reduce((a, d) => [...a, ...d])
}
