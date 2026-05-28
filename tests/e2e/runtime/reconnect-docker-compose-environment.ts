import { getContainerRuntimeClient, type WaitStrategy } from 'testcontainers';
import { StartedGenericContainer } from 'testcontainers/build/generic-container/started-generic-container';
import { selectWaitStrategy } from 'testcontainers/build/wait-strategies/utils/wait-strategy-selector';
import { parseComposeContainerName } from 'testcontainers/build/container-runtime';
import { mapInspectResult } from 'testcontainers/build/utils/map-inspect-result';
import { BoundPorts } from 'testcontainers/build/utils/bound-ports';

import { StartedDockerComposeEnvironment } from './started-docker-compose-environment';

type ReconnectDockerComposeEnvironmentOptions = {
  projectName: string;
  waitStrategies?: Record<string, WaitStrategy>;
};

export const reconnectDockerComposeEnvironment = async (
  options: ReconnectDockerComposeEnvironmentOptions,
) => {
  const client = await getContainerRuntimeClient();
  const startedContainersList = await client.container.list();

  const projectContainers = startedContainersList.filter((container) => {
    return (
      container.Labels['com.docker.compose.project'] === options.projectName
    );
  });

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
          false,
        );
      }),
    )
  ).reduce((map, startedGenericContainer) => {
    const containerName = startedGenericContainer.getName();
    return { ...map, [containerName]: startedGenericContainer };
  }, {});

  return new StartedDockerComposeEnvironment(startedGenericContainers);
};
