import { execCommand } from '../utils/execCommand';

export const getDockerComposeConfig = (env: NodeJS.ProcessEnv) => {
  const cmdStr = `make docker-config FORMAT=json`;
  const result = execCommand(cmdStr, {
    env: {
      ...process.env,
      ...env,
      SKIP_ENV_FILE_CHECK: 'true',
    },
  });

  if (!result.ok) {
    throw new Error(result.output);
  }

  return JSON.parse(result.output);
};
