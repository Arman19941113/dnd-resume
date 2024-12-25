import { TiptapEditor, TiptapRef } from '@/components/tiptap/tiptap-editor.tsx'
import { Button } from '@/components/ui/button.tsx'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.tsx'
import type { TextContentData } from '@/components/widgets/widgets-type.d.ts'
import { useRef, useState } from 'react'

const TextContentForm = ({
  data,
  onChange,
}: {
  data: TextContentData
  onChange: (value: TextContentData) => void
}) => {
  const { propsData } = data

  const [content, setContent] = useState('')
  const [open, setOpen] = useState<boolean>(false)
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setOpen(true)
      setContent(propsData.content)
    } else {
      setOpen(false)
      setContent('')
    }
  }
  const editorRef: TiptapRef = useRef(null)
  const handleSave = () => {
    if (editorRef.current) {
      const content = editorRef.current.getHTML()
      onChange({
        ...data,
        propsData: {
          ...propsData,
          content,
        },
      })
    }
    handleOpenChange(false)
  }

  return (
    <div>
      {/* 文本内容 */}
      <div>
        <div className="form-label">
          <span>文本内容</span>
        </div>

        {/* 编辑富文本 */}
        <Dialog
          open={open}
          onOpenChange={handleOpenChange}
        >
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full"
            >
              <span className="iconify ri--edit-line"></span>
              编辑内容
            </Button>
          </DialogTrigger>

          <DialogContent
            className="min-w-[800px]"
            onEscapeKeyDown={e => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>文本内容</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>

            {/* 富文本编辑器 */}
            <div className="h-[320px]">
              <TiptapEditor
                ref={editorRef}
                content={content}
              />
            </div>
            <DialogFooter>
              <Button onClick={handleSave}>保存内容</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export { TextContentForm }
