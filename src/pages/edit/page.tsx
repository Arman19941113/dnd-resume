import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx'
import { isLocalStorageAvailable } from '@/lib/storage.ts'
import { setLanguage } from '@/locales/i18n.ts'
import { EditHeader } from '@/pages/edit/sections/edit-header.tsx'
import { PanelConfig } from '@/pages/edit/sections/panel-config.tsx'
import { PanelDnd } from '@/pages/edit/sections/panel-dnd.tsx'
import { PanelMaterials } from '@/pages/edit/sections/panel-materials.tsx'
import i18n from 'i18next'
import { useEffect } from 'react'
import { toast } from 'sonner'

const PageEdit = () => {
  useEffect(() => {
    const toastId = !isLocalStorageAvailable()
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
              <SelectContent>
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

export { PageEdit }
