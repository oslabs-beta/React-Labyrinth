const path = require('path');


module.exports = {
entry: './src/webview/index.jsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './build'),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css'],
  },
  module: {
    rules: [
        {
            test: /\.jsx?/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react']
              }
            }
          },
          {
            test: /\.(scss|css)$/,
            use: ["style-loader", "css-loader"],
          },
    ]
  },
  mode: "development"
}
