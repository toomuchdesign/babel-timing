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
babel-timing path/to/file.js
babel-timing path/to/file-*.js
```

### Node

```js
const babelTiming = require('babel-timing').babelTiming;
babelTiming('path/to/file.js');
```

## Manual tests :)

```bash
node cli.js __fixtures__/file-1.js
node cli.js __fixtures__/file-1.js __fixtures__/file-2.js
node cli.js __fixtures__/*.js
```

## Todo

- Add file names
- Custom benchmark implementation
- Provide babel config
- Expose `wrapPluginVisitorMethod`
- Provide a way to consume `babel-timing` from other tools like `webpack`, `jest`, `rollup`, etc..
