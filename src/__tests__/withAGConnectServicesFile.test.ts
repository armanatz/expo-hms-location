import { fs, vol } from 'memfs';
import path from 'path';

import { _copyAGConnectServicesFile } from '../actions/withAGConnectServicesFile';
import getDirFromFS from './utils/getDirFromFS';

const sampleCorrectAGConnectServicesPath = path.resolve(
  __dirname,
  './fixtures/agconnect-services.json',
);

const projectRoot = '/app';
const androidProjectRoot = '/app/android';

jest.mock('fs');

const fsReal = jest.requireActual('fs') as typeof fs;

describe('agconnect-service.json', () => {
  // Setup file system using memfs
  beforeAll(() => {
    const sampleAGConnectServices = fsReal.readFileSync(
      sampleCorrectAGConnectServicesPath,
    );

    vol.fromJSON(
      {
        './agconnect-services.json': sampleAGConnectServices,
      },
      projectRoot,
    );

    vol.writeFileSync('/app/agconnect-services.json', sampleAGConnectServices);
    vol.mkdirSync('/app/android/app', { recursive: true });
  });

  afterAll(() => {
    jest.unmock('fs');
    vol.reset();
  });

  it('copies agconnect-services.json to android/app directory', async () => {
    await _copyAGConnectServicesFile(
      projectRoot,
      androidProjectRoot,
      './agconnect-services.json',
    );

    const files = Object.keys(getDirFromFS(vol.toJSON(), projectRoot));
    expect(files).toContain('android/app/agconnect-services.json');
  });
});
