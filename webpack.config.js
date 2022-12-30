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
        title: 'FourMaps - Vol 2',
        template: 'src/index.html'
      })
    ],
    devServer: {
      static: path.join(__dirname, 'dist'),
      compress: true,
      port: 9500
    }
  };
};
