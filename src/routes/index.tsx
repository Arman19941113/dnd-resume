import { Navigate, createBrowserRouter } from 'react-router'

import { RootLayout } from '@/routes/layouts/root-layout'
import { ViewPage } from '@/routes/view/view-page'
import { PrintPage } from '@/routes/print/print-page'
import { NotFoundPage } from '@/routes/not-found/not-found-page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <Navigate
            to="/editor"
            replace
          />
        ),
      },
      {
        path: 'editor',
        lazy: async () => {
          const { EditorPage } = await import('@/routes/editor/editor-page')
          return { Component: EditorPage }
        },
      },
      { path: 'view', element: <ViewPage /> },
      { path: 'print', element: <PrintPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
