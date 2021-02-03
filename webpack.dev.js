const merge = require('webpack-merge');
const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const lessToJs = require('less-vars-to-js');

const themer = lessToJs(
  fs.readFileSync(
    path.join(__dirname, './src/style/override/index.less'),
    'utf8'
  )
);

const common = require('./webpack.common.js');

const proxyServer = {
  '/devApi': {
    target: 'http://192.168.4.199:8670', //
    pathRewrite: {
      '^/devApi': ''
    },
    secure: false,
    changeOrigin: true
  },
  '/lixueping': {
    target: 'http://192.168.1.152:8670', //
    pathRewrite: {
      '^/lixueping': ''
    },
    secure: false,
    changeOrigin: true
  },
};

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    // index: './src/index.js'
    index: path.join(__dirname, 'src/index.js')
  },
  devServer: {
    // contentBase: './dist',
    // hot: true,
    // inline: true,
    host: '0.0.0.0',
    port: 8123,
    historyApiFallback: true,
    disableHostCheck: true,
    proxy: proxyServer,
  },
  output: {
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.css|less$/,
        include: [
          /node_modules/,
          path.resolve(__dirname, './src/style//fonts/style.css')
        ],
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          {
            loader: 'less-loader',
            options: {
              modifyVars: themer,
              javascriptEnabled: true
            }
          }
        ]
      },
      {
        test: /\.css|less$/,
        exclude: [
          /node_modules/,
          path.resolve(__dirname, './src/style//fonts/style.css')
        ],
        use: [
          { loader: 'style-loader' },
          {
            loader:
              'css-loader?modules&localIdentName=[name]_[local]-[hash:base64:5]'
          },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // 热更新模块
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      __DEVELOPMENT__: true,
      __SERVER__: false
    }),
  ]
});
