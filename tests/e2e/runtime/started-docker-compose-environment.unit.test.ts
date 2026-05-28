import { describe, expect, test } from 'vitest';
import type { StartedGenericContainer } from 'testcontainers/build/generic-container/started-generic-container';

import { StartedDockerComposeEnvironment } from './started-docker-compose-environment';

describe('StartedDockerComposeEnvironment', () => {
  test('stores started generic containers from constructor input', () => {
    const apiContainer = {} as StartedGenericContainer;
    const caddyContainer = {} as StartedGenericContainer;

    const startedGenericContainers = {
      'api-1': apiContainer,
      'caddy-1': caddyContainer,
    };

    const environment = new StartedDockerComposeEnvironment(
      startedGenericContainers,
    );

    expect(environment).toEqual({
      startedGenericContainers,
    });
  });

  test('returns object with getContainer method', () => {
    const environment = new StartedDockerComposeEnvironment({});

    expect(environment.getContainer).toBeTypeOf('function');
  });

  test('getContainer returns the matching container', () => {
    const apiContainer = {} as StartedGenericContainer;

    const environment = new StartedDockerComposeEnvironment({
      'api-1': apiContainer,
    });

    expect(environment.getContainer('api-1')).toBe(apiContainer);
  });

  test('getContainer throws when container name does not exist', () => {
    const environment = new StartedDockerComposeEnvironment({});

    expect(() => environment.getContainer('api-1')).toThrow(
      'Cannot get container "api-1" as it is not running',
    );
  });
});
