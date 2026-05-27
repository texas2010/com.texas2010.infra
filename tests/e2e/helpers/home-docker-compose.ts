import path from 'node:path';
import { Wait } from 'testcontainers';
import { startDockerCompose } from './docker-compose';
import type { PlatformPorts } from './ports';

export const homeWaitStrategies = {
  'caddy-1': Wait.forHealthCheck(),
  'api-1': Wait.forSuccessfulCommand(
    'curl -fsS http://localhost:3000/ >/dev/null',
  ),
};

export const startHomeDockerCompose = async (ports: PlatformPorts) => {
  const composeFilePath = path.resolve(process.cwd());

  const envObj = {
    INFRA_LOCATION: 'home',

    DOCKER_ENV: 'test',
    DOCKER_RESTART: 'no',

    NODE_ENV: 'production',

    HTTPS_PORT: ports.httpsPort.toString(),
    HTTP_PORT: ports.httpPort.toString(),

    DOMAIN: 'localhost',

    CADDYFILE_PATH: './Caddyfile.test',
  };

  const started = await startDockerCompose({
    composeFilePath,
    composeFile: 'docker-compose.yml',
    projectName: 'home-test',
    envObj,
    profiles: ['home'],
    waitStrategies: homeWaitStrategies,
  });

  const caddyService = started.environment.getContainer('caddy-1');
  const caddyPort = caddyService.getMappedPort(80);

  return {
    ...started,
    baseUrl: `http://localhost:${caddyPort}/api`,
  };
};
