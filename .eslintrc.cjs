module.exports = {
  // Your ESLint configuration here
  // For example:
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended'
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
  },
  settings: {
    react: {
      version: 'detect'  // Automatically detect React version
    }
  },
  ignorePatterns: [
    'e2e/**/*',  // Exclude e2e directory (has its own ESLint config)
    'build/**/*',
    'dist/**/*',
    'node_modules/**/*'
  ]
};
