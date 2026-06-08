// Provides shared rendering for resume widget nodes.
import type { ReactNode } from 'react'

import { BasicInfo } from '#widgets/node/basic-info'
import { ExperienceTime } from '#widgets/node/experience-time'
import { ImageSection } from '#widgets/node/image-section'
import { TextContent } from '#widgets/node/text-content'
import { TitleSection } from '#widgets/node/title-section'
import type { IWidgetNode } from '#widgets/types'

/**
 * Selects the concrete resume widget renderer for a stored widget node.
 */
export function renderWidgetNode(item: IWidgetNode): ReactNode {
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
    default: {
      const exhaustiveCheck: never = item
      return exhaustiveCheck
    }
  }
}
