import {
  Browser,
  ConnectOptions,
  DirectNavigationOptions,
  LaunchOptions,
} from 'puppeteer';

// #region ScrapeFromUrl

export interface ScrapeFromUrlProps<T extends any> {
  url: string;
  evaluateFn: () => T;
  pageOptions?: DirectNavigationOptions;
}

export type ScrapeFromUrl = <T>(
  props: ScrapeFromUrlProps<T>,
) => Promise<T extends PromiseLike<infer U> ? U : T>;

// #endregion

// #region ScrapeFromUrls

export interface ScrapeFromUrlsProps<T extends any> {
  urls: string[];
  evaluateFn: () => T;
  pageOptions?: DirectNavigationOptions;
}

export type ScrapeFromUrls = <T>(
  props: ScrapeFromUrlsProps<T>,
) => Promise<(T extends PromiseLike<infer U> ? U : T)[]>;

// #endregion

// #region Scrappeteer

export interface ScInstance {
  scrapeFromUrl: ScrapeFromUrl;
  scrapeFromUrls: ScrapeFromUrls;
  close: () => Promise<void>;

  ___internal: {
    browser: Browser;
  };
}

export type ScBootstrapProps = {
  browser?: Browser;
  concurrentPages?: number;
  maxEvaluationRetries?: number;
};

export type ScBootstrap = (props?: ScBootstrapProps) => Promise<ScInstance>;

export type ScLaunchOptions = ScBootstrapProps & LaunchOptions;

export type ScLaunch = (opts?: ScLaunchOptions) => ReturnType<ScBootstrap>;

export type ScConnectOptions = ScBootstrapProps & ConnectOptions;

export type ScConnect = (opts: ScConnectOptions) => ReturnType<ScBootstrap>;

export type ScUseOptions = ScBootstrapProps & { browser: Browser };

export type ScUse = (opts: ScUseOptions) => ReturnType<ScBootstrap>;

// #endregion
