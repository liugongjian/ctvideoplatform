module.exports = {
  extends: 'eslint-config-airbnb',
  parserOptions: {
    ecmaFeatures: { legacyDecorators: true }
  },
  env: {
    browser: true,
    node: true
  },
  parser: 'babel-eslint',
  rules: {
    'new-cap': [2, { capIsNewExceptions: ['List', 'Map', 'Set'] }],
    'react/no-multi-comp': 0,
    'import/default': 0,
    'import/no-duplicates': 0,
    'import/named': 0,
    'import/namespace': 0,
    'import/no-unresolved': 0,
    'import/no-named-as-default': 2,
    'comma-dangle': 0, // not sure why airbnb turned this on. gross!
    indent: [2, 2, { SwitchCase: 1 }],
    'no-console': 0,
    'no-plusplus':0,
    'no-unused-expressions':0,
    'no-alert': 0,
    'no-unused-vars': 0,
    'no-script-url': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'no-shadow': 0,
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    // PropTypes允许使用['any', 'array', 'object']
    "react/forbid-prop-types": [1, { "forbid": [] }],
    'react/prop-types': 0,
    "react/no-array-index-key": 0, 
    'no-param-reassign':0,
    'react/destructuring-assignment':0,
    'react/no-unused-state':0,
    'react/no-access-state-in-setstate':0,
    'no-cond-assign':0,
    'no-constant-condition':0,
    'no-return-assign':0,
    'no-bitwise':0,
    'consistent-return':0,
    'import/prefer-default-export': 0,
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true
      }
    ],
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/click-events-have-key-events': 'off'
  },
  plugins: ['react', 'import'],
  settings: {
    'import/parser': 'babel-eslint',
    'import/resolve': {
      //帮助eslint 识别webpack的alias
      moduleDirectory: ['node_modules', 'src'],
      webpack: {
        config: 'webpack.common.js'
      }
    }
  },
  globals: {
    __DEVELOPMENT__: true, //申明，避免eslint报错
    __SERVER__: false
  }
};
