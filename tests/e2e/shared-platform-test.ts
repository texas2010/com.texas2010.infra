import { platformNames, type Platform } from './runtime/platform';
import { infraTest } from './infra-test';

type SharedPlatformTestContext = {
  platform: Platform;
};

type SharedPlatformTestCallback = (context: SharedPlatformTestContext) => void;

export function sharedPlatformTest(
  describeName: string,
  callback: SharedPlatformTestCallback,
) {
  for (const platformName of platformNames) {
    infraTest(platformName, describeName, callback);
  }
}
