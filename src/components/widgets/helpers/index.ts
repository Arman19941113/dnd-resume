import i18n from 'i18next'
import { toast } from 'sonner'

import type { IWidgetNode } from '#widgets/types'
import { storageService } from '@/services/storage'
import { widgetsSchema } from '#widgets/helpers/schema'
import { createDefaultWidgets } from './factory'

// get widgets from storage
export function getWidgets(): IWidgetNode[] {
  let widgets: IWidgetNode[] = []
  const json = storageService.getWidgets()
  if (json) {
    const ret = widgetsSchema.safeParse(json)
    if (ret.success) {
      widgets = ret.data
    } else {
      console.warn('Local config parse error', ret.error)
      setTimeout(() => {
        toast.error(i18n.t('message.parseError'))
      }, 100)
    }
  } else {
    widgets = createDefaultWidgets()
  }
  return widgets
}

// generate basename(without extname) of config or pdf file
export function generateBasename(widgets: IWidgetNode[]) {
  const basicInfo = widgets.find(item => item.type === 'BasicInfo')
  if (basicInfo) {
    const { name, jobTitle } = basicInfo.data.propsData
    return `${name} - ${jobTitle}`
  }
  return ''
}

export * from './factory'
export * from './render-widget-node'
export * from './schema'
