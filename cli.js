#!/usr/bin/env node

const program = require('commander');
const glob = require('glob');
const babelTiming = require('./src').babelTiming;
const pkg = require('./package.json');

program
  .version(pkg.version)
  .arguments('<list-of-files>')
  .usage('<list-of-files>')
  .parse(process.argv);

const filesStack = [];
program.args.forEach(entry => {
  if (glob.hasMagic(entry)) {
    glob(entry, (er, files) => {
      filesStack.push(...files);
    });
  } else {
    filesStack.push(entry);
  }
});

filesStack.forEach(entry => {
  babelTiming(entry);
});
