# @easyi18n/cli

<p align="center">
  <a href="./README.md"><u>English</u></a>
  ·
  <a href="./README_CN.md"><u>简体中文</u></a>
</p>

## Usage

### Installation

```bash
# Using npm
npm install -g @easyi18n/cli

# Using yarn
yarn global add @easyi18n/cli
tr
# Using pnpm
pnpm add -g @easyi18n/cli
```

### Configuration

1. Set up your OpenAI API key in `.env` file:

```env
OPENAI_API_KEY=your_api_key_here
```

2. Create a configuration file `.easyi18nrc.json` in your project root:

```json
{
  "localeDir": "src/locales",
  "format": "json",
  "entry": "src/locales/en",
  "entryType": "directory",
  "concurrency": 3,
  "llmConfig": {
    "model": "gpt-4o",
    "temperature": 0.3,
    "maxRetries": 3
  }
}
```

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

### Directory Structure Example

```
src/
  locales/
    en/
      common.json
      home.json
    zh-CN/
      common.json
      home.json
```
