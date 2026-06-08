import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

import { BasicInfo } from '#widgets/node/basic-info'
import { ExperienceTime } from '#widgets/node/experience-time'
import { ImageSection } from '#widgets/node/image-section'
import { TextContent } from '#widgets/node/text-content'
import { TitleSection } from '#widgets/node/title-section'
import type { IWidgetNode } from '#widgets/types'
import { generateBasename } from '#widgets/helpers'
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
    <div className="mx-auto w-[900px]">
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
  )
}
