const merge = require('webpack-merge');
const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const lessToJs = require('less-vars-to-js');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const common = require('./webpack.common.js');

const extractLess = new ExtractTextPlugin({
  filename: 'static/[name].[chunkHash:4].css',
  disable: process.env.NODE_ENV === 'development',
});

const themer = lessToJs(fs.readFileSync(path.join(__dirname, './src/style/override/index.less'), 'utf8'));

const BUILD_PATH = path.resolve(__dirname, 'dist'); // 发布文件所存放的目录


const buildoutput = require('./buildoutput');

const { prodUrl } = buildoutput;

const x = merge(common, {
  mode: 'production',
  // devtool: 'source-map', // 生产环境不使用source-map
  // devtool: 'cheap-module-source-map', // 关闭source-map防止暴露源代码和文件名和结构
  output: {
    path: BUILD_PATH, // 打包后的文件存放的地方
    filename: (value) => {
      if (value.chunk.name === 'polyfill') { return '[name].bundle.js'; }
      return `${prodUrl}[name].[chunkhash].js`;
    },
    chunkFilename: `${prodUrl}[name].[chunkhash:4].js`,
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.css|less$/,
        include: [/node_modules/, path.resolve(__dirname, './src/style//fonts/style.css')],
        use: extractLess.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader' },
            {
              loader: 'less-loader',
              options: {
                modifyVars: themer,
                javascriptEnabled: true,
              },
            },
          ],
        }),
      },
      {
        test: /\.css|less$/,
        exclude: [/node_modules/, path.resolve(__dirname, './src/style//fonts/style.css')],
        use: extractLess.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader?modules&localIdentName=[name]_[local]-[hash:base64:5]' },
            {
              loader: 'less-loader',
              options: {
                javascriptEnabled: true,
              },
            },
          ],
        }),
      },
    ]
  },

  plugins: [
    new CleanWebpackPlugin(['dist']), // 输入要清理掉的目录
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      __DEVELOPMENT__: false,
      __SERVER__: true,
    }),
    extractLess,
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          ecma: undefined,
          warnings: true, // 移除warning
          parse: {},
          compress: {
            drop_console: true,
            drop_debugger: false,
            pure_funcs: ['console.log'] // 移除console
          }
        },
      }),
    ]
  }
});

if (process.env.npm_config_profile) { // npm run build --profile=true 打开分析
  x.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = x;
