# @armanatz/expo-hms-location

This Expo config plugin auto-configures @hmscore/react-native-hms-location so that is can be used
inside an Expo application that uses Continuous Native Generation.

## Compatibility

This plugin is currently only for Android and there are no plans to add iOS support at
the moment. I am open to PRs however so feel free to create one if you need iOS support.

This plugin was written and tested against Expo SDK 51.

It goes without saying but this plugin cannot be used in an "Expo Go" app as it requires
custom native code.

## Prerequisites

Ensure that you have a Huawei AppGallery Connect account and have created an Android
project in there before using this plugin.

This is needed because you will require the `agconnect-services.json` file associated
to your project.

## Installation

First install the base React Native HMS Location package:

```sh
npm install --save @hmscore/react-native-hms-location
```

Then install this plugin:

```sh
npx expo install @armanatz/expo-hms-location
```

### Configuration

Add `@armanatz/expo-hms-location` to your app's Expo config file (app.json, or app.config.js).

The plugin exposes the following options:

| Option                         | Type    | Description                                                                 |
|--------------------------------|---------|-----------------------------------------------------------------------------|
| `agConnectServicesFile`        | string  | Path to your `agconnect-services.json` file.                                |
| `isBackgroundLocationEnabled`  | boolean | (Optional) Enable location service in the background                        |
| `enableBouncyCastleFix`        | boolean | (Optional) If you get errors related to `org.bouncycastle` (like when using `expo-updates`), then set this to true                        |

**!! IMPORTANT !!**: The option `agConnectServicesFile` has to be provided, otherwise the prebuild will fail.

---

Example configuration:

```
"expo": {
  ...
  "plugins": [
      [
        "@armanatz/expo-hms-location",
        {
          "agConnectServicesFile": "./path/to/agconnect-services.json",
          "isBackgroundLocationEnabled": true,
          "enableBouncyCastleFix": true
        }
      ]
  ]
}
```

### Post Configuration

After adding the plugin to your Expo config file, ensure you rebuild your app
by running `prebuild` so that the plugin can apply its changes accordingly.

If all goes well, your app should now be able to use the `@hmscore/react-native-hms-location`
package inside your Expo application.

## Changes Made By This Plugin

1. Copies your `agconnect-services.json` file to the `android/app` directory
2. Extracts the App ID of your application from the `agconnect-services.json`
3. Sets extracted App ID in `AndroidManifest.xml`
4. Adds relevant location permissions in `AndroidManifest.xml` as per [Huawei's docs](https://developer.huawei.com/consumer/en/doc/HMS-Plugin-Guides/locationservice-0000001050043283#section2628322193219)
5. Adds the Huawei Developer Maven repo to the project's `build.gradle` file
6. Pins the Android Gradle Build Tools version to `8.6.0` (This is needed because the Huawei SDKs cause build errors without it)
7. Adds the Huawei AGCP SDK to the project's `build.gradle` file
8. Applies the Huawei AGConnect plugin inside the app's `build.gradle` file
9. Adds the Huawei Location Kit SDK to the app's `build.gradle` file
10. If `enableBouncyCastleFix` is set to true, will resolve `org.bouncycastle` dependency
