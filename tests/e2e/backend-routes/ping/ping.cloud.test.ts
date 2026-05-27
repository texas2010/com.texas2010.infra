import { beforeAll, test, expect } from 'vitest';

import { infraSuite } from '../../infra-suite';

infraSuite('cloud', 'Route ping', ({ platform }) => {
  beforeAll(() => {
    console.log('ping.cloud.test.ts BeforeAll', platform.name);
  });

  test('GET /ping', async () => {
    const response = await fetch(`${platform.baseUrl}/ping`);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toStrictEqual({ ping: 'pong' });
  });
});
