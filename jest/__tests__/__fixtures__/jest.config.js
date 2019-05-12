const path = require('path');

module.exports = {
  rootDir: __dirname,
  transform: {
    '^.+\\.jsx?$': '<rootDir>/../../transformer',
  },
  reporters: [
    [
      '<rootDir>/../../reporter',
      {output: 'json', outputPath: path.resolve(__dirname, 'results.json')},
    ],
  ],
};
