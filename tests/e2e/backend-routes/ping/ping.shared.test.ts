import { expect, test } from 'vitest';

import { sharedPlatformSuite } from '../../shared-platform-suite';

sharedPlatformSuite('Route ping', ({ platform }) => {
  test('GET /ping', async () => {
    const response = await fetch(`${platform.baseUrl}/ping`);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toStrictEqual({ ping: 'pong' });
  });
});
