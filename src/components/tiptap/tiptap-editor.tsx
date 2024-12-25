import { TiptapMenu } from '@/components/tiptap/tiptap-memu.tsx'
import Link from '@tiptap/extension-link'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import type { MouseEvent, Ref } from 'react'
import { useImperativeHandle } from 'react'
import '@/components/tiptap/tiptap.css'

const extensions = [StarterKit, Link]

export type TiptapRef = Ref<{
  getHTML: () => string
}>

interface TiptapProps {
  ref: TiptapRef
  content: string
}

const TiptapEditor = ({ content, ref }: TiptapProps) => {
  const editor = useEditor({
    extensions,
    content,
    onCreate: ({ editor }) => {
      const lastPosition = editor.state.doc.content.size
      editor.chain().focus().setTextSelection(lastPosition).run()
    },
  })

  const handleClickBg = (e: MouseEvent<HTMLDivElement>) => {
    if (editor && e.target === e.currentTarget) {
      const lastPosition = editor.state.doc.content.size
      editor.chain().focus().setTextSelection(lastPosition).run()
    }
  }

  useImperativeHandle(ref, () => {
    return {
      getHTML: () => editor?.getHTML() || '',
    }
  }, [editor])

  return (
    <div
      className="h-full"
      onClick={handleClickBg}
    >
      <div className="h-10 w-full">{editor && <TiptapMenu editor={editor} />}</div>
      <div className="h-[calc(100%-48px)] overflow-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export { TiptapEditor }
