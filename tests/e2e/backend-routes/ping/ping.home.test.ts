import { beforeAll, test, expect } from 'vitest';

import { infraTest } from '../../infra-test';

infraTest('home', 'Route ping', ({ platform }) => {
  beforeAll(() => {
    console.log('ping.home.test.ts BeforeAll', platform.name);
  });

  test('GET /ping', async () => {
    const response = await fetch(`${platform.baseUrl}/ping`);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toStrictEqual({ ping: 'pong' });
  });
});
