import dedent from 'dedent';
import { I18nCliConfig } from '../types/config';

const getDefaultStyleGuide = () => [
  'Maintain consistent tone and style throughout the translation',
  'Consider cultural connotations and regional differences',
  'Adapt content naturally to the target language while preserving meaning',
  'Use appropriate formality level for the target audience',
  'Follow target language punctuation and formatting conventions',
];

const formatReference = (styleGuide?: string[], glossary?: Record<string, string>) => {
  const styleGuideText = styleGuide || getDefaultStyleGuide();
  const glossaryText = glossary
    ? Object.entries(glossary).map(([term, definition]) => `  - ${term}: ${definition}`).join('\n')
    : '  - Keep technical terms and brand names untranslated unless specified\n  - Use consistent terminology throughout the translation';

  return dedent`
    You possess a deep understanding of linguistic nuances. Follow these guidelines:

    Style Guide:
    ${styleGuideText.map(rule => `  - ${rule}`).join('\n')}

    Glossary:
    ${glossaryText}
  `;
};

export const promptJsonTranslate = (config?: I18nCliConfig) => {
  const reference = formatReference(config?.promptConfig?.styleGuide, config?.promptConfig?.glossary);
  const systemPrompt = config?.promptConfig?.systemPrompt || 
    'You are TranslatorGPT, a powerful language model designed for seamless translation across multiple languages. You have been trained on a vast corpus of linguistic data and possess a deep understanding of grammar, syntax, and vocabulary of every language in the world.';
  
  return dedent`
    ${systemPrompt}
    <reference>${reference}</reference>
    Maintain the original keys and ensure the output is a valid i18n JSON file.

    Human: Translate the i18n JSON file from {from} to {to} according to the BCP 47 standard. Only output JSON format:
    \`\`\`json
    {json}
    \`\`\`
  `;
};

/** @WIP */
// export const promptReviewTranslation = (originalText: string, translations: string[]) => {
//   return dedent`You are a translation reviewer. Evaluate translations and provide the best option or a correction if needed.

// Original: "${originalText}"
// ${translations.map((translation, index) => `${String.fromCharCode(65 + index)}: "${translation}"`).join('\n')}
// Evaluate and output JSON:
// \`\`\`json
// {
//   "original_text": "${originalText}",
//   "best_translation": "",
// }
// \`\`\``;
// };