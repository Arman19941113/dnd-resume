import { Copy, Trash } from 'lucide-react'
import type { MouseEvent } from 'react'
import { memo } from 'react'

import { Button } from '#ui/button'
import { BasicInfo } from '#widgets/node/basic-info'
import { ExperienceTime } from '#widgets/node/experience-time'
import { ImageSection } from '#widgets/node/image-section'
import { TextContent } from '#widgets/node/text-content'
import { TitleSection } from '#widgets/node/title-section'
import type { IWidgetNode } from '#widgets/types'
import { generateWidgetId } from '#widgets/helpers'
import { useWidgetsStore } from '@/store'

/**
 * Selects the concrete resume widget renderer for a stored widget node.
 */
function renderWidgetNode(item: IWidgetNode) {
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

export function DraggableNode({ item, isActive }: { item: IWidgetNode; isActive: boolean }) {
  /**
   * click to copy widget
   */
  const addWidget = useWidgetsStore(state => state.addWidget)
  const handleClickCopy = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    const newItem = JSON.parse(JSON.stringify(item))
    newItem.id = generateWidgetId()
    addWidget(newItem)
  }

  /**
   * click to remove widget
   */
  const removeWidget = useWidgetsStore(state => state.removeWidget)
  const handleClickRemove = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    removeWidget(item.id)
  }

  return (
    <div style={item.data.styleData}>
      {renderWidgetNode(item)}
      {isActive && (
        <div className="absolute top-1 right-1 flex items-center gap-2 transition-opacity">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onMouseDown={handleClickCopy}
          >
            <Copy />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onMouseDown={handleClickRemove}
          >
            <Trash />
          </Button>
        </div>
      )}
    </div>
  )
}

export const MemoizedDraggableNode = memo(DraggableNode)
