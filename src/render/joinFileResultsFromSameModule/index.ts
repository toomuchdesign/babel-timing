import mergeWith from 'lodash.mergewith';
import Timer from '../../Timer';
import { onlyUnique } from '../../utils';
import { ResultByFile } from '../../types';

const PACKAGE_NAME_REGEX = /(.*\/node_modules\/)((?:@.+?\/)?.+?\/)/;

// Return normalized name in case on "node_modules" package otherwise the original one
function normalizeResultName(name: string): string {
  const parsed = PACKAGE_NAME_REGEX.exec(name);
  if (!parsed) {
    return name;
  }
  return parsed[0];
}

type ResultByFileKeys = keyof ResultByFile;
type ResultByFileValues = ResultByFile[ResultByFileKeys];

function mergeStrategy(
  objValue: ResultByFileValues,
  srcValue: ResultByFileValues
): ResultByFileValues {
  // @TODO: this typeof checks are the only I found to type this function
  if (typeof objValue === 'number' && typeof srcValue === 'number') {
    return objValue + srcValue;
  }

  if (typeof objValue === 'object' && typeof srcValue === 'object') {
    return Timer.mergeVisits(...objValue, ...srcValue);
  }

  return objValue;
}

export default function joinFileResultsFromSameModule(
  results: ResultByFile[]
): ResultByFile[] {
  const normalizedResults = results.map((result) => ({
    ...result,
    name: normalizeResultName(result.name),
  }));

  return (
    normalizedResults
      // Get list of all name-normalized entries
      .map((result) => result.name)
      .filter(onlyUnique)
      // Merge results with same name
      .map((name) => {
        const sameName = normalizedResults.filter(
          (result) => result.name === name
        );
        return mergeWith({}, ...sameName, mergeStrategy);
      })
  );
}
