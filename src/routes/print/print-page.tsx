import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

import { generateBasename, renderWidgetNode } from '#widgets/helpers'
import { useWidgetsStore } from '@/store'

export function PrintPage() {
  const widgets = useWidgetsStore(state => state.widgets)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  /**
   * Print the page when the `print` URL parameter is set to 'true'.
   */
  useEffect(() => {
    const print = searchParams.get('print')
    let timer: ReturnType<typeof setTimeout> | null = null
    if (print === 'true') {
      timer = setTimeout(() => {
        window.history.replaceState({}, '', window.location.pathname)
        // print filename
        const originalTitle = document.title
        document.title = generateBasename(widgets) || originalTitle
        // print
        window.addEventListener(
          'afterprint',
          () => {
            document.title = originalTitle
            void navigate(-1)
          },
          { once: true },
        )
        window.print()
      }, 100) // wait 100ms to ensure the page is rendered
    }

    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [navigate, widgets, searchParams])

  return (
    <div className="mx-auto w-[900px]">
      <ul className="widgets-container">
        {widgets.map(item => (
          <li
            key={item.id}
            className="flow-root"
          >
            <div style={item.data.styleData}>{renderWidgetNode(item)}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
