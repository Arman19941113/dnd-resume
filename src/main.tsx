import '@/i18n/index.ts'
import '@/index.css'
import { ErrorBoundary } from '@/components/layout/error-boundary.tsx'
import { Toaster } from '@/components/ui/sonner'
import { PageEdit } from '@/pages/edit/page.tsx'
import { PagePreview } from '@/pages/preview/page.tsx'
import { PagePrint } from '@/pages/print/page.tsx'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'

const container = document.getElementById('root')!
const root = createRoot(container)
root.render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Toaster
          position="top-center"
          richColors
          closeButton
          offset={52}
        />
        <Routes>
          <Route
            path="/"
            element={<PageEdit />}
          />
          <Route
            path="/edit"
            element={<PageEdit />}
          />
          <Route
            path="/preview"
            element={<PagePreview />}
          />
          <Route
            path="/print"
            element={<PagePrint />}
          />
        </Routes>
        <Analytics />
        <SpeedInsights />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
