import path from 'path';
import fs from 'fs';
import cliRenderer from './cliRenderer';
import aggregateByPlugins from './aggregateByPlugins/index';
import joinFileResultsFromSameModule from './joinFileResultsFromSameModule';
import { sortByProperty } from '../utils';
import { ResultByFile, ResultByPlugin, Options } from '../types';

export default function render({
  results = [],
  expandPackages,
  output = 'return',
  outputPath = './babel-timing-results.json',
  aggregateBy = 'files',
  paginationSize = 10,
}: { results: ResultByFile[] } & Pick<
  Options,
  'expandPackages' | 'output' | 'outputPath' | 'aggregateBy' | 'paginationSize'
>) {
  if (!expandPackages) {
    results = joinFileResultsFromSameModule(results);
  }

  let sortedResults: ResultByFile[] | ResultByPlugin[] = [...results];
  if (aggregateBy === 'plugins') {
    sortedResults = aggregateByPlugins(results);
  }

  sortedResults = sortedResults.sort(sortByProperty('time'));

  switch (output) {
    case 'return': {
      return sortedResults;
    }
    case 'console': {
      cliRenderer(sortedResults, { paginationSize });
      return;
    }
    case 'json': {
      fs.writeFileSync(outputPath, JSON.stringify(sortedResults));
      return;
    }
  }
}
