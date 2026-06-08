import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

import { BasicInfo } from '#widgets/node/basic-info'
import { ExperienceTime } from '#widgets/node/experience-time'
import { ImageSection } from '#widgets/node/image-section'
import { TextContent } from '#widgets/node/text-content'
import { TitleSection } from '#widgets/node/title-section'
import { widgetsSchema } from '#widgets/helpers'
import type { IWidgetNode } from '#widgets/types'
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

  function WidgetRenderComponent(item: IWidgetNode) {
    switch (item.type) {
      case 'BasicInfo':
        return <BasicInfo data={item.data.propsData} />
      case 'TitleSection':
        return <TitleSection data={item.data.propsData} />
      case 'ExperienceTime':
        return <ExperienceTime data={item.data.propsData} />
      case 'TextContent':
        return <TextContent data={item.data.propsData} />
      case 'ImageSection':
        return <ImageSection data={item.data.propsData} />
    }
  }

  return (
    <div className="bg-zinc-50 lg:min-h-[100vh] lg:py-8">
      <div className="mx-auto overflow-hidden lg:w-[860px] lg:rounded-2xl lg:shadow-2xl print:w-[900px]">
        <ul className="widgets-container">
          {widgets.map(item => (
            <li
              key={item.id}
              className="flow-root"
            >
              <div style={item.data.styleData}>{WidgetRenderComponent(item)}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
