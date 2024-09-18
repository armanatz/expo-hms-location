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

  if (!agConnectServicesFile) {
    throw new Error(
      'withHMSLocationAndroid: You must provide the path to your agconnect-services.json file',
    );
  }

  config = withAGConnectServicesFile(config, agConnectServicesFile);
  config = withLocationPermissions(config, isBackgroundLocationEnabled);
  config = withManifestAppId(config, agConnectServicesFile);
  config = withMavenRepo(config);
  config = withHMSLocationSDK(config, enableBouncyCastleFix);

  return config;
}

export default createRunOncePlugin(
  withHMSLocation,
  '@armanatz/expo-hms-location',
  '1.0.0',
);
