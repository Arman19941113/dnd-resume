import type { Plugin } from 'vite'
import { loadEnv } from 'vite'

const env = loadEnv(process.env.NODE_ENV!, process.cwd(), '')

export function htmlPlugin(): Plugin {
  return {
    name: 'my-html-plugin',
    transformIndexHtml(html: string) {
      let result = html

      // react-scan
      const reactScan = env.REACT_SCAN
      if (reactScan) {
        result = result.replace(
          /\{\{\s*REACT_SCAN\s*\}\}/g,
          `<script crossOrigin="anonymous" src="${reactScan}"></script>`,
        )
      } else {
        result = result.replace(/\{\{\s*REACT_SCAN\s*\}\}/g, '')
      }

      return result
    },
  }
}

export default htmlPlugin
