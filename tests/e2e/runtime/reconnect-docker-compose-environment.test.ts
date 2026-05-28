import { describe, expect, test } from 'vitest';
import { homeWaitStrategies } from '../helpers/home-docker-compose';
import { reconnectDockerComposeEnvironment } from './reconnect-docker-compose-environment';

describe('reconnectDockerComposeEnvironment', () => {
  test('reconnects to home compose containers and supports api restart', async () => {
    const environment = await reconnectDockerComposeEnvironment({
      projectName: 'home-test',
      waitStrategies: homeWaitStrategies,
    });

    const api = environment.getContainer('api-1');
    const caddy = environment.getContainer('caddy-1');
    const caddyPort = caddy.getMappedPort(80);
    const baseUrl = `http://localhost:${caddyPort}/api`;

    expect(api.getName()).toBe('api-1');
    expect(api.getId()).toBeTruthy();

    const result = await api.exec(['node', '--version']);
    expect(result.exitCode).toBe(0);

    const beforeRestart = await fetch(`${baseUrl}/ping`);
    expect(beforeRestart.status).toBe(200);

    await api.restart();

    const afterRestart = await fetch(`${baseUrl}/ping`);
    expect(afterRestart.status).toBe(200);
  });
});
