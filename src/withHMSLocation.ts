import type { ExpoConfig } from 'expo/config';
import { createRunOncePlugin } from 'expo/config-plugins';

import {
  withAGConnectServicesFile,
  withLocationPermissions,
  withManifestAppId,
  withMavenRepo,
  withHMSLocationSDK,
} from './actions';

function withHMSLocation(
  config: ExpoConfig,
  options: {
    agConnectServicesFile: string;
    isBackgroundLocationEnabled?: boolean;
    enableBouncyCastleFix?: boolean;
  },
) {
  const {
    agConnectServicesFile,
    isBackgroundLocationEnabled,
    enableBouncyCastleFix,
  } = options;

  if (agConnectServicesFile) {
    config = withAGConnectServicesFile(config, agConnectServicesFile);
    config = withManifestAppId(config, agConnectServicesFile);
  } else {
    console.error(
      '!! withHMSLocationAndroid: agConnectServicesFile is not provided. Ignore this message if you see it while running expo-doctor. Otherwise, please provide the path to your agconnect-services.json file !!',
    );
  }

  config = withLocationPermissions(config, isBackgroundLocationEnabled);
  config = withMavenRepo(config);
  config = withHMSLocationSDK(config, enableBouncyCastleFix);

  return config;
}

export default createRunOncePlugin(
  withHMSLocation,
  '@armanatz/expo-hms-location',
  '1.0.0',
);
