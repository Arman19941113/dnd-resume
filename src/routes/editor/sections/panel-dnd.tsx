import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core/dist/types'
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import type { RefObject } from 'react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { DraggableNodeWrapper } from '@/routes/editor/components/draggable-node-wrapper'
import { useWidgetsStore } from '@/store'

const RESUME_CANVAS_WIDTH = 900
const A4_PAGE_HEIGHT_RATIO = 297 / 210
const PAGE_BREAK_HINT_INTERVAL = RESUME_CANVAS_WIDTH * A4_PAGE_HEIGHT_RATIO

export function PanelDnd() {
  const widgets = useWidgetsStore(s => s.widgets)
  const setWidgets = useWidgetsStore(s => s.setWidgets)
  const setActiveId = useWidgetsStore(s => s.setActiveId)
  const containerRef = useRef<HTMLUListElement>(null)

  /**
   * dnd logic
   */
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 2,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return
    const activeId = String(active.id)
    const overId = String(over.id)
    if (activeId !== overId) {
      const oldIndex = widgets.findIndex(item => item.id === activeId)
      if (oldIndex === -1) return
      const newIndex = widgets.findIndex(item => item.id === overId)
      if (newIndex === -1) return
      setWidgets(arrayMove(widgets, oldIndex, newIndex))
      setActiveId(activeId)
    }
  }

  return (
    <ul
      ref={containerRef}
      className="widgets-container scroll-thin relative isolate basis-[900px] overflow-auto rounded-2xl border"
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToParentElement, restrictToVerticalAxis]}
      >
        <SortableContext
          items={widgets}
          strategy={verticalListSortingStrategy}
        >
          {widgets.map(item => (
            <DraggableNodeWrapper
              key={item.id}
              item={item}
            />
          ))}
        </SortableContext>
      </DndContext>
      <PageBreakGuides containerRef={containerRef} />
    </ul>
  )
}

/**
 * Shows where the next A4 print page starts inside the editor canvas.
 */
function PageBreakGuides({ containerRef }: { containerRef: RefObject<HTMLUListElement | null> }) {
  const { t } = useTranslation()
  const [scrollHeight, setScrollHeight] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    let frameId: number | null = null

    const measure = () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId)
      }
      frameId = requestAnimationFrame(() => {
        frameId = null
        setScrollHeight(container.scrollHeight)
      })
    }

    const resizeObserver = new ResizeObserver(measure)
    const observeCanvasItems = () => {
      resizeObserver.disconnect()
      resizeObserver.observe(container)
      Array.from(container.children).forEach(child => {
        if (!(child instanceof HTMLElement) || child.dataset.pageBreakGuides === 'true') {
          return
        }
        resizeObserver.observe(child)
      })
    }

    const mutationObserver = new MutationObserver(() => {
      observeCanvasItems()
      measure()
    })

    observeCanvasItems()
    mutationObserver.observe(container, { childList: true })
    measure()

    return () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId)
      }
      resizeObserver.disconnect()
      mutationObserver.disconnect()
    }
  }, [containerRef])

  const guideCount = Math.max(0, Math.floor((scrollHeight - 1) / PAGE_BREAK_HINT_INTERVAL))

  if (guideCount === 0) return null

  return (
    <li
      aria-hidden="true"
      data-page-break-guides="true"
      className="pointer-events-none absolute top-0 right-0 left-0 z-[1]"
      style={{ height: scrollHeight }}
    >
      {Array.from({ length: guideCount }).map((_, index) => {
        const pageNumber = index + 2
        return (
          <div
            key={pageNumber}
            className="absolute right-0 left-0 border-t border-dashed border-rose-500/70"
            style={{ top: (index + 1) * PAGE_BREAK_HINT_INTERVAL }}
          >
            <span className="absolute right-3 -top-3 rounded-sm bg-rose-50 px-1.5 py-0.5 text-[11px] leading-none font-medium text-rose-700 shadow-sm ring-1 ring-rose-200">
              {t('editor.pageBreakHint', { page: pageNumber })}
            </span>
          </div>
        )
      })}
    </li>
  )
}
