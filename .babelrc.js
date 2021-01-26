module.exports = {
  presets: [
    '@babel/preset-react',
    [
      '@babel/preset-env', // 加载polyfill
      {
        targets: {
          browsers: [
            'last 2 versions',
            'safari >= 7',
            'ie >= 9',
            'chrome >= 52'
          ]
        },
        useBuiltIns: 'usage', // 按实际使用加载
        debug: false,
      }
    ]
  ],
  plugins: [
    [
      //按需加载插件
      'babel-plugin-import',
      {
        libraryName: 'antd',
        style: true //导入样式
      }
    ],
    '@babel/plugin-syntax-dynamic-import',
    'react-hot-loader/babel',
    '@babel/plugin-proposal-class-properties', //类直接定义属性 class{ function = ()=>(); key=value;}
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-transform-modules-commonjs',
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: 2,
        helpers: true,
        regenerator: true,
        useESModules: false,
      }
    ],
    ['@babel/plugin-proposal-decorators', { legacy: true }]
  ]
};
