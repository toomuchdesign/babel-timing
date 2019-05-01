#!/usr/bin/env node

const program = require('commander');
const babelTiming = require('./src').babelTiming;
const pkg = require('./package.json');

function commaSeparatedListToArray(list) {
  return list ? list.split(',') : undefined;
}

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
  .option(
    '--resolve-main-fields <comma-separated-list-of-fields>',
    'determine which fields in imported package.json are checked'
  )
  .option('--output <return|console|json>', 'make results available as')
  .parse(process.argv);

babelTiming(program.args, {
  babelConfig: program.babelConfig,
  followImports: program.followImports,
  // followAbsoluteImports: program.followAbsoluteImports,
  importPatterns: commaSeparatedListToArray(program.importPatterns),
  resolveMainFields: commaSeparatedListToArray(program.resolveMainFields),
  output: program.output || 'console',
});
