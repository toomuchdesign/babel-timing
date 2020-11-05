const path = require('path');

module.exports = {
  rootDir: __dirname,
  transform: {
    '^.+\\.jsx?$': '<rootDir>/../../../../jest/transformer',
  },
  reporters: [
    [
      '<rootDir>/../../../../jest/reporter',
      {
        output: 'json',
        outputPath: path.resolve(__dirname, 'results.temp.json'),
      },
    ],
  ],
};
