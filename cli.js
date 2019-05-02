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
    '--include <comma-separated-list-of-glob-patterns>',
    'include provided import paths',
    list
  )
  .option(
    '--exclude <comma-separated-list-of-glob-patterns>',
    'exclude provided import paths',
    list
  )
  .option(
    '--resolve-main-fields <comma-separated-list-of-fields>',
    'determine which fields in imported package.json are checked',
    list
  )
  .option('--expand-packages', 'expand node_modules packages results')
  .option('--expand-plugins', 'expand babel plugins results')
  .option(
    '--output <return|console|json>',
    'make results available as',
    'console'
  )
  .option('--verbose', 'log warnings')
  .parse(process.argv);

babelTiming(
  program.args,
  ({
    babelConfig,
    followImports,
    importPatterns,
    include,
    exclude,
    resolveMainFields,
    expandPackages,
    expandPlugins,
    output,
    verbose,
  } = program)
);
