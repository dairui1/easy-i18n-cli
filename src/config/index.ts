import { I18nCliConfig } from 'src/types/config';
import { explorer } from './explorer';

import { z } from 'zod';

const llmConfigSchema = z.object({
  model: z.string().optional(),
  temperature: z.number().optional(),
  maxRetries: z.number().optional(),
  topP: z.number().nullable().optional(),
}).optional();

const configSchema = z.object({
  localeDir: z.string(),
  entry: z.string(),
  entryType: z.enum(['directory', 'file']).optional().default('directory'),
  format: z.enum(['json', 'toml']).optional().default('json'),
  concurrency: z.number().optional().default(3),
  llmConfig: llmConfigSchema,
});


export const getConfig = () => {
  const userConfig = explorer.getConfigFile();
  if (!userConfig) {
    throw new Error('Configuration error: No configuration file found. Please create a configuration file like "easyi18n.config.ts".');
  }

  try {
    const config = configSchema.parse(userConfig);
    // set default model
    if (!config?.llmConfig) {
      config.llmConfig = {};
    }

    if (!config.llmConfig.model) {
      if (process.env.OPENAI_API_HOST?.includes('api.openai.com')) {
        config.llmConfig.model = 'gpt-4o';
      } else if (process.env.OPENAI_API_HOST?.includes('openrouter.ai')) {
        config.llmConfig.model = 'anthropic/claude-3-5-sonnet';
      } else if (process.env.OPENAI_API_HOST?.includes('api.deepseek.com')) {
        config.llmConfig.model = 'deepseek-chat';
      } else if (process.env.OPENAI_API_HOST?.includes('siliconflow')) {
        config.llmConfig.model = 'Qwen/Qwen2.5-7B-Instruct';
      } else {
        throw new Error('Configuration error: No model found. Please set the model in the configuration file');
      }
    }

    return config as I18nCliConfig;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join('\n');
      throw new Error(`Configuration validation error:\n${issues}`);
    }
    throw error;
  }
};
