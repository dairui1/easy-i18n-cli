# @easyi18n/cli

<p align="center">
  <a href="https://github.com/dairui1/easy-i18n-cli/blob/main/README.md"><u>English</u></a>
  ·
  <a href="https://github.com/dairui1/easy-i18n-cli/blob/main/README_CN.md"><u>简体中文</u></a>
</p>

## Usage

### Installation

```bash
# Using npm
npm install -g @easyi18n/cli

# Using yarn
yarn global add @easyi18n/cli

# Using pnpm
pnpm add -g @easyi18n/cli
```

### Quick Start

```bash
easyi18n --init
```

After initialization, two configuration files will be created. Please refer to the configuration instructions below to set up your API Key and other settings. If you encounter any issues during initialization, you can manually configure according to the configuration instructions.

### Configuration

1. Set up your environment variables in `.env` file:

```env
OPENAI_API_KEY=your_api_key_here
OPENAI_API_HOST=your_openai_api_host_here
```

2. Set up your easyi18n config file:
> @easyi18n/cli uses [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) for configuration. You can configure it in several ways:

1. (recommended)`easyi18n.config.js`, `easyi18n.config.ts`, `easyi18n.config.mjs`, or `easyi18n.config.cjs` file
2. `easyi18n` property in `package.json`
3. `.easyi18nrc` file in JSON or YAML format
4. `.easyi18nrc.json`, `.easyi18nrc.yaml`, `.easyi18nrc.yml`, `.easyi18nrc.js`, `.easyi18nrc.ts`, `.easyi18nrc.mjs`, or `.easyi18nrc.cjs` file

#### Configuration Example
`easyi18n.config.ts`:
```ts
import { defineConfig } from "@easyi18n/cli";

// For detailed field descriptions, please refer to the type definitions
export default defineConfig({
  localeDir: "src/locales",
  entry: "src/locales/en",
  format: "json",
  concurrency: 5,
  llmConfig: {
    model: "gpt-4o",
    temperature: 0.3,
  },
});
```

`.easyi18nrc.json`:
```json
{
  "localeDir": "src/locales/toml",
  "entry": "src/locales/toml/en",
  "format": "toml"
}
```

`llmConfig` is optional, if you don't set it, @easyi18n/cli will use the default configuration by llm provider.

### Translation Commands

```bash
# Translate to a specific locale
easyi18n -l zh-CN

# Translate a specific file
easyi18n -l zh-CN -f path/to/file

# Translate a specific key in a file
easyi18n -l zh-CN -f path/to/file -k key.to.translate

# Translate to all configured locales
easyi18n -l all
```

### Command Options

- `-l, --locale`: Target locale (e.g., 'zh-CN', 'ja', 'ko') or 'all' for all locales
- `-f, --file`: (Optional) Target file to translate
- `-k, --key`: (Optional) Specific key to translate in the target file

### Roadmap

#### ✅ Completed Features
- Basic CLI setup and configuration
- Support for multiple configuration formats
- Integration with OpenAI API for translations
- File-based and key-based translation support
- Multiple locale file formats support (JSON, TOML)
- Concurrent translation processing
- Custom LLM configuration options
- Custom translation rules and glossary

#### 🚀 Planned Features
- Support for more translation providers
- Translation memory and caching
- Auto-detection of new translation keys
- Real-time translation progress tracking
- Translation quality validation
- Translation cost estimation
- Batch translation optimization
- Web UI for translation management
