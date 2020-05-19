import {
  Browser,
  ConnectOptions,
  DirectNavigationOptions,
  LaunchOptions,
} from 'puppeteer-core';

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

// #region PuppetScraper

export interface PSInstance {
  scrapeFromUrl: ScrapeFromUrl;
  scrapeFromUrls: ScrapeFromUrls;
  close: () => Promise<void>;

  ___internal: {
    browser: Browser;
  };
}

export type PSBootstrapProps = {
  browser?: Browser;
  concurrentPages?: number;
  maxEvaluationRetries?: number;
};

export type PSBootstrap = (props?: PSBootstrapProps) => Promise<PSInstance>;

export type PSLaunchOptions = PSBootstrapProps & LaunchOptions;

export type PSLaunch = (opts?: PSLaunchOptions) => ReturnType<PSBootstrap>;

export type PSConnectOptions = PSBootstrapProps & ConnectOptions;

export type PSConnect = (opts: PSConnectOptions) => ReturnType<PSBootstrap>;

export type PSUseOptions = PSBootstrapProps & { browser: Browser };

export type PSUse = (opts: PSUseOptions) => ReturnType<PSBootstrap>;

export type PS = {
  connect: PSConnect,
  launch: PSLaunch,
  use: PSUse
}

// #endregion
