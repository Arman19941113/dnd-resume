import { Copy, Pencil, Trash } from 'lucide-react'
import type { MouseEvent } from 'react'
import { memo } from 'react'

import { Button } from '#ui/button'
import type { IWidgetNode } from '#widgets/types'
import { generateWidgetId, renderWidgetNode } from '#widgets/helpers'
import { requestTextContentEdit } from '@/lib/text-content-edit-event'
import { useWidgetsStore } from '@/store'

export function DraggableNode({ item, isActive }: { item: IWidgetNode; isActive: boolean }) {
  /**
   * click to edit widget content
   */
  const setActiveId = useWidgetsStore(state => state.setActiveId)
  const handleClickEdit = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setActiveId(item.id)
    requestTextContentEdit()
  }

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
          {item.type === 'TextContent' && (
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onMouseDown={handleClickEdit}
            >
              <Pencil />
            </Button>
          )}
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
