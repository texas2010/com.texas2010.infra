import type { startHomeDockerCompose } from '../helpers/home-docker-compose';
import type { startCloudDockerCompose } from '../helpers/cloud-docker-compose';

export type HomeDockerCompose = Awaited<
  ReturnType<typeof startHomeDockerCompose>
>;

export type CloudDockerCompose = Awaited<
  ReturnType<typeof startCloudDockerCompose>
>;

type E2EState = {
  home?: HomeDockerCompose;
  cloud?: CloudDockerCompose;
};

export const e2eState: E2EState = {};
