import { AndroidConfig, XML } from 'expo/config-plugins';
import type { AndroidManifest } from 'expo/config-plugins';
import { fs, vol } from 'memfs';
import path from 'path';

import { _addAppIdToManifest } from '../actions/withManifestAppId';
import getDirFromFS from './utils/getDirFromFS';

const { getMainApplicationOrThrow, findMetaDataItem } = AndroidConfig.Manifest;

const sampleManifestPath = path.resolve(
  __dirname,
  './fixtures/AndroidManifest.xml',
);

const sampleCorrectAGConnectServicesPath = path.resolve(
  __dirname,
  './fixtures/agconnect-services.json',
);

const sampleIncorrectAGConnectServicesPath = path.resolve(
  __dirname,
  './fixtures/agconnect-services-no-app-id.json',
);

const sampleNonJsonAGConnectServicesPath = path.resolve(
  __dirname,
  './fixtures/agconnect-services.txt',
);

const projectRoot = '/app';

jest.mock('fs');

const fsReal = jest.requireActual('fs') as typeof fs;

describe('AndroidManifest.xml modifications', () => {
  beforeAll(() => {
    const sampleManifest = fsReal.readFileSync(sampleManifestPath);

    const sampleCorrectAGConnectServices = fsReal.readFileSync(
      sampleCorrectAGConnectServicesPath,
    );

    const sampleIncorrectAGConnectServices = fsReal.readFileSync(
      sampleIncorrectAGConnectServicesPath,
    );

    const sampleNonJsonAGConnectServices = fsReal.readFileSync(
      sampleNonJsonAGConnectServicesPath,
    );

    vol.fromJSON(
      {
        './android/app/src/AndroidManifest.xml': sampleManifest,
        './agconnect-services.json': sampleCorrectAGConnectServices,
        './agconnect-services-no-app-id.json': sampleIncorrectAGConnectServices,
        './agconnect-services.txt': sampleNonJsonAGConnectServices,
      },
      projectRoot,
    );

    vol.writeFileSync(
      '/app/android/app/src/AndroidManifest.xml',
      sampleManifest,
    );

    vol.writeFileSync(
      '/app/agconnect-services.json',
      sampleCorrectAGConnectServices,
    );

    vol.writeFileSync(
      '/app/agconnect-services-no-app-id.json',
      sampleIncorrectAGConnectServices,
    );

    vol.writeFileSync(
      '/app/agconnect-services.txt',
      sampleNonJsonAGConnectServices,
    );
  });

  afterAll(() => {
    jest.unmock('fs');
    vol.reset();
  });

  it('adds app id', async () => {
    let androidManifestJson = (await XML.parseXMLAsync(
      getDirFromFS(vol.toJSON(), projectRoot)[
        'android/app/src/AndroidManifest.xml'
      ],
    )) as AndroidManifest;

    androidManifestJson = await _addAppIdToManifest(
      androidManifestJson,
      projectRoot,
      './agconnect-services.json',
    );

    const mainApplication = getMainApplicationOrThrow(androidManifestJson);

    expect(
      findMetaDataItem(mainApplication, 'com.huawei.hms.client.appid'),
    ).toBeGreaterThan(-1);

    expect(mainApplication['meta-data']?.[0].$['android:value']).toBe(
      'appid=123456789',
    );
  });

  it('throws an error if app id is not found in agconnect-services.json', async () => {
    const androidManifestJson = (await XML.parseXMLAsync(
      getDirFromFS(vol.toJSON(), projectRoot)[
        'android/app/src/AndroidManifest.xml'
      ],
    )) as AndroidManifest;

    await expect(
      _addAppIdToManifest(
        androidManifestJson,
        projectRoot,
        './agconnect-services-no-app-id.json',
      ),
    ).rejects.toThrow(/app_id/);
  });

  it('throws an error if agconnect-services.json is not found', async () => {
    const androidManifestJson = (await XML.parseXMLAsync(
      getDirFromFS(vol.toJSON(), projectRoot)[
        'android/app/src/AndroidManifest.xml'
      ],
    )) as AndroidManifest;

    await expect(
      _addAppIdToManifest(
        androidManifestJson,
        projectRoot,
        './no-agconnect-services.json',
      ),
    ).rejects.toThrow(/read/);
  });

  it('throws an error if agconnect-services.json is not json', async () => {
    const androidManifestJson = (await XML.parseXMLAsync(
      getDirFromFS(vol.toJSON(), projectRoot)[
        'android/app/src/AndroidManifest.xml'
      ],
    )) as AndroidManifest;

    await expect(
      _addAppIdToManifest(
        androidManifestJson,
        projectRoot,
        './agconnect-services.txt',
      ),
    ).rejects.toThrow(/parse/);
  });
});
