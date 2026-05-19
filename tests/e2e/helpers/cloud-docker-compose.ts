import path from 'path';
import { Wait } from 'testcontainers';
import { startDockerCompose } from './docker-compose';
import type { PlatformPorts } from './ports';

export const startCloudDockerCompose = async (ports: PlatformPorts) => {
  const composeFilePath = path.resolve(process.cwd());

  const envObj = {
    INFRA_LOCATION: 'cloud',

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
    projectName: 'cloud-test',
    envObj,
    profiles: ['cloud'],
    waitStrategies: {
      'caddy-1': Wait.forHealthCheck(),
      'api-1': Wait.forSuccessfulCommand(
        'curl -fsS http://localhost:3000/ >/dev/null'
      ),
    },
  });

  const caddyService = started.environment.getContainer('caddy-1');
  const caddyPort = caddyService.getMappedPort(80);

  return {
    ...started,
    baseUrl: `http://localhost:${caddyPort}/api`,
  };
};
