const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = function (env, argv) {
  return {
    entry: './src/index.tsx',
    mode: env.production ? 'production' : 'development',
    devtool: env.production ? 'source-map' : 'eval',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource'
        },
        {
          test: /\.png$/,
          use: ['file-loader']
        },
        {
          test: /\.(png|jpg)$/,
          use: 'file-loader?name=images/[name].[ext]'
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    plugins: [
      new HtmlWebpackPlugin({
        hash: true,
        template: 'src/index.html',
        minify: {
          minifyCSS: true,
          minifyJS: true,
          collapseWhitespace: true,
          removeComments: true,
          removeEmptyAttributes: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true
        }
      })
    ],
    devServer: {
      static: path.join(__dirname, 'dist'),
      compress: true,
      port: 9500
    }
  };
};
