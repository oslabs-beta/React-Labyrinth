import * as path from 'path';

module.exports = {
  entry: './src/webview/index.tsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './build'),
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.css'],
  },
  module: {
    rules: [
      // {
      //   test: /\.jsx?/,
      //   exclude: /node_modules/,
      //   use: {
      //     loader: "babel-loader",
      //     options: {
      //       presets: ['@babel/preset-env', '@babel/preset-react']
      //     }
      //   }
      // },
      { test: /\.tsx?$/, use: ['babel-loader', 'ts-loader'] },
      {
        test: /\.(css)$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ]
  },
  mode: "development"
}
