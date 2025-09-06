import type { IWidgetNode } from '#widgets/types'
import { getLocalStorage, removeLocalStorage, setLocalStorage } from '@/lib/storage'

// Store the language of the app
const NAME_LANGUAGE = 'LANGUAGE'
// Store the json data of the widgets
const NAME_WIDGETS = 'WIDGET'

export const storageService = {
  getWidgets(): IWidgetNode[] | null {
    return getLocalStorage(NAME_WIDGETS)
  },
  setWidgets(widgets: IWidgetNode[]) {
    setLocalStorage(NAME_WIDGETS, widgets)
  },
  removeWidgets() {
    removeLocalStorage(NAME_WIDGETS)
  },

  getLanguage(): string | null {
    return getLocalStorage(NAME_LANGUAGE)
  },
  setLanguage(lang: string) {
    setLocalStorage(NAME_LANGUAGE, lang)
  },
}
