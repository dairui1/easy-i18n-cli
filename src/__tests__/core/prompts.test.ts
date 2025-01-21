import { promptJsonTranslate } from '../../core/prompts';
import { I18nCliConfig } from '../../types/config';

describe('prompts', () => {
  const baseConfig: I18nCliConfig = {
    localeDir: 'src/locales',
    format: 'json',
    entry: 'src/locales/en.json',
    entryType: 'file',
    concurrency: 3,
    llmConfig: {
      model: 'gpt-3.5-turbo'
    }
  };

  describe('promptJsonTranslate', () => {
    it('should generate default prompt without config', () => {
      const prompt = promptJsonTranslate();
      expect(prompt).toContain('You are TranslatorGPT');
      expect(prompt).toContain('Style Guide:');
      expect(prompt).toContain('Maintain consistent tone and style throughout the translation');
      expect(prompt).toContain('Glossary:');
      expect(prompt).toContain('Keep technical terms and brand names untranslated unless specified');
    });

    it('should use custom system prompt from config', () => {
      const config: I18nCliConfig = {
        ...baseConfig,
        promptConfig: {
          systemPrompt: 'Custom system prompt'
        }
      };
      const prompt = promptJsonTranslate(config);
      expect(prompt).toContain('Custom system prompt');
    });

    it('should use custom style guide from config', () => {
      const config: I18nCliConfig = {
        ...baseConfig,
        promptConfig: {
          styleGuide: ['Custom rule 1', 'Custom rule 2']
        }
      };
      const prompt = promptJsonTranslate(config);
      expect(prompt).toContain('Custom rule 1');
      expect(prompt).toContain('Custom rule 2');
    });

    it('should use custom glossary from config', () => {
      const config: I18nCliConfig = {
        ...baseConfig,
        promptConfig: {
          glossary: {
            'term1': 'definition1',
            'term2': 'definition2'
          }
        }
      };
      const prompt = promptJsonTranslate(config);
      expect(prompt).toContain('term1: definition1');
      expect(prompt).toContain('term2: definition2');
    });
  });
}); 