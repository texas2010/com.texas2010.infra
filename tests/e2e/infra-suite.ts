import { describe } from 'vitest';

import {
  getPlatform,
  type PlatformName,
  type Platform,
} from './runtime/platform';

export type InfraSuiteContext = {
  platform: Platform;
};

export type InfraSuiteCallback = (context: InfraSuiteContext) => void;

export function infraSuite(
  platformName: PlatformName,
  describeName: string,
  callback: InfraSuiteCallback,
) {
  describe(`${describeName} - ${platformName}`, () => {
    const platform = getPlatform(platformName);

    callback({ platform });
  });
}
