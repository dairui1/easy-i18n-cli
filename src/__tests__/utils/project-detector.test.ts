import fs from 'fs/promises';
import path from 'path';
import { detectProject } from '../../utils/project-detector';

// Mock fs/promises
jest.mock('fs/promises');
const mockedFs = fs as jest.Mocked<typeof fs>;

describe('detectProject', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should detect non-Node.js project when package.json is missing', async () => {
    mockedFs.access.mockRejectedValue(new Error('File not found'));

    const result = await detectProject();
    expect(result).toEqual({
      isNodeProject: false
    });
  });

  test('should detect Node.js project with i18n directory in root', async () => {
    mockedFs.access.mockImplementation(async (filePath) => {
      if (filePath === path.join(process.cwd(), 'package.json') ||
          filePath === path.join(process.cwd(), 'i18n')) {
        return;
      }
      throw new Error('File not found');
    });

    const result = await detectProject();
    expect(result).toEqual({
      isNodeProject: true,
      i18nDirectory: 'i18n'
    });
  });

  test('should detect Node.js project with locales directory in subdirectory', async () => {
    mockedFs.access.mockImplementation(async (filePath) => {
      if (filePath === path.join(process.cwd(), 'package.json') ||
          filePath === path.join(process.cwd(), 'src', 'locales')) {
        return;
      }
      throw new Error('File not found');
    });

    mockedFs.readdir.mockResolvedValue([
      { name: 'src', isDirectory: () => true } as any
    ]);

    const result = await detectProject();
    expect(result).toEqual({
      isNodeProject: true,
      i18nDirectory: path.join('src', 'locales')
    });
  });

  test('should detect Node.js project without i18n directory', async () => {
    mockedFs.access.mockImplementation(async (filePath) => {
      if (filePath === path.join(process.cwd(), 'package.json')) {
        return;
      }
      throw new Error('File not found');
    });

    mockedFs.readdir.mockResolvedValue([
      { name: 'src', isDirectory: () => true } as any
    ]);

    const result = await detectProject();
    expect(result).toEqual({
      isNodeProject: true
    });
  });
});
