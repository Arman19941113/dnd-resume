import { create } from 'zustand'

import type { IWidgetNode } from '#widgets/types'
import { getWidgets } from '#widgets/helpers'
import { storageService } from '@/services/storage'

export interface WidgetsState {
  widgets: IWidgetNode[]
  addWidget: (widget: IWidgetNode) => void
  removeWidget: (id: string) => void
  updateWidget: (widget: IWidgetNode) => void
  setWidgets: (nextWidgets: IWidgetNode[]) => void
  resetWidgets: () => void

  activeId: string | null
  setActiveId: (id: string) => void
}

export const useWidgetsStore = create<WidgetsState>()(set => {
  const initialWidgets = getWidgets()
  const initialActiveId = initialWidgets.length ? initialWidgets[0].id : null

  return {
    widgets: initialWidgets,
    addWidget: (widget: IWidgetNode) => {
      set(state => {
        const { activeId: currentActiveId, widgets: currentWidgets } = state
        const newWidgets = [...currentWidgets]
        if (!currentActiveId) {
          newWidgets.push(widget)
        } else {
          const index = currentWidgets.findIndex(item => item.id === currentActiveId)
          if (index === -1) {
            newWidgets.push(widget)
          } else {
            newWidgets.splice(index + 1, 0, widget)
          }
        }
        return {
          widgets: newWidgets,
          activeId: widget.id,
        }
      })
    },
    removeWidget: (id: string) => {
      set(state => {
        const { widgets: currentWidgets } = state
        const index = currentWidgets.findIndex(item => item.id === id)
        const newWidgets = currentWidgets.filter(widget => widget.id !== id)
        const nextActiveId =
          newWidgets.length === 0
            ? null // Last one deleted
            : newWidgets.length > index
              ? newWidgets[index].id // Focus on next widget
              : newWidgets.length === index
                ? newWidgets[index - 1].id // Deleted the last one
                : null
        return {
          widgets: newWidgets,
          activeId: nextActiveId,
        }
      })
    },
    updateWidget: (widget: IWidgetNode) => {
      set(state => {
        const { widgets: currentWidgets } = state
        return {
          widgets: currentWidgets.map(item => (item.id === widget.id ? widget : item)),
        }
      })
    },
    setWidgets: (nextWidgets: IWidgetNode[]) => {
      set({ widgets: nextWidgets })
    },
    resetWidgets: () => {
      set({ widgets: [], activeId: null })
    },

    activeId: initialActiveId,
    setActiveId: (id: string) => set({ activeId: id }),
  }
})

/**
 * persist widgets change
 */
useWidgetsStore.subscribe((state: WidgetsState) => {
  const { widgets } = state
  if (!widgets || widgets.length === 0) {
    storageService.removeWidgets()
    return
  }
  storageService.setWidgets(widgets)
})
