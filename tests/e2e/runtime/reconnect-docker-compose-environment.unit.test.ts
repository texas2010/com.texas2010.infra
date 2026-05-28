import { beforeEach, describe, expect, test, vi } from 'vitest';
import type Dockerode from 'dockerode';
import type { ContainerInfo } from 'dockerode';
import type { ContainerRuntimeClient, WaitStrategy } from 'testcontainers';

function createMockContainerRuntimeClient(): ContainerRuntimeClient {
  return {
    compose: {
      down: vi.fn(),
      pull: vi.fn(),
      stop: vi.fn(),
      up: vi.fn(),
    },
    container: {
      getById: vi.fn(),
      inspect: vi.fn(),
      list: vi.fn(async () => [] as ContainerInfo[]),
    },
    image: {},
    info: {
      containerRuntime: {
        host: 'localhost',
        hostIps: [{ address: '127.0.0.1', family: 4 }],
      },
      node: {
        architecture: 'x64',
        platform: 'linux',
        version: process.version,
      },
    },
    network: {},
  } as unknown as ContainerRuntimeClient;
}

let mockClient: ContainerRuntimeClient;

vi.mock('testcontainers', async () => ({
  ...(await vi.importActual('testcontainers')),
  getContainerRuntimeClient: vi.fn(async () => mockClient),
}));

describe('reconnectDockerComposeEnvironment', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockClient = createMockContainerRuntimeClient();
  });

  test('returns empty environment when no containers match compose project', async () => {
    const { reconnectDockerComposeEnvironment } =
      await import('./reconnect-docker-compose-environment');

    const environment = await reconnectDockerComposeEnvironment({
      projectName: 'home-test',
      waitStrategies: {},
    });

    expect(environment).toEqual({
      startedGenericContainers: {},
    });
  });

  test('returns environment with matching compose project containers', async () => {
    const waitStrategy = {
      waitUntilReady: vi.fn(),
    } as unknown as WaitStrategy;

    mockClient.container.list = vi.fn(
      async () =>
        [
          {
            Id: 'api-container-id',
            Names: ['/home-test-api-1'],
            Labels: {
              'com.docker.compose.project': 'home-test',
              'com.docker.compose.service': 'api',
            },
          },
          {
            Id: 'other-api-container-id',
            Names: ['/other-test-api-1'],
            Labels: {
              'com.docker.compose.project': 'other-test',
              'com.docker.compose.service': 'api',
            },
          },
        ] as unknown as ContainerInfo[],
    );

    mockClient.container.getById = vi.fn(
      () => ({ id: 'api-container-id' }) as unknown as Dockerode.Container,
    );

    mockClient.container.inspect = vi.fn(
      async () =>
        ({
          Id: 'api-container-id',
          State: {
            FinishedAt: '0001-01-01T00:00:00Z',
            StartedAt: '2026-01-01T00:00:00Z',
            Running: true,
          },
          Config: {
            Hostname: 'api',
            Labels: {},
          },
          NetworkSettings: {
            Ports: {},
            Networks: {},
          },
        }) as unknown as Dockerode.ContainerInspectInfo,
    );

    const { reconnectDockerComposeEnvironment } =
      await import('./reconnect-docker-compose-environment');

    const environment = await reconnectDockerComposeEnvironment({
      projectName: 'home-test',
      waitStrategies: {
        'api-1': waitStrategy,
      },
    });

    expect(mockClient.container.getById).toHaveBeenCalledWith(
      'api-container-id',
    );
    expect(waitStrategy.waitUntilReady).toHaveBeenCalled();

    expect(environment).toEqual({
      startedGenericContainers: {
        'api-1': expect.any(Object),
      },
    });
  });
});
