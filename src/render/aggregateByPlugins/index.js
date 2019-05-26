const flatten = require('reduce-flatten');
const Timer = require('../../Timer');
const {onlyUnique, sortByProperty} = require('../../utils');

/*
 * Transform <ResultList> into the following structure:
 *
 * type ResultList = {
 *   name: string;
 *   time: number;
 *   files: {
 *     name: string;
 *     time: number;
 *     timePerVisit: number;
 *     visits: number;
 *   }[];
 * }[];
 */

function aggregateByPlugins(originalResults) {
  const results = [];
  const pluginsMap = new Map();

  // Extract "results.plugins" entries and group them by plugin name
  originalResults.forEach(fileResult => {
    const fileName = fileResult.name;
    fileResult.plugins.forEach(plugin => {
      const pluginName = plugin.name;
      if (!pluginsMap.has(pluginName)) {
        pluginsMap.set(pluginName, []);
      }
      // replace plugin name with file name
      pluginsMap.get(pluginName).push({
        ...plugin,
        name: fileName,
      });
    });
  });

  pluginsMap.forEach((files, pluginName) => {
    results.push({
      name: pluginName,
      time: Timer.getTotalTime(files),
      files: files.sort(sortByProperty('time')),
    });
  });

  return results;
}

module.exports = aggregateByPlugins;
