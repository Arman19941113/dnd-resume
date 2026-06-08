import i18n from 'i18next'
import { useEffect } from 'react'
import { toast } from 'sonner'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#ui/select'
import { isStorageAvailable } from '@/lib/storage'
import { setLanguage } from '@/locales/i18n'
import { EditHeader } from '@/routes/editor/sections/edit-header'
import { PanelConfig } from '@/routes/editor/sections/panel-config'
import { PanelDnd } from '@/routes/editor/sections/panel-dnd'
import { PanelMaterials } from '@/routes/editor/sections/panel-materials'

export function EditorPage() {
  useEffect(() => {
    const toastId = !isStorageAvailable()
      ? toast.warning(i18n.t('message.storageIsDisabled'), {
          description: i18n.t('message.storageIsDisabledDesc'),
          duration: Infinity,
        })
      : null
    return () => {
      if (toastId) {
        toast.dismiss(toastId)
      }
    }
  }, [])

  return (
    <div className="h-[100vh] min-w-[900px]">
      <EditHeader />
      <div className="flex h-[calc(100%-52px)]">
        {/* left materials panel */}
        <div className="scroll-thin flex h-full w-[200px] shrink-0 flex-col justify-between overflow-y-auto border-r">
          <PanelMaterials />
          <div className="p-4">
            <Select
              onValueChange={setLanguage}
              defaultValue={i18n.language}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="en">
                  <span>🇺🇸</span>English
                </SelectItem>
                <SelectItem value="zh">
                  <span>🇨🇳</span>中文
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* center dnd panel */}
        <div className="flex grow justify-center bg-zinc-50 p-4">
          <PanelDnd />
        </div>
        {/* right config panel */}
        <div className="scroll-thin h-full w-[292px] shrink-0 overflow-y-auto border-l 2xl:w-[332px]">
          <PanelConfig />
        </div>
      </div>
    </div>
  )
}
