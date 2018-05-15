const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: { main: './src/main.js' },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'saloon.js',
    library: '',
    libraryTarget: 'commonjs',
  },
  node: {
    fs: 'empty', // fix for css-loader needed in winston https://github.com/webpack-contrib/css-loader/issues/447
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};
