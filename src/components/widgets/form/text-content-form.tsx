import { UserPen } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { TiptapRef } from '#tiptap/editor'
import { TiptapEditor } from '#tiptap/editor'
import { Button } from '#ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#ui/dialog'
import type { ITextContentData } from '#widgets/types'
import { onTextContentEdit } from '@/lib/text-content-edit-event'

type PropsData = ITextContentData['propsData']

export function TextContentForm({
  propsData,
  onChange,
}: {
  propsData: PropsData
  onChange: (value: PropsData) => void
}) {
  const { t } = useTranslation()

  function handleChange<K extends keyof PropsData>(name: K, value: PropsData[K]) {
    onChange({
      ...propsData,
      [name]: value,
    })
  }

  // edit rich text
  const [content, setContent] = useState('')
  const [open, setOpen] = useState<boolean>(false)
  const initialContentRef = useRef('')
  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        setOpen(true)
        setContent(propsData.content)
        initialContentRef.current = ''
      } else {
        setOpen(false)
        setContent('')
        initialContentRef.current = ''
      }
    },
    [propsData.content],
  )
  const editorRef: TiptapRef = useRef(null)
  const handleEditorReady = useCallback((nextContent: string) => {
    initialContentRef.current = nextContent
  }, [])
  const handleSave = () => {
    if (editorRef.current) {
      handleChange('content', editorRef.current.getHTML())
    }
    handleOpenChange(false)
  }
  const hasContentChanged = () => {
    if (!editorRef.current) return false
    return editorRef.current.getHTML() !== (initialContentRef.current || content)
  }

  useEffect(() => {
    return onTextContentEdit(() => handleOpenChange(true))
  }, [handleOpenChange])

  return (
    <div>
      {/* Text Content */}
      <div>
        <div className="form-label">
          <span>{t('form.textContent')}</span>
        </div>

        {/* Edit Rich Text */}
        <Dialog
          open={open}
          onOpenChange={handleOpenChange}
        >
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full"
            >
              <UserPen />
              {t('form.editContent')}
            </Button>
          </DialogTrigger>

          <DialogContent
            className="sm:min-w-[600px] lg:min-w-[800px]"
            onEscapeKeyDown={e => {
              if (hasContentChanged()) {
                e.preventDefault()
              }
            }}
          >
            <DialogHeader>
              <DialogTitle>{t('form.textContent')}</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>

            {/* Rich Text Editor */}
            <div className="h-[320px]">
              <TiptapEditor
                ref={editorRef}
                content={content}
                onReady={handleEditorReady}
              />
            </div>
            <DialogFooter>
              <Button onClick={handleSave}>{t('common.save')}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
