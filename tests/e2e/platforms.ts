import type { ProvidedContext } from 'vitest';

type Platform = {
  name: 'home' | 'cloud';
  baseUrlKey: keyof ProvidedContext;
};

export const sharedPlatforms: Platform[] = [
  {
    name: 'home',
    baseUrlKey: 'homeBaseUrl',
  },
  {
    name: 'cloud',
    baseUrlKey: 'cloudBaseUrl',
  },
];
