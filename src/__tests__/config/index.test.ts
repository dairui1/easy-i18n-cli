import { getConfig } from '../../config';
import { explorer } from '../../config/explorer';
import { z } from 'zod';

jest.mock('../../config/explorer');

describe('Config Management', () => {
  const mockExplorer = explorer as jest.Mocked<typeof explorer>;
  
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    delete process.env.OPENAI_API_HOST;
  });

  it('should throw error when no config file found', () => {
    mockExplorer.getConfigFile.mockReturnValue(null);
    expect(() => getConfig()).toThrow('Configuration error: No configuration file found');
  });

  it('should set default model for OpenAI API host', () => {
    process.env.OPENAI_API_HOST = 'api.openai.com';
    mockExplorer.getConfigFile.mockReturnValue({
      localeDir: './locales',
      entry: './src',
      llmConfig: {}
    });

    const config = getConfig();
    expect(config.llmConfig.model).toBe('gpt-4o');
  });

  it('should set default model for OpenRouter API host', () => {
    process.env.OPENAI_API_HOST = 'openrouter.ai';
    mockExplorer.getConfigFile.mockReturnValue({
      localeDir: './locales',
      entry: './src',
      llmConfig: {}
    });

    const config = getConfig();
    expect(config.llmConfig.model).toBe('anthropic/claude-3-5-sonnet');
  });

  it('should set default model for Siliconflow API host', () => {
    process.env.OPENAI_API_HOST = 'siliconflow';
    mockExplorer.getConfigFile.mockReturnValue({
      localeDir: './locales',
      entry: './src',
      llmConfig: {}
    });

    const config = getConfig();
    expect(config.llmConfig.model).toBe('Qwen/Qwen2.5-7B-Instruct');
  });

  it('should set default model for Deepseek API host', () => {
    process.env.OPENAI_API_HOST = 'api.deepseek.com';
    mockExplorer.getConfigFile.mockReturnValue({
      localeDir: './locales',
      entry: './src',
      llmConfig: {}
    });

    const config = getConfig();
    expect(config.llmConfig.model).toBe('deepseek-chat');
  });

  it('should use user-provided model if specified', () => {
    mockExplorer.getConfigFile.mockReturnValue({
      localeDir: './locales',
      entry: './src',
      llmConfig: {
        model: 'custom-model'
      }
    });

    const config = getConfig();
    expect(config.llmConfig.model).toBe('custom-model');
  });

  it('should apply default values correctly', () => {
    mockExplorer.getConfigFile.mockReturnValue({
      localeDir: './locales',
      entry: './src',
      llmConfig: {
        model: 'test-model'
      }
    });

    const config = getConfig();
    expect(config.entryType).toBe('directory');
    expect(config.concurrency).toBe(3);
  });

  it('should throw validation error for invalid config', () => {
    mockExplorer.getConfigFile.mockReturnValue({
      localeDir: 123, // Invalid type
      entry: './src',
      llmConfig: {
        model: 'test-model'
      }
    });

    expect(() => getConfig()).toThrow('Configuration validation error');
  });
});