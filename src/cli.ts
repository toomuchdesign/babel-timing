#!/usr/bin/env node
// @ts-nocheck

import { readFileSync } from 'fs';
import program from 'commander';
import { babelTiming, render } from './index';
import pkg from '../package.json';

function list(val: string) {
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
  .option(
    '--resolve-extensions <comma-separated-list-of-extensions>',
    'attempt to resolve these extensions',
    list
  )
  .option('--expand-packages', 'expand node_modules packages results')
  .option('--read-results <path>', 'render results from file at specified path')
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

if (program.readResults && typeof program.readResults === 'string') {
  const path: string = program.readResults;
  const results = JSON.parse(readFileSync(path).toString());
  const rendered = render(
    results,
    // @ts-ignore
    ({ output, outputPath, aggregateBy, paginationSize } = program)
  );

  // @ts-ignore
  return rendered;
}

const rendered = babelTiming(
  program.args,
  ({
    babelConfig,
    followImports,
    include,
    exclude,
    resolveMainFields,
    resolveExtensions,
    expandPackages,
    output,
    outputPath,
    aggregateBy,
    paginationSize,
  } = program)
);
// @ts-ignore
return rendered;
