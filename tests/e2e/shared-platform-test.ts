import { inject, test } from 'vitest';
import { sharedPlatforms } from './platforms';

type SharedPlatformTestCallback = (platform: {
  name: string;
  baseUrl: string;
}) => Promise<void>;

export const sharedPlatformTest = (
  name: string,
  callback: SharedPlatformTestCallback
) => {
  for (const platform of sharedPlatforms) {
    test(`${name} - ${platform.name}`, async () => {
      const baseUrl = inject(platform.baseUrlKey);

      await callback({
        name: platform.name,
        baseUrl,
      });
    });
  }
};
