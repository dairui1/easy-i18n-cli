import { Dirent } from 'fs';
import fs from 'fs/promises';
import path from 'path';
import consola from 'consola';

interface ProjectInfo {
  isNodeProject: boolean;
  i18nDirectory?: string;
  i18nEntry?: string;
  isTypescript?: boolean;
  i18nStructure?: 'directory' | 'file';
  i18nFormat?: 'json' | 'toml' | 'yaml' | 'other';
}

export async function detectProject(): Promise<ProjectInfo> {
  const cwd = process.cwd();
  const projectInfo: ProjectInfo = {
    isNodeProject: false,
    i18nDirectory: 'src/locales',
    i18nEntry: 'src/locales/en',
    isTypescript: false,
    i18nStructure: 'directory',
    i18nFormat: 'json'
  };

  try {
    // Check if it's a Node.js project by looking for package.json
    const packageJsonPath = path.join(cwd, 'package.json');
    await fs.access(packageJsonPath);
    projectInfo.isNodeProject = true;
    consola.success('Node.js project detected');

    // Check if it's a TypeScript project by looking for tsconfig.json
    try {
      const tsconfigPath = path.join(cwd, 'tsconfig.json');
      await fs.access(tsconfigPath);
      projectInfo.isTypescript = true;
      consola.success('TypeScript project detected');
    } catch {
      projectInfo.isTypescript = false;
      consola.info('Not a TypeScript project');
    }

    // Look for common i18n directories in root and subdirectories
    const i18nDirs = ['locale', 'locales', 'i18n'];
    consola.info('Looking for i18n directories:', i18nDirs.join(', '));
    
    // First check root directory
    for (const dir of i18nDirs) {
      try {
        await fs.access(path.join(cwd, dir));
        projectInfo.i18nDirectory = dir;
        consola.success(`Found i18n directory in root: ${dir}`);
        break;
      } catch {
        continue;
      }
    }

    // If not found in root, check immediate subdirectories
    if (!projectInfo.i18nDirectory) {
      consola.warn('No i18n directory found in root, checking subdirectories...');
      const entries = await fs.readdir(cwd, { withFileTypes: true });
      const subdirs = entries.filter(entry => entry.isDirectory());

      for (const subdir of subdirs) {
        for (const i18nDir of i18nDirs) {
          try {
            const fullPath = path.join(cwd, subdir.name, i18nDir);
            await fs.access(fullPath);
            projectInfo.i18nDirectory = path.join(subdir.name, i18nDir);
            consola.success(`Found i18n directory in subdirectory: ${projectInfo.i18nDirectory}`);
            break;
          } catch {
            continue;
          }
        }
        if (projectInfo.i18nDirectory) break;
      }
    }

    // Detect i18n structure (directory-based or file-based) and format
    if (projectInfo.i18nDirectory) {
      consola.info('Detecting i18n structure and format...');
      const i18nPath = path.join(cwd, projectInfo.i18nDirectory);
      const i18nEntries = await fs.readdir(i18nPath, { withFileTypes: true });
      
      // Check files for structure and format detection
      const files = i18nEntries.filter(entry => !entry.isDirectory());
      const directories = i18nEntries.filter(entry => 
        entry.isDirectory() && entry.name.length === 2 // Simple check for language codes like 'en', 'fr'
      );

      // Detect structure
      if (files.length > 0 && files.some(f => ['.json', '.toml', '.yaml', '.yml'].some(ext => f.name.endsWith(ext)))) {
        projectInfo.i18nStructure = 'file';
        consola.success('Detected file-based i18n structure');
      } else if (directories.length > 0) {
        projectInfo.i18nStructure = 'directory';
        consola.success('Detected directory-based i18n structure');
      }

      // Detect format and set i18nEntry
      const allFiles = files.length > 0 ? files : await getAllFiles(i18nPath);
      if (allFiles.some(f => f.name.endsWith('.json'))) {
        projectInfo.i18nFormat = 'json';
        consola.success('Detected JSON format');
        if (projectInfo.i18nStructure === 'file') {
          projectInfo.i18nEntry = path.join(projectInfo.i18nDirectory, 'en.json');
        }
      } else if (allFiles.some(f => f.name.endsWith('.toml'))) {
        projectInfo.i18nFormat = 'toml';
        consola.success('Detected TOML format');
        if (projectInfo.i18nStructure === 'file') {
          projectInfo.i18nEntry = path.join(projectInfo.i18nDirectory, 'en.toml');
        }
      } else if (allFiles.some(f => f.name.endsWith('.yaml') || f.name.endsWith('.yml'))) {
        projectInfo.i18nFormat = 'yaml';
        consola.success('Detected YAML format');
        if (projectInfo.i18nStructure === 'file') {
          projectInfo.i18nEntry = path.join(projectInfo.i18nDirectory, 'en.yaml');
        }
      } else if (allFiles.length > 0) {
        projectInfo.i18nFormat = 'other';
        consola.warn('Unknown i18n file format');
      }

      // Set i18nEntry for directory structure
      if (projectInfo.i18nStructure === 'directory') {
        projectInfo.i18nEntry = path.join(projectInfo.i18nDirectory, 'en');
        consola.info(`Set i18n entry: ${projectInfo.i18nEntry}`);
      }
    } else {
      consola.warn('No i18n directory found in project');
    }
  } catch (error) {
    // If package.json doesn't exist, it's not a Node.js project
    consola.info('Not a Node.js project');
  }

  return projectInfo;
}

// Helper function to get all files recursively in directory-based structure
async function getAllFiles(dirPath: string): Promise<Dirent[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files = entries.filter(entry => !entry.isDirectory());
  const directories = entries.filter(entry => entry.isDirectory());

  for (const dir of directories) {
    const subFiles = await getAllFiles(path.join(dirPath, dir.name));
    files.push(...subFiles);
  }

  return files;
}