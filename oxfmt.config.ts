// Configures Oxfmt to match the project style without touching CLI-managed UI files.
import { defineConfig } from 'oxfmt'

export default defineConfig({
  printWidth: 100,
  semi: false,
  singleQuote: true,
  arrowParens: 'avoid',
  singleAttributePerLine: true,
  sortPackageJson: false,
  ignorePatterns: ['dist/**', 'src/components/ui/**', '**/*.css'],
})
