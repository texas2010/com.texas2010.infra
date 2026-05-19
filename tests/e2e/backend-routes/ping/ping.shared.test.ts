import { describe, expect } from 'vitest';
import { sharedPlatformTest } from '../../shared-platform-test';

describe('Route ping', () => {
  sharedPlatformTest('GET /ping', async ({ baseUrl }) => {
    const response = await fetch(`${baseUrl}/ping`);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toStrictEqual({ ping: 'pong' });
  });
});
