import * as Sentry from '@sentry/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'

import { ErrorBoundary } from '@/components/layout/error-boundary'
import { router } from '@/routes/index'

import '@/bootstrap'

const container = document.getElementById('root')!
const sentryRootOptions = import.meta.env.VITE_SENTRY_DSN
  ? {
      onUncaughtError: Sentry.reactErrorHandler((error, errorInfo) => {
        console.warn('Uncaught error', error, errorInfo.componentStack)
      }),
      onCaughtError: Sentry.reactErrorHandler(),
      onRecoverableError: Sentry.reactErrorHandler(),
    }
  : undefined
const root = createRoot(container, sentryRootOptions)
root.render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
)
