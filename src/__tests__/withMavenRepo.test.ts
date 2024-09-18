import {
  _addHuaweiMavenRepoToBuildScript,
  _addHuaweiMavenRepoToAllProjects,
  _addHMSAGConnectServicesPlugin,
  _pinAndroidGradleBuildToolsVersion,
} from '../actions/withMavenRepo';

const projectBuildGradle = `buildscript {
    repositories {
        google()
        jcenter()
        mavenCentral()
    }
    dependencies {
        classpath('com.android.tools.build:gradle')
    }
}
`;

describe('project build.gradle modifications', () => {
  it('adds huawei maven repo to buildscript', () => {
    // Test that it adds the repo correctly
    const firstResult = _addHuaweiMavenRepoToBuildScript(projectBuildGradle);
    expect(firstResult.contents).toMatchSnapshot();
    expect(firstResult.didInsertOrReplace).toBe(true);
    expect(firstResult.didClear).toBe(false);

    // Test that it doesn't duplicate the repo
    const secondResult = _addHuaweiMavenRepoToBuildScript(firstResult.contents);
    expect(secondResult.contents).toBe(firstResult.contents);
    expect(secondResult.didInsertOrReplace).toBe(false);
    expect(secondResult.didClear).toBe(false);
  });

  it('creates new allprojects and adds huaewi maven repo to it', () => {
    // Test that it adds the repo correctly
    const firstResult = _addHuaweiMavenRepoToAllProjects(projectBuildGradle);
    expect(firstResult.contents).toMatchSnapshot();
    expect(firstResult.didAppend).toBe(true);
    expect(firstResult.didClear).toBe(false);

    // Test that it doesn't duplicate the repo
    const secondResult = _addHuaweiMavenRepoToAllProjects(firstResult.contents);
    expect(secondResult.contents).toBe(firstResult.contents);
    expect(secondResult.didAppend).toBe(false);
    expect(secondResult.didClear).toBe(false);
  });

  it('adds agcp plugin to buildscript dependencies', () => {
    // Test that it adds the plugin correctly
    const firstResult = _addHMSAGConnectServicesPlugin(projectBuildGradle);
    expect(firstResult.contents).toMatchSnapshot();
    expect(firstResult.didMerge).toBe(true);
    expect(firstResult.didClear).toBe(false);

    // Test that it doesn't duplicate the plugin
    const secondResult = _addHMSAGConnectServicesPlugin(firstResult.contents);
    expect(secondResult.contents).toBe(firstResult.contents);
    expect(secondResult.didMerge).toBe(false);
    expect(secondResult.didClear).toBe(false);
  });

  it('pins android gradle build tools version', () => {
    // Test that it adds the version correctly
    const firstResult = _pinAndroidGradleBuildToolsVersion(projectBuildGradle);
    expect(firstResult.contents).toMatchSnapshot();
    expect(firstResult.didInsertOrReplace).toBe(true);
    expect(firstResult.didClear).toBe(false);

    // Test that it doesn't duplicate the version
    const secondResult = _pinAndroidGradleBuildToolsVersion(
      firstResult.contents,
    );
    expect(secondResult.contents).toBe(firstResult.contents);
    expect(secondResult.didInsertOrReplace).toBe(false);
    expect(secondResult.didClear).toBe(false);
  });
});
