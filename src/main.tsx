import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'

import { ErrorBoundary } from '@/components/layout/error-boundary'
import { router } from '@/routes/index'

import '@/bootstrap'

const container = document.getElementById('root')!
const root = createRoot(container)
root.render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
)
