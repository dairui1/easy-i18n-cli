/**
 * Configuration interface for the i18n CLI tool.
 */
export interface I18nCliConfig {
  /**
   * The path to the directory containing locale files.
   * @example 'src/locales'
   */
  localeDir: string;

  /**
   * The format of the locale files.
   * @default 'json'
   */
  format: 'json' | 'toml';

  /**
   * The path to the entry file or directory for processing.
   * Can be either a single file or a directory containing multiple files.
   * @example 'src/locales/en.json' for entryType=file or 'src/locales/en' for entryType=directory
   */
  entry: string;

  /**
   * Specifies whether the entry is a single file or a directory.
   * 'file' for a single file, 'directory' for a directory containing multiple files.
   * @default 'directory'
   */
  entryType: 'directory' | 'file';

  /**
   * The number of concurrent operations to run.
   * @default 3
   */
  concurrency: number;

  /**
   * Configuration for the Language Model (LLM) used in translation.
   */
  llmConfig: {
    /**
     * The name or identifier of the LLM model to use.
     */
    model: string;
    /**
     * The temperature setting for the LLM, controlling randomness in output.
     */
    temperature?: number;
    /**
     * The maximum number of retry attempts for failed LLM requests.
     */
    maxRetries?: number;
    /**
     * The top_p parameter for the LLM, controlling diversity in output.
     */
    topP?: number | undefined;
  };

  /**
   * Configuration for translation prompts and guides
   */
  promptConfig?: {
    /**
     * Custom system prompt for the translation model
     */
    systemPrompt?: string;
    /**
     * Style guide for translation
     */
    styleGuide?: string[];
    /**
     * Glossary for translation terminology
     */
    glossary?: Record<string, string>;
  };
}

/**
 * Configuration interface for environment variables.
 */
export interface EnvConfig {
  /**
   * OpenAI API Key for authentication.
   */
  OPENAI_API_KEY: string;

  /**
   * OpenAI API Host URL.
   */
  OPENAI_API_HOST: string;

  // /**
  //  * The endpoint URL for LangChain API.
  //  */
  // LANGCHAIN_ENDPOINT: string;

  // /**
  //  * API key for authenticating with LangChain services.
  //  */
  // LANGCHAIN_API_KEY: string;

  // /**
  //  * The identifier for the LangChain project being used.
  //  */
  // LANGCHAIN_PROJECT: string;

  // /**
  //  * Flag to enable Langfuse tracing.
  //  */
  // LANGFUSE_TRACING: string;

  // /**
  //  * Secret key for authenticating with Langfuse services.
  //  */
  // LANGFUSE_SECRET_KEY: string;

  // /**
  //  * Public key for authenticating with Langfuse services.
  //  */
  // LANGFUSE_PUBLIC_KEY: string;

  // /**
  //  * The host URL for Langfuse services.
  //  */
  // LANGFUSE_HOST: string;
}
