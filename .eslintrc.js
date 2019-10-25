// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'plugin:vue/essential',
    'eslint:recommended',
    'plugin:prettier/recommended',
    "prettier",
    "prettier/babel",
    "prettier/flowtype",
    "prettier/standard",
    "prettier/unicorn",
    "prettier/vue"
  ],
  // required to lint *.vue files
  plugins: [
    'vue', 'prettier'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    indent: ['error', 2],
    'no-console': 'warn',
    'arrow-parens': 0,
    'no-unused-vars': 'warn',//把该条提示信息转换成警告信息
    'max-lines': [
      'error',
      {
        max: 3000,
        skipBlankLines: true,
        skipComments: true
      }
    ],
    "no-console": 0,
    "prettier/prettier": [
        "error",
        {
          "useTabs": false,
          "semi": true,//在代码尾部添加分号
          "singleQuote": true,//把双引号换成单引号
          "trailingComma": "es5",//在代码尾部添加逗号
          "trailingComma": "none",
          "bracketSpacing": true,
          "jsxBracketSameLine": true
        }
      ]
    }
}
