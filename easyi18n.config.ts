import { defineConfig } from '@easyi18n/cli';

export default defineConfig({
  localeDir: 'example/i18next/locales',
  entry: 'example/i18next/locales/en',
  format: 'json',
});

