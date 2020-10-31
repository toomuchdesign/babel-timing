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

export type OptionsWithDefaults = Required<Options>;
