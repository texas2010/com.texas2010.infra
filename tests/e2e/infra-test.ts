import { describe } from 'vitest';

import {
  getPlatform,
  type PlatformName,
  type Platform,
} from './runtime/platform';

export type InfraTestContext = {
  platform: Platform;
};

export type InfraTestCallback = (context: InfraTestContext) => void;

export function infraTest(
  platformName: PlatformName,
  describeName: string,
  callback: InfraTestCallback,
) {
  describe(`${describeName} - ${platformName}`, () => {
    const platform = getPlatform(platformName);

    callback({ platform });
  });
}
