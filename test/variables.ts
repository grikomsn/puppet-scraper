import { ScLaunchOptions } from '..';

export const launchOptions: ScLaunchOptions = {
  ...(process.env.CI
    ? { executablePath: 'google-chrome-stable', args: ['--no-sandbox'] }
    : {}),
  concurrentPages: 5,
};

export const timeout = 10000;
