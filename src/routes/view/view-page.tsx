import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

import { renderWidgetNode, widgetsSchema } from '#widgets/helpers'
import { decodeText } from '@/lib/codec'
import { useWidgetsStore } from '@/store'

export function ViewPage() {
  const { t } = useTranslation()
  let widgets = useWidgetsStore(state => state.widgets)
  /**
   * Get widgets data from the URL query string.
   */
  const [searchParams] = useSearchParams()
  const data = searchParams.get('data')
  let hasError = false

  if (data) {
    try {
      const text = decodeText(data)
      const ret = widgetsSchema.safeParse(JSON.parse(text))
      if (ret.success) {
        widgets = ret.data
      } else {
        throw ret.error
      }
    } catch (error) {
      console.warn('Data parse error:', error)
      widgets = []
      hasError = true
    }
  }

  if (hasError) {
    return (
      <div className="py-8 text-center text-2xl font-bold text-red-500">
        {t('message.parameterError')}
      </div>
    )
  }

  return (
    <div className="bg-zinc-50 lg:min-h-screen lg:py-8">
      <div className="mx-auto overflow-hidden lg:w-[860px] lg:rounded-2xl lg:shadow-2xl print:w-[900px]">
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
    </div>
  )
}
