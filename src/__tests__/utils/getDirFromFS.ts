import type { DirectoryJSON } from 'memfs';

export default function getDirFromFS(
  fsJSON: DirectoryJSON<string | null>,
  rootDir: string,
) {
  return Object.entries(fsJSON)
    .filter(([path, value]) => value !== null && path.startsWith(rootDir))
    .reduce<Record<string, string>>((acc, [path, fileContent]) => {
      if (path.substring(rootDir.length).startsWith('/')) {
        return {
          ...acc,
          [path.substring(rootDir.length + 1)]: fileContent ?? '',
        };
      }

      return {
        ...acc,
        [path.substring(rootDir.length)]: fileContent ?? '',
      };
    }, {});
}
