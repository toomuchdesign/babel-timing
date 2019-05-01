#!/usr/bin/env node

const program = require('commander');
const babelTiming = require('./src').babelTiming;
const pkg = require('./package.json');

function list(val) {
  return val.split(',');
}

program
  .version(pkg.version)
  .usage('<list-of-files>')
  .option('--babel-config <path>', 'babel configuration file')
  .option('--follow-imports', 'follow and compile imported files')
  .option(
    '--import-patterns <comma-separated-list-of-glob-patterns>',
    'configure which imports to follow',
    list
  )
  .option(
    '--resolve-main-fields <comma-separated-list-of-fields>',
    'determine which fields in imported package.json are checked',
    list
  )
  .option(
    '--output <return|console|json>',
    'make results available as',
    'console'
  )
  .parse(process.argv);

babelTiming(
  program.args,
  ({
    babelConfig,
    followImports,
    importPatterns,
    resolveMainFields,
    output,
  } = program)
);
