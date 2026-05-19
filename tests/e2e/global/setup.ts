import { startHomeDockerCompose } from '../helpers/home-docker-compose';
import { startCloudDockerCompose } from '../helpers/cloud-docker-compose';
import { getE2EPorts } from '../helpers/ports';

let home: Awaited<ReturnType<typeof startHomeDockerCompose>> | undefined;
let cloud: Awaited<ReturnType<typeof startCloudDockerCompose>> | undefined;

export async function setup(project: any) {
  const ports = await getE2EPorts();

  home = await startHomeDockerCompose(ports.home);
  cloud = await startCloudDockerCompose(ports.cloud);

  project.provide('homeBaseUrl', home.baseUrl);
  project.provide('cloudBaseUrl', cloud.baseUrl);
}

export async function teardown() {
  await home?.environment.down();
  await cloud?.environment.down();
}
