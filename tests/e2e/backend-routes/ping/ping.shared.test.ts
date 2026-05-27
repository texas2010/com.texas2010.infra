import { describe, expect } from 'vitest';
import { sharedPlatformTest } from '../../shared-platform-test';

describe('Route ping', () => {
  sharedPlatformTest('GET /ping', async ({ platform }) => {
    const response = await fetch(`${platform.baseUrl}/ping`);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toStrictEqual({ ping: 'pong' });
  });
});
