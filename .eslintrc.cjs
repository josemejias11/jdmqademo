module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    // Your custom rules here
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'react/react-in-jsx-scope': 'off'
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  ignorePatterns: [
    'build/**/*',
    'dist/**/*',
    'node_modules/**/*',
    'test-results/**/*',
    'playwright-report/**/*'
  ],
  overrides: [
    {
      // E2E test files configuration
      files: ['e2e/**/*.ts'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:playwright/recommended',
        'prettier'
      ],
      env: {
        node: true
      },
      rules: {
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        // Disable problematic Playwright rules that don't understand custom fixtures
        'playwright/no-standalone-expect': 'off',
        'playwright/expect-expect': 'off'
      }
    }
  ]
};
