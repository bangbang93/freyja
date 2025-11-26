import tsParser from '@typescript-eslint/parser'
import vueParser from 'vue-eslint-parser'
import baseConfig from '@bangbang93/eslint-config-recommended'
import pluginVue from 'eslint-plugin-vue'

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
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: ['.vue'],
      },
    },
  },
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['**/*.js', '**/*.mjs', '**/*.cjs'],
        },
      },
    },
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
  {
    files: ['eslint.config.mjs'],
    rules: {
      'n/no-unsupported-features/node-builtins': 'off',
    },
  },
]
