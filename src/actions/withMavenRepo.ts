import { ExpoConfig } from 'expo/config';
import { WarningAggregator, withProjectBuildGradle } from 'expo/config-plugins';

import {
  appendContents,
  insertOrReplaceContentInBlock,
  mergeContents,
} from '../utils';

export function _addHuaweiMavenRepoToBuildScript(projectBuildGradle: string) {
  return insertOrReplaceContentInBlock({
    mode: 'insert',
    tag: '@armanatz/expo-hms-location-maven-buildscript',
    blockName: 'buildscript',
    src: projectBuildGradle,
    newSrc: `        maven { url 'https://developer.huawei.com/repo/' }`,
    anchor: 'mavenCentral()',
    comment: '        //',
  });
}

export function _addHuaweiMavenRepoToAllProjects(projectBuildGradle: string) {
  return appendContents({
    tag: '@armanatz/expo-hms-location-maven-allprojects',
    src: projectBuildGradle,
    newSrc: `allprojects {
    repositories {
        maven { url 'https://developer.huawei.com/repo/' }
    }
}`,
    comment: '//',
  });
}

export function _addHMSAGConnectServicesPlugin(projectBuildGradle: string) {
  return mergeContents({
    tag: '@armanatz/expo-hms-location-agconnect',
    src: projectBuildGradle,
    newSrc: `        classpath('com.huawei.agconnect:agcp:1.9.1.301')`,
    anchor: new RegExp('^\\s*dependencies\\s*{'),
    offset: 1,
    comment: '        //',
  });
}

export function _pinAndroidGradleBuildToolsVersion(projectBuildGradle: string) {
  return insertOrReplaceContentInBlock({
    mode: 'replace',
    tag: '@armanatz/expo-hms-location-buildscript-buildtools',
    blockName: 'buildscript',
    src: projectBuildGradle,
    newSrc: `        classpath('com.android.tools.build:gradle:8.6.0')`,
    anchor: "classpath('com.android.tools.build:gradle')",
    comment: '        //',
  });
}

export default function withMavenRepo(config: ExpoConfig) {
  return withProjectBuildGradle(config, ({ modResults, ...exportedConfig }) => {
    if (modResults.language !== 'groovy') {
      WarningAggregator.addWarningAndroid(
        'withHMSLocationAndroid',
        "Cannot automatically configure app build.gradle if it's not groovy",
      );

      return { modResults, ...exportedConfig };
    }

    modResults.contents = _addHuaweiMavenRepoToBuildScript(
      modResults.contents,
    ).contents;

    modResults.contents = _addHuaweiMavenRepoToAllProjects(
      modResults.contents,
    ).contents;

    modResults.contents = _pinAndroidGradleBuildToolsVersion(
      modResults.contents,
    ).contents;

    modResults.contents = _addHMSAGConnectServicesPlugin(
      modResults.contents,
    ).contents;

    return { modResults, ...exportedConfig };
  });
}
