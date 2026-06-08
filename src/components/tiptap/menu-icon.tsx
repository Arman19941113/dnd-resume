import { clsx } from 'clsx'
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Redo2,
  Strikethrough,
  Type,
  Undo2,
} from 'lucide-react'

type IconName =
  | 'bold'
  | 'bullet-list'
  | 'code'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'italic'
  | 'link'
  | 'ordered-list'
  | 'paragraph'
  | 'redo'
  | 'strike'
  | 'undo'
function IconRenderComponent({ name }: { name: IconName }) {
  const size = 20
  switch (name) {
    case 'undo':
      return <Undo2 size={size} />
    case 'redo':
      return <Redo2 size={size} />
    case 'paragraph':
      return <Type size={size} />
    case 'h1':
      return <Heading1 size={size} />
    case 'h2':
      return <Heading2 size={size} />
    case 'h3':
      return <Heading3 size={size} />
    case 'bold':
      return <Bold size={size} />
    case 'italic':
      return <Italic size={size} />
    case 'strike':
      return <Strikethrough size={size} />
    case 'code':
      return <Code size={size} />
    case 'link':
      return <Link2 size={size} />
    case 'bullet-list':
      return <List size={size} />
    case 'ordered-list':
      return <ListOrdered size={size} />
    default: {
      const exhaustiveCheck: never = name
      return exhaustiveCheck
    }
  }
}

export function TiptapMenuIcon(props: { name: IconName; active?: boolean; onClick?: () => void }) {
  const { name, active, onClick } = props
  return (
    <div
      className={clsx(
        'flex-center mr-2 h-7 cursor-pointer rounded px-1 hover:bg-zinc-200',
        active && 'bg-zinc-200',
      )}
      onClick={onClick}
    >
      <IconRenderComponent name={name} />
    </div>
  )
}
