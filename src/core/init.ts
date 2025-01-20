import { detectProject } from "../utils/project-detector";
import fs from 'fs/promises';
import path from 'path';
import consola from 'consola';

/**
 * Initializes the easyi18n configuration in the project
 * Creates a easyi18n.config.ts file for typescript projects
 * Creates a easyi18n.config.js file for javascript projects
 * Creates a easyi18n.config.json file for non-node.js projects
 */
export async function initProject(): Promise<void> {
  consola.info('Initializing easyi18n configuration...');
  try {
    const envPath = path.join(process.cwd(), '.env');
    consola.info('Checking for .env file at:', envPath);
    
    let envContent;
    try {
      envContent = await fs.readFile(envPath, 'utf-8');
      consola.success('.env file found and read successfully');
    } catch {
      consola.info('.env file not found, will create new one');
      envContent = '';
    }

    const envVars = {
      OPENAI_API_KEY: 'your-openai-api-key',
      OPENAI_API_HOST: 'https://api.openai.com/v1'
    };

    let updatedContent = envContent;
    let needsUpdate = false;

    consola.info('Checking required environment variables...');
    for (const [key, defaultValue] of Object.entries(envVars)) {
      if (!envContent.includes(key)) {
        consola.info(`Adding missing environment variable: ${key}`);
        needsUpdate = true;
        updatedContent += `\n${key}=${defaultValue}`;
      } else {
        consola.success(`Environment variable ${key} already exists`);
      }
    }

    if (needsUpdate) {
      consola.info('Creating/updating .env file with required variables...');
      await fs.writeFile(envPath, updatedContent);
      consola.success('.env file updated successfully');
      consola.info('Please add your OpenAI API key to the .env file');
    } else {
      consola.success('All required environment variables are present');
    }
  } catch (error) {
    consola.error('Failed to check/create .env file:', error);
    throw error;
  }

  const projectInfo = await detectProject();
  
  if (!projectInfo.i18nDirectory) {
    consola.warn('No i18n directory detected in project');
  }

  try {
    if (projectInfo.isTypescript) {
      consola.info('TypeScript project detected, creating easyi18n.config.ts');
      const configFilePath = path.join(process.cwd(), 'easyi18n.config.ts');
      await fs.writeFile(configFilePath, `import { defineConfig } from '@easyi18n/cli';

export default defineConfig({
  localeDir: '${projectInfo.i18nDirectory}',
  entry: '${projectInfo.i18nEntry}',
  format: '${projectInfo.i18nFormat}',
});
`);
      consola.info('Created easyi18n.config.ts successfully');
    } else {
      consola.info('Creating easyi18n.config.json');
      const configFilePath = path.join(process.cwd(), 'easyi18n.config.json');
      await fs.writeFile(configFilePath, `{
  "localeDir": "${projectInfo.i18nDirectory}",
  "entry": "${projectInfo.i18nEntry}",
  "format": "${projectInfo.i18nFormat}"
}`);
      consola.info('Created easyi18n.config.json successfully');
    }
  } catch (error) {
    consola.error('Failed to create config file:', error);
    throw error;
  }
}
