const path = require('path');
const BabelTimingPlugin = require('../../plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            customize: require.resolve('../../babel-loader-customize'),
          },
        },
      },
    ],
  },
  plugins: [
    new BabelTimingPlugin({
      output: 'json',
      outputPath: path.resolve(__dirname, 'results.json'),
    }),
  ],
};
