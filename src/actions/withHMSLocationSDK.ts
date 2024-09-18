import { ExpoConfig } from 'expo/config';
import { WarningAggregator, withAppBuildGradle } from 'expo/config-plugins';

import { mergeContents } from '../utils';

export function _applyHMSAGConnectServicesPlugin(appBuildGradle: string) {
  return mergeContents({
    tag: '@armanatz/expo-hms-location-agconnect',
    src: appBuildGradle,
    newSrc: `apply plugin: "com.huawei.agconnect"`,
    anchor: new RegExp(`apply plugin: "com.facebook.react"`),
    offset: 1,
    comment: '//',
  });
}

export function _addHMSImplementation(appBuildGradle: string) {
  return mergeContents({
    tag: '@armanatz/expo-hms-location-implementation',
    src: appBuildGradle,
    newSrc: `    implementation("com.huawei.hms:location:6.12.0.300")`,
    anchor: new RegExp('^\\s*dependencies\\s*{'),
    offset: 1,
    comment: '    //',
  });
}

export function _applyBouncyCastleResolutionFix(appBuildGradle: string) {
  return mergeContents({
    tag: '@armanatz/expo-hms-location-bouncycastle-fix',
    src: appBuildGradle,
    newSrc: `    configurations.all {
        c -> c.resolutionStrategy.eachDependency {
            DependencyResolveDetails dependency ->
                if (dependency.requested.group == 'org.bouncycastle') {
                    dependency.useTarget 'org.bouncycastle:bcprov-jdk15to18:1.70'
                }
        }
    }`,
    anchor: new RegExp('^\\s*android\\s*{'),
    offset: 1,
    comment: '    //',
  });
}

export default function withHMSLocationSDK(
  config: ExpoConfig,
  enableBouncyCastleFix?: boolean,
) {
  return withAppBuildGradle(config, ({ modResults, ...exportedConfig }) => {
    if (modResults.language !== 'groovy') {
      WarningAggregator.addWarningAndroid(
        'withHMSLocationAndroid',
        "Cannot automatically configure app build.gradle if it's not groovy",
      );

      return { modResults, ...exportedConfig };
    }

    if (enableBouncyCastleFix) {
      modResults.contents = _applyBouncyCastleResolutionFix(
        modResults.contents,
      ).contents;
    }

    modResults.contents = _applyHMSAGConnectServicesPlugin(
      modResults.contents,
    ).contents;

    modResults.contents = _addHMSImplementation(modResults.contents).contents;

    return { modResults, ...exportedConfig };
  });
}
