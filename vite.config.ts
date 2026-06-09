import { sentryVitePlugin } from '@sentry/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import { htmlPlugin } from './plugins/html-plugin.ts'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const enableSentry = Boolean(env.SENTRY_AUTH_TOKEN)

  return {
    define: {
      __DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)),
    },
    server: {
      open: true,
      allowedHosts: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '#tiptap': path.resolve(__dirname, './src/components/tiptap'),
        '#ui': path.resolve(__dirname, './src/components/ui'),
        '#widgets': path.resolve(__dirname, './src/components/widgets'),
      },
    },
    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
      },
    },
    plugins: [
      react(),
      tailwindcss(),
      htmlPlugin(),
      enableSentry &&
        sentryVitePlugin({
          org: env.SENTRY_ORG,
          project: env.SENTRY_PROJECT,
          authToken: env.SENTRY_AUTH_TOKEN,
          applicationKey: 'dnd-resume',
          sourcemaps: {
            ignore: ['**/rolldown-runtime-*.js'],
            filesToDeleteAfterUpload: ['**/*.map'],
          },
        }),
    ],
    build: {
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              {
                name: 'vendor-react',
                test: /\/node_modules\/(?:react|react-dom|react-router|use-sync-external-store)\//,
              },
              {
                name: 'vendor-tiptap',
                test: /\/node_modules\/(?:@tiptap|prosemirror-[^/]+)\//,
              },
              {
                name: 'vendor-ui',
                test: /\/node_modules\/(?:@dnd-kit|@radix-ui|radix-ui)\//,
              },
              {
                name: 'vendor-sentry',
                test: /\/node_modules\/(?:@sentry)\//,
              },
              { name: 'vendor', test: /\/node_modules/ },
            ],
          },
        },
      },
      sourcemap: enableSentry ? 'hidden' : false,
    },
  }
})
