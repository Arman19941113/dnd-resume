import { Button } from '@/components/ui/button.tsx'
import { Input } from '@/components/ui/input.tsx'
import { LinkIconSelect } from '@/components/widgets/link/link-icon-select.tsx'
import { LinkInput } from '@/components/widgets/link/link-input.tsx'
import type { LinkItem } from '@/components/widgets/widgets-util.ts'
import { createLinkItem } from '@/components/widgets/widgets-util.ts'
import { produce } from 'immer'

interface LinkGroupProps {
  data: LinkItem[]
  onChange: (data: LinkItem[]) => void
}

const LinkGroupForm = ({ data, onChange }: LinkGroupProps) => {
  const handleChange = (index: number, field: keyof LinkItem, value: string) => {
    const nextState = produce(data, draft => {
      draft[index][field] = value
    })
    onChange(nextState)
  }
  const handleDelete = (index: number) => {
    const nextState = produce(data, draft => {
      draft.splice(index, 1)
    })
    onChange(nextState)
  }
  const LINK_LENGTH_LIMIT = 3
  const showCreate = data.length < LINK_LENGTH_LIMIT
  const handleCreate = () => {
    onChange([...data, createLinkItem()])
  }

  return (
    <ul>
      {data.map((item, index) => (
        <li
          key={index}
          className="mb-2 flex items-center"
        >
          <LinkIconSelect
            value={item.icon}
            onChange={newIcon => handleChange(index, 'icon', newIcon)}
            className="mr-1 shrink-0"
          />
          <Input
            value={item.content}
            onChange={e => handleChange(index, 'content', e.target.value)}
          />
          <LinkInput
            value={item.href}
            onChange={newHref => handleChange(index, 'href', newHref)}
            className="ml-1 shrink-0"
          />
          <Button
            className="ml-1 shrink-0"
            variant="outline"
            size="icon"
            onClick={() => handleDelete(index)}
          >
            <span className="iconify ri--delete-bin-line"></span>
          </Button>
        </li>
      ))}
      {showCreate && (
        <li className="mb-2 flex items-center">
          <Button
            className="w-full"
            variant="outline"
            size="icon"
            onClick={handleCreate}
          >
            <span className="iconify text-lg ri--add-line"></span>
          </Button>
        </li>
      )}
    </ul>
  )
}

export { LinkGroupForm }
