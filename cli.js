#!/usr/bin/env node

const program = require('commander');
const babelTiming = require('./src').babelTiming;
const pkg = require('./package.json');

program
  .version(pkg.version)
  .usage('<list-of-files>')
  .option('--babel-config <path>', 'babel configuration file')
  .option('--follow-imports', 'follow and compile imported files')
  // .option('--follow-absolute-imports', 'follow and compile absolute imports')
  .option(
    '--import-patterns <comma-separated-list-of-glob-patterns>',
    'configure which imports to follow'
  )
  .parse(process.argv);

babelTiming(program.args, {
  babelConfig: program.babelConfig,
  followImports: program.followImports,
  // followAbsoluteImports: program.followAbsoluteImports,
  importPatterns: program.importPatterns
    ? program.importPatterns.split(',')
    : undefined,
});
