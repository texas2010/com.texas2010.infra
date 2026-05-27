import { platformNames, type Platform } from './runtime/platform';
import { infraSuite } from './infra-suite';

type SharedPlatformSuiteContext = {
  platform: Platform;
};

type SharedPlatformSuiteCallback = (
  context: SharedPlatformSuiteContext,
) => void;

export function sharedPlatformSuite(
  describeName: string,
  callback: SharedPlatformSuiteCallback,
) {
  for (const platformName of platformNames) {
    infraSuite(platformName, describeName, callback);
  }
}
