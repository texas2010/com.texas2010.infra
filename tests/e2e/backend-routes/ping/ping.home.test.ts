import { describe, expect, inject, test } from 'vitest';

describe('Route ping', () => {
  test('GET /ping - home only', async () => {
    const baseUrl = inject('homeBaseUrl');

    const response = await fetch(`${baseUrl}/ping`);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toStrictEqual({ ping: 'pong' });
  });
});
