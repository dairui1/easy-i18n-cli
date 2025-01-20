import { z } from "zod";
import { getConfig } from "../config";
import { chunkJson, parseLLMOutputForSchema } from '../utils/json';
import { promptJsonTranslate } from './prompts';
import consola from 'consola';
import { parseFile, SupportedFormat } from '../utils/format';
import OpenAI from 'openai';
import { mapLimit } from "async";

/**
 * Maximum size of a chunk for translation.
 * This value is estimated based on my experience.
 * It represents a balance between processing efficiency and API limitations.
 * Larger chunks might lead to API errors, while smaller chunks could increase
 * the number of API calls and overall processing time.
 */
const MAX_CHUNK_SIZE = 8000;

function getInputParams(targetLocale: string): { from: string; to: string; } {
  const from = 'English';
  let to = targetLocale;

  const localeMap: Record<string, string> = {
    br: 'Portuguese',
    cn: 'Simplify Chinese',
    de: 'German',
    es: 'Spanish',
    fr: 'French',
    id: 'Indonesian',
    it: 'Italian',
    jp: 'Japanese',
    kr: 'Korean',
    ru: 'Russian',
    tr: 'Turkish',
    tw: 'Traditional Chinese',
    vn: 'Vietnamese',
    ar: 'Arabic',
    hi: 'Hindi',
    th: 'Thai',
    pl: 'Polish',
    nl: 'Dutch',
    sv: 'Swedish',
    da: 'Danish',
    fi: 'Finnish',
    no: 'Norwegian',
    hu: 'Hungarian',
    cs: 'Czech',
    el: 'Greek',
    he: 'Hebrew',
    ro: 'Romanian',
    uk: 'Ukrainian',
    bg: 'Bulgarian',
    pt: 'Portuguese',
    ms: 'Malay',
    bn: 'Bengali',
    fa: 'Persian',
    ur: 'Urdu',
    vi: 'Vietnamese',
    tl: 'Tagalog',
    sk: 'Slovak',
    lt: 'Lithuanian',
    lv: 'Latvian',
    et: 'Estonian',
    sr: 'Serbian',
    hr: 'Croatian',
    sl: 'Slovenian',
    mk: 'Macedonian',
    sq: 'Albanian',
    ka: 'Georgian',
    hy: 'Armenian',
    az: 'Azerbaijani',
    kk: 'Kazakh',
    uz: 'Uzbek',
    mn: 'Mongolian',
    in: 'Hindi',
  };

  to = localeMap[targetLocale] || targetLocale;

  return { from, to };
}

export async function translateChunks(content: string, targetLocale: string, format: SupportedFormat): Promise<any> {
  const config = getConfig();
  const { from, to } = getInputParams(targetLocale);

  try {
    // Parse the content according to the format
    const parsedContent = parseFile(content, format);
    
    // Convert to JSON for chunking
    const jsonContent = JSON.stringify(parsedContent);
    
    const chunks = chunkJson(jsonContent, MAX_CHUNK_SIZE);

    consola.info(`Chunking file into ${chunks.length} chunks`);

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_API_HOST || 'https://api.openai.com/v1'
    });

    const translatedChunks = await mapLimit(
      chunks,
      config.concurrency,
      async (chunk: string) => {
        const prompt = promptJsonTranslate().replace('{from}', from).replace('{to}', to).replace('{json}', chunk);

        try {
          const completion = await openai.chat.completions.create({
            model: config.llmConfig.model,
            messages: [{ role: 'user', content: prompt }],
            temperature: config.llmConfig.temperature || 0.3,
            top_p: config.llmConfig.topP || 1,
          }, {
            maxRetries: config.llmConfig.maxRetries || 3,
          });

          const translatedText = completion.choices[0]?.message?.content;

          consola.info(`[LLM Call]: ${config.llmConfig.model} - ${completion.usage?.prompt_tokens}/${completion.usage?.completion_tokens} tokens`);

          if (!translatedText) {
            throw new Error(`Invalid API response: ${JSON.stringify(completion)}`);
          }

          return parseLLMOutputForSchema(translatedText, z.record(z.any()));
        } catch (error) {
          consola.error('OpenAI API error:', error);
          throw error;
        }
      });

    // Merge all chunks
    const mergedTranslation = translatedChunks.reduce((acc, chunk) => ({ ...acc, ...chunk }), {});

    // Return in the original format
    return mergedTranslation;
  } catch (error) {
    consola.error('Translation error:', error);
    throw error;
  }
}
