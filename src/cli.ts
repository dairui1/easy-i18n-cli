#!/usr/bin/env node

import { Command } from 'commander';
import { translateDir } from './core/translateDir';
import consola from 'consola';

import dotenv from 'dotenv';
import { initProject } from './core/init';

// Initialize dotenv
dotenv.config();

const program = new Command();

program
  .version('0.1.0')
  .description('AI-powered i18n CLI tool')
  .option('-i, --init', 'Initialize easyi18n configuration in the project')
  .option('-l, --locale <locale>', 'Target locale (use "all" for all locales)')
  .option('-f, --file <file>', 'Target file, e.g.: common.json')
  .option('-k, --key <key>', 'Target key, e.g.: home.title')
  .parse(process.argv);

const options = program.opts();

async function main() {
  consola.debug('Starting main function');
  if (options.init) {
    return initProject();
  }

  if (options.locale) {
    // Ensure OPENAI_API_KEY is set
    if (!process.env.OPENAI_API_KEY) {
      consola.error('OPENAI_API_KEY is not set in the environment variables.');
      process.exit(1);
    }

    const targetLocale = options.locale;
    const targetFile = options.file || '';
    const targetKey = options.key;

    consola.debug('Options:', { targetLocale, targetFile, targetKey });

    try {
      consola.debug('Initiating translation');
      await translateDir(targetLocale, targetFile, targetKey);
      consola.success('Translation completed successfully.');
    } catch (error: any) {
      consola.error('Error:', error);
    }
  } else {
    consola.debug('No locale specified, outputting help');
    program.outputHelp();
  }
  consola.debug('Main function completed');
}

main();
