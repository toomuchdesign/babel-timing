import Timer from '../../Timer';
import { sortByProperty } from '../../utils';
import { ResultByFile, ResultByPlugin } from '../../types';

export default function aggregateByPlugins(
  resultByFile: ResultByFile[]
): ResultByPlugin[] {
  const results = [] as ResultByPlugin[];
  const pluginsMap = new Map();
  // Extract "results.plugins" entries and group them by plugin name
  resultByFile.forEach((fileResult) => {
    const fileName = fileResult.name;
    fileResult.plugins.forEach((plugin) => {
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
