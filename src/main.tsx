import * as Sentry from '@sentry/react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'

import { ErrorBoundary } from '@/components/layout/error-boundary'
import { router } from '@/routes/index'

import '@/bootstrap'

const container = document.getElementById('root')!
const root = createRoot(
  container,
  import.meta.env.VITE_SENTRY_DSN && {
    // Callback called when an error is thrown and not caught by an ErrorBoundary.
    onUncaughtError: Sentry.reactErrorHandler((error, errorInfo) => {
      console.warn('Uncaught error', error, errorInfo.componentStack)
    }),
    // Callback called when React catches an error in an ErrorBoundary.
    onCaughtError: Sentry.reactErrorHandler(),
    // Callback called when React automatically recovers from errors.
    onRecoverableError: Sentry.reactErrorHandler(),
  },
)
root.render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
      <Analytics />
      <SpeedInsights sampleRate={0.2} />
    </ErrorBoundary>
  </StrictMode>,
)
