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
        <div className="flex h-full w-[200px] shrink-0 flex-col border-r">
          <div className="scroll-thin min-h-0 flex-1 overflow-y-auto">
            <PanelMaterials />
          </div>
          <footer className="text-muted-foreground shrink-0 border-t px-4 py-2 text-center text-xs">
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              渝ICP备2025063511号-1
            </a>
          </footer>
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
