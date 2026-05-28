import { StartedGenericContainer } from 'testcontainers/build/generic-container/started-generic-container';

export class StartedDockerComposeEnvironment {
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
