import { type ChangeEvent, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

import { LogoGithub } from '@/components/common/svg-icons'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '#ui/alert-dialog'
import { Button } from '#ui/button'
import { generateBasename, widgetsSchema } from '#widgets/helpers'
import { encodeText } from '@/lib/codec'
import { useWidgetsStore } from '@/store'

export function EditHeader() {
  const { t } = useTranslation()
  const widgets = useWidgetsStore(state => state.widgets)
  const resetWidgets = useWidgetsStore(state => state.resetWidgets)
  const setWidgets = useWidgetsStore(state => state.setWidgets)
  const setActiveId = useWidgetsStore(state => state.setActiveId)
  const navigate = useNavigate()

  const inputRef = useRef<HTMLInputElement>(null)
  const handleImportConfig = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.addEventListener('load', e => {
        try {
          const { result } = e.target ?? {}
          if (typeof result !== 'string') {
            throw new Error('Imported config is not text')
          }
          const text = result
          const ret = widgetsSchema.safeParse(JSON.parse(text))
          if (ret.success) {
            const importedWidgets = ret.data
            setWidgets(importedWidgets)
            setActiveId(importedWidgets.length ? importedWidgets[0].id : '')
            toast.success(t('message.importSuccess'))
          } else {
            throw ret.error
          }
        } catch (error) {
          console.warn('Import config parse error', error)
          toast.error(t('message.parseError'))
        }
      })
      reader.readAsText(file)
      event.target.value = ''
    }
  }

  const handleClickExport = () => {
    const dataStr = JSON.stringify(widgets, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = (generateBasename(widgets) || 'resume-config') + '.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleClickView = () => {
    const base64 = encodeText(JSON.stringify(widgets))
    void navigate('/view?data=' + base64)
  }

  const handleClickPrint = () => {
    void navigate('/print?print=true')
  }

  return (
    <div className="flex h-[52px] items-center justify-between border-b px-6">
      {/* github */}
      <a
        href="https://github.com/Arman19941113/dnd-resume"
        target="_blank"
        className="flex-center"
      >
        <LogoGithub
          width={20}
          height={20}
        />
        <span className="ml-1 text-sm underline">Github</span>
      </a>

      <div className="flex-center gap-4">
        <input
          ref={inputRef}
          type="file"
          accept="application/json"
          onChange={handleImportConfig}
          style={{ display: 'none' }}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
        >
          {t('common.importConfig')}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleClickExport}
        >
          {t('common.exportConfig')}
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
            >
              {t('common.reset')}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('message.confirmReset')}</AlertDialogTitle>
              <AlertDialogDescription>{t('message.resetWarning')}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={resetWidgets}>{t('common.confirm')}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="flex-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleClickView}
        >
          {t('common.view')}
        </Button>
        <Button
          size="sm"
          onClick={handleClickPrint}
        >
          {t('common.print')}
        </Button>
      </div>
    </div>
  )
}
