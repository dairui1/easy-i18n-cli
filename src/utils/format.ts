import TOML from '@iarna/toml';
import consola from 'consola';

export type SupportedFormat = 'json' | 'toml';

export function parseFile(content: string, format: SupportedFormat = 'json'): Record<string, any> {
  try {
    switch (format) {
      case 'toml':
        const tomlData = TOML.parse(content);
        return tomlData; // No need for double JSON conversion
      case 'json':
      default:
        return JSON.parse(content.trim()); // Trim whitespace to avoid parsing issues
    }
  } catch (error) {
    consola.error(`Failed to parse ${format} content:`, error);
    throw error;
  }
}

export function stringifyFile(data: Record<string, any>, format: SupportedFormat = 'json'): string {
  try {
    switch (format) {
      case 'toml':
        return TOML.stringify(data); // No need for JSON conversion
      case 'json':
      default:
        return JSON.stringify(data, null, 2);
    }
  } catch (error) {
    consola.error(`Failed to stringify ${format} content:`, error);
    throw error;
  }
}