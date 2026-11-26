import i18n from 'i18next'
import { useEffect } from 'react'
import { toast } from 'sonner'

import { isStorageAvailable } from '@/lib/storage'
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
    <div className="h-screen min-w-[900px]">
      <EditHeader />
      <div className="flex h-[calc(100%-52px)]">
        {/* left materials panel */}
        <div className="scroll-thin h-full w-[200px] shrink-0 overflow-y-auto border-r">
          <PanelMaterials />
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
