import { test } from 'vitest';

import { getPlatform, platformNames, type Platform } from './platform';

type SharedPlatformTestCallback = (args: {
  platform: Platform;
}) => Promise<void>;

export function sharedPlatformTest(
  name: string,
  callback: SharedPlatformTestCallback
) {
  for (const platformName of platformNames) {
    test(`${name} - ${platformName}`, async () => {
      const platform = getPlatform(platformName);

      await callback({ platform });
    });
  }
}
