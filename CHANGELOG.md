# Changelog

## 0.9.1

### Bugfixes

- Fix `dist` folder not being fully copied into package's tarball

## 0.9.0

### New Features

- Migrate to TypeScript
- Expose TypeScript types

## 0.8.0

### Breaking Changes

- Remove `verbose` option

### New Features

- Add `resolveExtensions` option

### Bugfixes

- Stabilize `followImports` option (introducing webpack)

## 0.7.0

### Breaking Changes

- Change `ResultList` shape

### New Features

- Add `aggregateBy` option

## 0.6.1

### Bugfixes

- Fix CLI error on exit

## 0.6.0

### New Features

- Add `--read-results` CLI option

## 0.5.0

### New Features

- Expose and document library's internals: `Timer`, `timersCollection` and `render`
- Paginate both interactive CLI pages and review output style

## 0.4.0

### New Features

- Provide Jest integration `babel-timing/jest/transformer` and `babel-timing/jest/reporter`

### Bugfixes

- Improve CLI stability
- Fix `outputPath` option to handle absolute paths

## 0.3.0

### New Features

- Provide Webpack integration with `babel-timing/webpack/plugin` and `babel-timing/webpack/babel-loader-customize`
- Add `outputPath` option

## 0.2.1

### Bugfixes

- Fix package.json bin field

## 0.2.0

### Breaking Changes

- Make `babelTiming` async
- Replace `importPatterns` with `include` and `exclude` options
- Change result API's: rename data as plugins
- Make all file paths absolute

### Minor changes

- Follow imports with Rollup.js
- Add `resolveMainFields` option
- Add `verbose` option
- Add `expandPackages` option
- Improve CLI output UX
- Transpile files during imports discovery phase

## 0.1.0

Initial release
