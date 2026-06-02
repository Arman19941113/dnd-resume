import { useState } from 'react'

import { Button } from '#ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '#ui/popover'
import type { LinkIconName } from '#widgets/types'
import { LINK_ICON_NAMES } from '#widgets/types'
import { LinkIconComponent } from '#widgets/common'

interface LinkIconSelectProps {
  value: string
  onChange: (value: LinkIconName) => void
  className?: string
}

export function IconSelect({ value, onChange, className }: LinkIconSelectProps) {
  const [open, setOpen] = useState<boolean>(false)
  const handleClickIcon = (name: LinkIconName) => {
    onChange(name)
    setOpen(false)
  }

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          className={className}
          variant="outline"
          size="icon"
        >
          {LinkIconComponent(value)}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-52"
        align="start"
      >
        <div className="flex flex-wrap justify-between">
          {LINK_ICON_NAMES.map(name => (
            <Button
              key={name}
              variant="outline"
              size="icon"
              className="mb-2"
              onClick={() => handleClickIcon(name)}
            >
              {LinkIconComponent(name)}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
