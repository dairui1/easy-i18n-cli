# @easyi18n/cli

<p align="center">
  <a href="https://github.com/dairui1/easy-i18n-cli/blob/main/README.md"><u>English</u></a>
  ·
  <a href="https://github.com/dairui1/easy-i18n-cli/blob/main/README_CN.md"><u>简体中文</u></a>
</p>

## 使用方法

### 安装

```bash
# 使用 npm
npm install -g @easyi18n/cli

# 使用 yarn
yarn global add @easyi18n/cli

# 使用 pnpm
pnpm add -g @easyi18n/cli
```

### 快速开始

```bash
easyi18n --init
```

初始化后，将创建两个配置文件。请参考下面的配置说明来设置你的 API Key 和其他设置。如果在初始化过程中遇到任何问题，你可以按照配置说明手动配置。

### 配置

1. 在 `.env` 文件中设置你的环境变量：

```env
OPENAI_API_KEY=your_api_key_here
OPENAI_API_HOST=your_openai_api_host_here
```

2. 设置你的 easyi18n 配置文件：
> @easyi18n/cli 使用 [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) 进行配置。你可以通过以下几种方式进行配置：

1. (推荐)`easyi18n.config.js`、`easyi18n.config.ts`、`easyi18n.config.mjs` 或 `easyi18n.config.cjs` 文件
2. `package.json` 中的 `easyi18n` 属性
3. JSON 或 YAML 格式的 `.easyi18nrc` 文件
4. `.easyi18nrc.json`、`.easyi18nrc.yaml`、`.easyi18nrc.yml`、`.easyi18nrc.js`、`.easyi18nrc.ts`、`.easyi18nrc.mjs` 或 `.easyi18nrc.cjs` 文件

#### 配置示例
`easyi18n.config.ts`:
```ts
import { defineConfig } from "@easyi18n/cli";

// 详细字段说明请参考类型定义
export default defineConfig({
  localeDir: "src/locales",
  entry: "src/locales/en",
  format: "json",
  concurrency: 5,
  llmConfig: {
    model: "gpt-4",
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

`llmConfig` 是可选的，如果你不设置它，@easyi18n/cli 将使用 llm 提供商的默认配置。

### 翻译命令

```bash
# 翻译到特定语言
easyi18n -l zh-CN

# 翻译特定文件
easyi18n -l zh-CN -f path/to/file

# 翻译文件中的特定键
easyi18n -l zh-CN -f path/to/file -k key.to.translate

# 翻译到所有配置的语言
easyi18n -l all
```

### 命令选项

- `-l, --locale`: 目标语言（例如：'zh-CN'、'ja'、'ko'）或 'all' 表示所有语言
- `-f, --file`: （可选）要翻译的目标文件
- `-k, --key`: （可选）目标文件中要翻译的特定键
