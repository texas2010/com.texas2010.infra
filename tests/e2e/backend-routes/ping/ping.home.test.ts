import { describe, expect, inject, test } from 'vitest';

describe('Route ping', () => {
  test('GET /ping', async () => {
    const homeBaseUrl = inject('homeBaseUrl');
    console.log('homeBaseUrl', homeBaseUrl);

    const cloudBaseUrl = inject('cloudBaseUrl');
    console.log('cloudBaseUrl', cloudBaseUrl);

    const response = await fetch(`${homeBaseUrl}/ping`);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toStrictEqual({ ping: 'pong' });
  });
});
