import { BasicInfo } from '@/components/widgets/node/basic-info.tsx'
import { ExperienceTime } from '@/components/widgets/node/experience-time.tsx'
import { ImageSection } from '@/components/widgets/node/image-section.tsx'
import { TextContent } from '@/components/widgets/node/text-content.tsx'
import { TitleSection } from '@/components/widgets/node/title-section.tsx'
import type { WidgetNode } from '@/components/widgets/widgets-type.d.ts'
import { useWidgetsStore } from '@/store/widgets-store.ts'

const PagePreview = () => {
  const widgets = useWidgetsStore(state => state.widgets)
  const WidgetRenderComponent = (item: WidgetNode) => {
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
      <ul className="print-wrapper">
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

export { PagePreview }
