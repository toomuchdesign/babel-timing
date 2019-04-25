# Babel timing

Make available babel-minify’s [timing plugin](https://github.com/babel/minify/blob/babel-minify%400.5.0/scripts/plugin-timing.js) as a standalone library.

## Installation

```bash
npm i babel-timing -D
yarn add babel-timing -D
```

## Usage

### CLI

```bash
babel-timing path/to/file-1.js path/to/file-2.js
babel-timing path/to/file-*.js
```

### Node

```js
const babelTiming = require('babel-timing').babelTiming;
babelTiming('path/to/file.js', options);
```

## Options

### `babelConfig` / `--babel-config`

Type: `string | false`<br />
Default: `false`

Path to a custom [babel configuration file](https://babeljs.io/docs/en/options#configfile). By default Babel will try to load any existing valid configuration file.

## Manual tests :)

```bash
node cli.js __fixtures__/file-1.js
node cli.js __fixtures__/file-1.js __fixtures__/file-2.js
node cli.js __fixtures__/*.js
```

## Todo

- Custom renderer implementation (maybe also `stats` file or a webapp like `Webpack Bundle Analyzer` does)
- Expose `wrapPluginVisitorMethod`
- Provide a way to consume `babel-timing` from other tools like `webpack`, `jest`, `rollup`, etc..
- Find a testing strategy

