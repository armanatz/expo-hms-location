import { ExpoConfig } from 'expo/config';
import { AndroidConfig } from 'expo/config-plugins';

const { withPermissions } = AndroidConfig.Permissions;

export default function withLocationPermissions(
  config: ExpoConfig,
  isBackgroundLocationEnabled?: boolean,
) {
  return withPermissions(
    config,
    [
      'android.permission.ACCESS_COARSE_LOCATION',
      'android.permission.ACCESS_FINE_LOCATION',
      isBackgroundLocationEnabled &&
        'android.permission.ACCESS_BACKGROUND_LOCATION',
    ].filter(Boolean) as string[],
  );
}
