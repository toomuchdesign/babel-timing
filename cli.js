#!/usr/bin/env node

const fs = require('fs');
const program = require('commander');
const {babelTiming, render} = require('./src');
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
  .option('--read-results <path>', 'render results from file at specified path')
  .option('--verbose', 'log warnings')
  .option(
    '--output <return|console|json>',
    'make results available as',
    'console'
  )
  .option('--output-path <path>', 'path of output file')
  .option(
    '--aggregate-by <files | plugins>',
    'aggregate output data by files or plugins'
  )
  .option(
    '--pagination-size <number-of-entries>',
    'number of entries displayed per page'
  )
  .parse(process.argv);

if (program.readResults) {
  const results = JSON.parse(fs.readFileSync(program.readResults));
  return render(
    results,
    ({output, outputPath, aggregateBy, paginationSize} = program)
  );
}

return babelTiming(
  program.args,
  ({
    babelConfig,
    followImports,
    include,
    exclude,
    resolveMainFields,
    expandPackages,
    verbose,
    output,
    outputPath,
    aggregateBy,
    paginationSize,
  } = program)
);
