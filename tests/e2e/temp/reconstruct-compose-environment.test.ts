// temporary experiment only
// goal: prove worker can reconstruct StartedDockerComposeEnvironment
// from already-running Docker Compose containers

import { describe, it, expect } from 'vitest';
import { getContainerRuntimeClient, type WaitStrategy } from 'testcontainers';

// IMPORT custom for reconnect docker compose environment object
import { StartedGenericContainer } from 'testcontainers/build/generic-container/started-generic-container';
import { parseComposeContainerName } from 'testcontainers/build/container-runtime';
import { mapInspectResult } from 'testcontainers/build/utils/map-inspect-result';
import { BoundPorts } from 'testcontainers/build/utils/bound-ports';
import { selectWaitStrategy } from 'testcontainers/build/wait-strategies/utils/wait-strategy-selector';
import { homeWaitStrategies } from '../helpers/home-docker-compose';

// type Unpacked<T> = T extends (infer U)[] ? U : T;

class StartedDockerComposeEnvironment {
  constructor(
    private readonly startedGenericContainers: {
      [containerName: string]: StartedGenericContainer;
    },
  ) {}

  public getContainer(containerName: string): StartedGenericContainer {
    const container = this.startedGenericContainers[containerName];
    if (!container) {
      const error = `Cannot get container "${containerName}" as it is not running`;
      throw new Error(error);
    }
    return container;
  }
}

const reconnectDockerComposeEnvironment = async (options: {
  projectName: string;
  waitStrategies?: Record<string, WaitStrategy>;
}) => {
  const client = await getContainerRuntimeClient();

  // get container from docker
  const startedContainersList = await client.container.list();
  // console.log('startedContainersList', startedContainersList);

  // search right container
  const projectContainers = startedContainersList.filter((container) => {
    return (
      container.Labels['com.docker.compose.project'] === options.projectName
    );
  });

  console.log(
    projectContainers.map((container) => ({
      names: container.Names,
      service: container.Labels['com.docker.compose.service'],
      project: container.Labels['com.docker.compose.project'],
    })),
  );

  const startedGenericContainers = (
    await Promise.all(
      projectContainers.map(async (startedContainer) => {
        const container = client.container.getById(startedContainer.Id);
        const containerName = parseComposeContainerName(
          options.projectName,
          startedContainer.Names[0],
        );

        const inspectResult = await client.container.inspect(container);
        const mappedInspectResult = mapInspectResult(inspectResult);
        const boundPorts = BoundPorts.fromInspectResult(
          client.info.containerRuntime.hostIps,
          mappedInspectResult,
        );
        const waitStrategy = await selectWaitStrategy({
          client,
          inspectResult,
          waitStrategy: options.waitStrategies?.[containerName],
        });

        await waitStrategy.waitUntilReady(container, boundPorts);

        return new StartedGenericContainer(
          container,
          client.info.containerRuntime.host,
          inspectResult,
          boundPorts,
          containerName,
          waitStrategy,
          true,
        );
      }),
    )
  ).reduce((map, startedGenericContainer) => {
    const containerName = startedGenericContainer.getName();
    return { ...map, [containerName]: startedGenericContainer };
  }, {});

  // create docker compose environment object
  return new StartedDockerComposeEnvironment(startedGenericContainers);
};

describe('temp compose reconstruction experiment', () => {
  it('can find containers for home-test project', async () => {
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
