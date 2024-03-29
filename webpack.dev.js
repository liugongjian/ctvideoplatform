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
    // target: 'http://192.168.10.49:8670',
    target: 'http://192.168.10.146:8670', // 开发环境
    // target: 'http://192.168.10.129', // 赵丹环境
    // target: 'http://192.168.4.152:8670',
    // target: 'http://192.168.1.199:8670',
    // target: 'http://192.168.1.152:8670',
    // target: 'http://14.29.197.80:8670', // poc环境
    pathRewrite: {
      '^/devApi': ''
    },
    secure: false,
    changeOrigin: true
  },
  '/zhaodan': {
    target: 'http://192.168.10.129:8670', // 赵丹环境
    pathRewrite: {
      '^/zhaodan': ''
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
  '/zhujianxia': {
    target: 'http://192.168.10.49:8670', //
    pathRewrite: {
      '^/zhujianxia': ''
    },
    secure: false,
    changeOrigin: true
  },
  '/zhoulingpeng': {
    target: 'http://192.168.10.13:18671',
    pathRewrite: {
      '^/zhoulingpeng': ''
    },
    secure: false,
    changeOrigin: true
  },
  '/capture': {
    target: 'http://192.168.10.146:18671',
    pathRewrite: {
      '^/capture': ''
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
