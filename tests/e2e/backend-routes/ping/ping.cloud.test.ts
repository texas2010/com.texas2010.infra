import { describe, expect, inject, test } from 'vitest';

describe('Route ping', () => {
  test('GET /ping - cloud only', async () => {
    const baseUrl = inject('cloudBaseUrl');

    const response = await fetch(`${baseUrl}/ping`);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toStrictEqual({ ping: 'pong' });
  });
});
