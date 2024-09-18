import { ExpoConfig } from 'expo/config';

import withLocationPermissions from '../actions/withLocationPermissions';

describe('expo config android.permissions modifications', () => {
  it('adds location permissions', () => {
    const sampleExpoConfig: ExpoConfig = {
      slug: 'testproject',
      version: '1',
      name: 'testproject',
      platforms: ['ios', 'android'],
    };

    // Test that it adds permissions correctly
    const firstResult = withLocationPermissions(sampleExpoConfig);
    expect(firstResult).toMatchSnapshot();

    // Test that it doesn't duplicate permissions
    const secondResult = withLocationPermissions(sampleExpoConfig);
    expect(secondResult).toBe(firstResult);
  });

  it('adds background location permissions', () => {
    const sampleExpoConfig: ExpoConfig = {
      slug: 'testproject',
      version: '1',
      name: 'testproject',
      platforms: ['ios', 'android'],
    };

    // Test that it adds permissions - including background location correctly
    const firstResult = withLocationPermissions(sampleExpoConfig, true);
    expect(firstResult).toMatchSnapshot();

    // Test that it doesn't duplicate permissions
    const secondResult = withLocationPermissions(sampleExpoConfig, true);
    expect(secondResult).toBe(firstResult);
  });
});
