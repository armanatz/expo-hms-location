import { ExpoConfig } from 'expo/config';
import { withDangerousMod } from 'expo/config-plugins';
import fs from 'fs';
import path from 'path';

export async function _copyAGConnectServicesFile(
  projectRoot: string,
  platformProjectRoot: string,
  agConnectServicesFile: string,
) {
  let filePathToRead = agConnectServicesFile;

  if (agConnectServicesFile.startsWith('.', 0)) {
    filePathToRead = path.join(projectRoot, agConnectServicesFile);
  }

  const filePathToWrite = path.join(
    platformProjectRoot,
    'app',
    `agconnect-services.json`,
  );

  if (!fs.existsSync(filePathToWrite)) {
    try {
      const fileContents = await fs.promises.readFile(filePathToRead, 'utf-8');
      await fs.promises.writeFile(filePathToWrite, fileContents);
    } catch (error) {
      throw error;
    }
  }
}

export default function withAGConnectServicesFile(
  config: ExpoConfig,
  agConnectServicesFile: string,
) {
  return withDangerousMod(config, [
    'android',
    async config => {
      await _copyAGConnectServicesFile(
        config.modRequest.projectRoot,
        config.modRequest.platformProjectRoot,
        agConnectServicesFile,
      );

      return config;
    },
  ]);
}
