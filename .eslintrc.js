module.exports = {
  // Base configuration - applied to all files
  extends: [
    'eslint:recommended', // Base ESLint recommended rules
    'prettier' // Prettier integration - must be last
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  env: {
    node: true,
    es6: true
  },
  rules: {
    // Shared rules for all file types
    'prefer-const': 'warn',
    'arrow-body-style': ['warn', 'as-needed'],
    'object-shorthand': 'warn',
    eqeqeq: ['error', 'always'],
    'no-duplicate-imports': 'error'
  },
  // File-specific configurations
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'], // applies to all folders
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        },
        project: './tsconfig.json'
      },
      env: {
        browser: true,
        es6: true,
        jest: true,
        node: true
      },
      extends: [
        'react-app', // Base CRA ESLint configuration
        'react-app/jest', // Jest testing configuration
        'plugin:@typescript-eslint/recommended', // TypeScript rules
        'plugin:react/recommended', // React recommended rules
        'plugin:react-hooks/recommended', // React hooks rules
        'plugin:prettier/recommended' // Prettier integration - must be last
      ],
      plugins: ['@typescript-eslint', 'react', 'react-hooks', 'prettier'],
      settings: {
        react: {
          version: 'detect' // Auto-detect React version
        }
      },
      rules: {
        // TypeScript specific rules
        '@typescript-eslint/explicit-function-return-type': 'off', // Let TypeScript infer return types when possible
        '@typescript-eslint/explicit-module-boundary-types': 'off', // Don't require explicit return types for exports
        '@typescript-eslint/no-explicit-any': 'warn', // Warn on any type usage
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Warn on unused variables, ignore variables starting with _

        // React specific rules
        'react/prop-types': 'off', // Not needed with TypeScript
        'react/react-in-jsx-scope': 'off', // Not needed with React 17+
        'react/jsx-filename-extension': ['warn', { extensions: ['.tsx'] }], // Allow JSX only in .tsx files
        'react/jsx-sort-props': ['warn', { callbacksLast: true, shorthandFirst: true }], // Enforce ordering of props

        // Frontend code style rules
        'no-console': ['warn', { allow: ['warn', 'error'] }], // Allow console.warn and console.error
        'import/no-anonymous-default-export': 'warn', // Warn on anonymous default exports

        // React Hooks rules
        'react-hooks/rules-of-hooks': 'error', // Enforce Rules of Hooks
        'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies

        // Prettier integration
        'prettier/prettier': 'warn' // Run prettier as an ESLint rule
      }
    },
    // Test files
    {
      files: ['**/*.test.ts', '**/*.test.tsx'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'no-console': 'off'
      }
    },
    // JavaScript files in the server directory
    {
      files: ['server/**/*.js', 'server.js'],
      parser: 'espree', // Use the default ESLint parser for JavaScript
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
      },
      env: {
        node: true,
        es6: true
      },
      extends: [
        'eslint:recommended', // Use recommended ESLint rules for JavaScript
        'prettier' // Prettier integration - must be last
      ],
      // Explicitly disable any TypeScript plugins to ensure they don't apply
      plugins: ['prettier'],
      rules: {
        // General Node.js best practices
        'no-console': 'off', // Allow console in server code
        'no-process-exit': 'error', // Discourage process.exit()
        'no-sync': 'warn', // Warn about synchronous methods
        'handle-callback-err': 'error', // Enforce error handling in callbacks
        'no-path-concat': 'error', // Use path.join() instead of string concatenation
        'no-buffer-constructor': 'error', // Avoid deprecated Buffer constructor

        // Error handling
        'no-throw-literal': 'error', // Only throw Error objects

        // Style
        'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

        // Explicitly disable any TypeScript rules
        '@typescript-eslint/no-var-requires': 'off', // Allow require statements
        '@typescript-eslint/no-unused-vars': 'off', // Disable TS version of this rule

        // Prettier integration
        'prettier/prettier': 'warn' // Run prettier as an ESLint rule
      }
    }
  ]
};
