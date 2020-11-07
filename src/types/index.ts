export type Options = {
  babelConfig?: string | false;
  followImports?: boolean;
  include?: string[];
  exclude?: string[];
  resolveMainFields?: string[];
  resolveExtensions?: string[];
  expandPackages?: boolean;
  output?: 'return' | 'console' | 'json';
  outputPath?: string;
  aggregateBy?: 'files' | 'plugins';
  paginationSize?: number;
};

export type Visit = {
  name: string;
  time: number;
  timePerVisit: number;
  visits: number;
};

export type ResultByFile = {
  name: string;
  time: number;
  plugins: Visit[];
};

export type ResultByPlugin = {
  name: string;
  time: number;
  files: Visit[];
};

export type OptionsWithDefaults = Required<Options>;
