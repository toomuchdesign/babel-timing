import fs from 'fs';
import path from 'path';
import { transformSync } from '@babel/core';
import multimatch from 'multimatch';
import getImports from './getImports';
import { globPatternsToPaths, onlyUnique } from '../utils';
import Timer from '../Timer';
import render from '../render';
import { Options, OptionsWithDefaults } from '../types';

export default async function babelTiming(
  filePatterns = [],
  {
    babelConfig = false,
    followImports = false,
    include = ['**'],
    exclude = ['**/node_modules/**'],
    resolveMainFields = ['browser', 'module', 'main'],
    resolveExtensions = ['.js', '.jsx', '.mjs', '.ts'],
    expandPackages = false,
    output = 'return',
    outputPath = './babel-timing-results.json',
    aggregateBy = 'files',
    paginationSize = 10,
  }: Options = {}
) {
  const options: OptionsWithDefaults = {
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
  };
  let files = globPatternsToPaths(filePatterns);

  // Follow and recursively resolve all relative imports
  if (followImports) {
    const rawImportedFiles = await Promise.all(
      files.map(file => getImports(file, options))
    );

    const importedFiles = rawImportedFiles.flat().filter(onlyUnique);
    files = importedFiles;
  }

  // All file paths absolute
  files = files.map(file => path.resolve(file));

  if (Array.isArray(include)) {
    files = multimatch(files, include);
  }

  if (Array.isArray(exclude)) {
    const negatedExclude = exclude.map(pattern => `!${pattern}`);
    files = multimatch(files, ['**', ...negatedExclude]);
  }

  let results = files.map(file => {
    const timer = new Timer(file);

    /*
     * Transform all gathered files one by one and collect
     * transform meta data using `wrapPluginVisitorMethod`
     * https://babeljs.io/docs/en/options#configfile
     */
    transformSync(fs.readFileSync(file).toString(), {
      filename: file,
      configFile: babelConfig ? path.join(process.cwd(), babelConfig) : false,
      minified: true,
      compact: true,
      wrapPluginVisitorMethod: timer.wrapPluginVisitorMethod,
    });

    return timer.getResults();
  });

  return render(results, {
    expandPackages,
    output,
    outputPath,
    aggregateBy,
    paginationSize,
  });
}
