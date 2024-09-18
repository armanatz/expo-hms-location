import {
  _applyBouncyCastleResolutionFix,
  _addHMSImplementation,
  _applyHMSAGConnectServicesPlugin,
} from '../actions/withHMSLocationSDK';

const appBuildGradle = `apply plugin: "com.facebook.react"

android {
}

dependencies {
}`;

describe('app build.gradle modifications', () => {
  it('applies agcp plugin', () => {
    // Test that it adds the plugin correctly
    const firstResult = _applyHMSAGConnectServicesPlugin(appBuildGradle);
    expect(firstResult.contents).toMatchSnapshot();
    expect(firstResult.didMerge).toBe(true);
    expect(firstResult.didClear).toBe(false);

    // Test that it doesn't duplicate the plugin
    const secondResult = _applyHMSAGConnectServicesPlugin(firstResult.contents);
    expect(secondResult.contents).toBe(firstResult.contents);
    expect(secondResult.didMerge).toBe(false);
    expect(secondResult.didClear).toBe(false);
  });

  it('adds hms implementation to dependencies', () => {
    // Test that it adds the implementation correctly
    const firstResult = _addHMSImplementation(appBuildGradle);
    expect(firstResult.contents).toMatchSnapshot();
    expect(firstResult.didMerge).toBe(true);
    expect(firstResult.didClear).toBe(false);

    // Test that it doesn't duplicate the implementation
    const secondResult = _addHMSImplementation(firstResult.contents);
    expect(secondResult.contents).toBe(firstResult.contents);
    expect(secondResult.didMerge).toBe(false);
    expect(secondResult.didClear).toBe(false);
  });

  it('applies bouncy castle resolution fix', () => {
    // Test that it applies the fix correctly
    const firstResult = _applyBouncyCastleResolutionFix(appBuildGradle);
    expect(firstResult.contents).toMatchSnapshot();
    expect(firstResult.didMerge).toBe(true);
    expect(firstResult.didClear).toBe(false);

    // Test that it doesn't duplicate the fix
    const secondResult = _applyBouncyCastleResolutionFix(firstResult.contents);
    expect(secondResult.contents).toBe(firstResult.contents);
    expect(secondResult.didMerge).toBe(false);
    expect(secondResult.didClear).toBe(false);
  });
});
