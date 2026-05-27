import { expect, test } from 'vitest';

import { sharedPlatformTest } from '../../shared-platform-test';

sharedPlatformTest('Route ping', ({ platform }) => {
  test('GET /ping', async () => {
    const response = await fetch(`${platform.baseUrl}/ping`);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toStrictEqual({ ping: 'pong' });
  });
});
