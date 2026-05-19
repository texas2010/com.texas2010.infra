import getPort from 'get-port';

export type PlatformPorts = {
  httpsPort: number;
  httpPort: number;
};

export type E2EPorts = {
  home: PlatformPorts;
  cloud: PlatformPorts;
};

export const getE2EPorts = async (): Promise<E2EPorts> => {
  const homeHttpsPort = await getPort();

  const homeHttpPort = await getPort({
    exclude: [homeHttpsPort],
  });

  const cloudHttpsPort = await getPort({
    exclude: [homeHttpsPort, homeHttpPort],
  });

  const cloudHttpPort = await getPort({
    exclude: [homeHttpsPort, homeHttpPort, cloudHttpsPort],
  });

  return {
    home: {
      httpsPort: homeHttpsPort,
      httpPort: homeHttpPort,
    },
    cloud: {
      httpsPort: cloudHttpsPort,
      httpPort: cloudHttpPort,
    },
  };
};
