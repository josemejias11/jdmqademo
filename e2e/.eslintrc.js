module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'playwright'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:playwright/recommended',
    'prettier'
  ],
  env: {
    node: true,
    es6: true
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'playwright/no-wait-for-timeout': 'warn',
    'playwright/expect-expect': 'off', // Disabled due to custom test fixtures
    'playwright/no-conditional-expect': 'error',
    'playwright/no-force-option': 'warn',
    'playwright/no-standalone-expect': 'off' // Disabled due to custom test functions
  },
  ignorePatterns: ['node_modules/', 'dist/', 'test-results/', 'playwright-report/', '.playwright/']
};
