import { inject } from 'vitest';

export type PlatformName = 'home' | 'cloud';

export type Platform = {
  name: PlatformName;
  baseUrl: string;
};

export function getPlatform(name: PlatformName): Platform {
  switch (name) {
    case 'home':
      return {
        name: 'home',
        baseUrl: inject('homeBaseUrl'),
      };

    case 'cloud':
      return {
        name: 'cloud',
        baseUrl: inject('cloudBaseUrl'),
      };
  }
}

export const platformNames: PlatformName[] = ['home', 'cloud'];
