import * as path from 'path';
import * as webpack from 'webpack';

const extConfig: webpack.Configuration = {
  target: 'node',
  entry: './src/extension.ts',
  output: {
    filename: 'extension.js',
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, 'build'),
  },
  resolve: { extensions: ['.ts', '.js'] },
  module: { rules: [{ test: /\.ts$/, loader: 'ts-loader' }] },
  externals: { vscode: 'vscode' },
};

const webviewConfig: webpack.Configuration = {
  target: 'web',
  entry: './src/webview/index.tsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', 'scss'],
  },
  module: {
    rules: [
      { test: /\.tsx?$/, use: ['babel-loader', 'ts-loader'] },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
};

export default [webviewConfig, extConfig];