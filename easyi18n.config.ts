import { defineConfig } from '@easyi18n/cli';

export default defineConfig({
  localeDir: 'src/locales',
  entry: 'src/locales/en',
  format: 'json',
});
