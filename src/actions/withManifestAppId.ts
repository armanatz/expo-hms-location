import type { ExpoConfig } from 'expo/config';
import { AndroidConfig, withAndroidManifest } from 'expo/config-plugins';
import fs from 'fs';
import path from 'path';

const { addMetaDataItemToMainApplication, getMainApplicationOrThrow } =
  AndroidConfig.Manifest;

export async function _addAppIdToManifest(
  androidManifest: AndroidConfig.Manifest.AndroidManifest,
  projectRoot: string,
  agConnectServicesFile: string,
): Promise<AndroidConfig.Manifest.AndroidManifest> {
  let filePathToRead = agConnectServicesFile;

  if (agConnectServicesFile.startsWith('.', 0)) {
    filePathToRead = path.join(projectRoot, agConnectServicesFile);
  }

  const mainApplication = getMainApplicationOrThrow(androidManifest);

  try {
    const fileContents = await fs.promises.readFile(filePathToRead, 'utf-8');
    const parsedAGConnectServices: Record<string, any> =
      JSON.parse(fileContents);

    if (
      parsedAGConnectServices &&
      parsedAGConnectServices.app_info &&
      parsedAGConnectServices.app_info.app_id
    ) {
      addMetaDataItemToMainApplication(
        mainApplication,
        'com.huawei.hms.client.appid',
        `appid=${parsedAGConnectServices.app_info.app_id}`,
      );
    } else {
      throw new Error(
        `Could not find app_info.app_id in the agconnect-services.json file at ${filePathToRead}`,
      );
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(
        `withHMSLocation: Could not parse the agconnect-services.json file at ${filePathToRead}`,
      );
    }

    if (error instanceof Error) {
      if (error.message.includes('no such file or directory')) {
        throw new Error(
          `withHMSLocation: Could not read the agconnect-services.json file at ${filePathToRead}`,
        );
      }

      throw new Error(`withHMSLocation: ${error.message}`);
    }
  }

  return androidManifest;
}

export default function withManifestAppId(
  config: ExpoConfig,
  agConnectServicesFile: string,
) {
  return withAndroidManifest(
    config,
    async ({ modResults, modRequest, ...exportedConfig }) => {
      modResults = await _addAppIdToManifest(
        modResults,
        modRequest.projectRoot,
        agConnectServicesFile,
      );
      return { modResults, modRequest, ...exportedConfig };
    },
  );
}
