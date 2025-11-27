import tsParser from '@typescript-eslint/parser'
import vueParser from 'vue-eslint-parser'
import baseConfig from '@bangbang93/eslint-config-recommended'
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'

export default [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'packages/*/dist/**',
      'packages/*/node_modules/**',
    ],
  },
  ...baseConfig,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.ts', '**/*.mts', '**/*.cts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['packages/admin/**/*.ts', 'packages/admin/**/*.vue', 'packages/home/**/*.ts', 'packages/home/**/*.vue'],
    languageOptions: {
      globals: {
        window: 'readonly',
        document: 'readonly',
        FormData: 'readonly',
        File: 'readonly',
        fetch: 'readonly',
      },
    },
    rules: {
      'n/no-unsupported-features/node-builtins': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/await-thenable': 'warn',
    },
  },
  {
    files: ['packages/server/**/*.ts'],
    rules: {
      '@typescript-eslint/no-magic-numbers': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'warn',
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: ['.vue'],
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        FormData: 'readonly',
        File: 'readonly',
        fetch: 'readonly',
      },
    },
    rules: {
      'n/no-unsupported-features/node-builtins': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-magic-numbers': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      'vue/no-v-html': 'warn',
      'vue/valid-v-for': 'off',
    },
  },
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    languageOptions: {
      parserOptions: {
        projectService: false,
        project: false,
      },
    },
    rules: {
      ...tseslint.configs.disableTypeChecked.rules,
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'n/no-unsupported-features/node-builtins': 'off',
    },
  },
]
