export type OptionsWithDefaults = {
  babelConfig: string | false;
  followImports: boolean;
  include: string[];
  exclude: string[];
  resolveMainFields: string[];
  resolveExtensions: string[];
  expandPackages: boolean;
  output: string;
  outputPath: string;
  aggregateBy: string;
  paginationSize: number;
};
