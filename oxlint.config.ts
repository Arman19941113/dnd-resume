// Configures Oxlint rules and ignores for the project.
import { defineConfig } from 'oxlint'

export default defineConfig({
  ignorePatterns: ['dist/**', 'src/components/ui/**'],
  options: {
    typeAware: true,
  },
  categories: {
    correctness: 'error',
    suspicious: 'warn',
  },
  rules: {
    'typescript/consistent-type-imports': 'error',
    'typescript/no-explicit-any': 'off',
  },
})
