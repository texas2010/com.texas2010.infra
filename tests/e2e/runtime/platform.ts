import { inject } from 'vitest';

export type PlatformName = 'home' | 'cloud';

export type Platform = {
  name: PlatformName;
  baseUrl: string;
  projectName: 'home-test' | 'cloud-test';
};

export function getPlatform(name: PlatformName): Platform {
  switch (name) {
    case 'home':
      return {
        name: 'home',
        projectName: 'home-test',
        baseUrl: inject('homeBaseUrl'),
      };

    case 'cloud':
      return {
        name: 'cloud',
        projectName: 'cloud-test',
        baseUrl: inject('cloudBaseUrl'),
      };
  }
}

export const platformNames: PlatformName[] = ['home', 'cloud'];
