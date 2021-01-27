const path = require('path');
const fs = require('fs');
// const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HappyPack = require('happypack');

const os = require('os'); // 系统操作函数

const threadPool = HappyPack.ThreadPool;
const happyThreadPool = threadPool({ size: os.cpus().length }); // 指定线程池个数

const buildoutput = require('./buildoutput');

const { prodUrl } = buildoutput;

module.exports = {
  entry: {
    index: [
      '@babel/polyfill', // es代码polyfill
      'raf/polyfill', // react16 兼容
      path.join(__dirname, 'src/index.js')
      // './src//index.js'
    ],
    // bizcharts: ['bizcharts', '@antv/data-set'],
    // react: [
    //   'react', 'redux', 'react-dom',
    //   'react-redux', 'react-router',
    //   'react-router-redux', 'react-router-dom']
  },
  plugins: [
    // new CleanWebpackPlugin(['dist']), // 输入要清理掉的目录
    new HtmlWebpackPlugin({ // 参数参考 https://github.com/jantimon/html-webpack-plugin
      // title: 'EMR',  //title
      template: './template/template.html',
      // chunks: ['polyfill', 'vendor', 'index'],
      // chunksSortMode: 'manual'
      // excludeChunks: ['polyfill'], // html 不插入这个chunk
    }),
    new CopyPlugin([
      { from: './src/assets/cloud-l.gif', to: `${prodUrl}cloud-l.gif` },
      { from: './template/config.js', to: `${prodUrl}config.js` },
      { from: './template/header.css', to: `${prodUrl}header.css` },
      { from: './template/header.js', to: `${prodUrl}header.js` },
    ]),
    new HappyPack({
      id: 'babel',
      loaders: ['babel-loader?cacheDirectory'],
      threadPool: happyThreadPool,
      verbose: true
    }),
  ],

  optimization: {
    // runtimeChunk: {
    //   name: 'manifest',
    // }, // 保证vendor不变的情况hash不变（新版webpack不设置？也不会变），避免vendor重复编译，利用缓存（验证后无效）
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0
        },
        vendor: { // 将第三方模块提取出来
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendor',
          priority: 10, // 优先
          enforce: true
        }
      },
    },
  },
  module: {
    rules: [ // 处理加载相关js css 图片 字体等 数据(csv tsv xml)等
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'happypack/loader?id=babel', // 'babel-loader',
        },
        // include: [path.resolve(__dirname, 'src'), path.resolve('node_modules/superagent')],
        exclude: /node_modules\/(?!(superagent)\/).*/,
        // sideEffects: false,

      },
      {
        test: /\.(png|svg|jpg|gif|jpeg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name(file) {
                if (process.env.NODE_ENV === 'development') {
                  return '[path][name].[ext]';
                }

                return '[name]-[hash:8].[ext]';
              },
              outputPath: `${prodUrl}images/`
            }
          }
        ],
      },
      {
        test: /\.(svg|woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name(file) {
                if (process.env.NODE_ENV === 'development') {
                  return '[path][name].[ext]';
                }

                return '[name].[ext]?[hash:8]';
              },
              mimetype: 'application/font-woff',
              outputPath: `${prodUrl}fonts/`
            }
          }
        ],
      },
      {
        test: /\.(csv|tsv)$/,
        use: [
          'csv-loader',
        ],
      },
      {
        test: /\.xml$/,
        use: [
          'xml-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.less', '.scss', '.css', '.json'], // 后缀名自动补全
    alias: {
      '@': path.resolve(__dirname, 'src'),
      Views: path.resolve(__dirname, 'src/views'),
      fonts: path.resolve(__dirname, 'src/style/fonts/fonts'),
      Components: path.resolve(__dirname, 'src/components'),
      Common: path.resolve(__dirname, 'src/common'),
      Assets: path.resolve(__dirname, 'src/assets'),
      Container: path.resolve(__dirname, 'src/container'),
      Redux: path.resolve(__dirname, 'src/redux'),
      Styles: path.resolve(__dirname, 'src/style'),
      Constants: path.resolve(__dirname, 'src/constants'),
      // '@ant-design/icons/lib/dist$': path.resolve(__dirname, './src/icons.js'), // 3.10 icon太大的问题
      Setting: path.resolve(__dirname, 'src/setting'),
      Utils: path.resolve(__dirname, 'src/utils'),
    },
    modules: ['node_modules', path.resolve(__dirname, 'src')],
  },
};
