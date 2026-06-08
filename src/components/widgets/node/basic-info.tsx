import { clsx } from 'clsx'
import { LinkIconComponent } from '#widgets/common'
import type { IBasicInfoData } from '#widgets/types'

interface BasicInfoProps {
  data: IBasicInfoData['propsData']
}

export function BasicInfo({ data }: BasicInfoProps) {
  const { avatarUrl, avatarSize, avatarRound, name, jobTitle, linksGroup } = data

  const handleImgLoaded = () => {
    // change favicon to avatarUrl
    const link = document.querySelector("link[rel*='icon']")
    if (link instanceof HTMLLinkElement) {
      link.href = avatarUrl
    }
  }

  return (
    <div className="flex-center @container py-5">
      {/* Avatar */}
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="avatar"
          width={avatarSize || 100}
          height={avatarSize || 100}
          className={clsx('mr-8 @lg:mr-16', avatarRound && 'rounded-full')}
          draggable={false}
          onLoad={handleImgLoaded}
        />
      ) : null}
      <div className="basis-0">
        {/* Name & Position */}
        <div className="mb-1 flex items-end whitespace-nowrap">
          <span className="mr-3 text-2xl font-semibold">{name}</span>
          <span className="text-[17px]">{jobTitle}</span>
        </div>
        {/* Links & Contact Info */}
        <ul>
          {linksGroup.map((links, groupIndex) => (
            <li key={groupIndex}>
              <ul className="flex flex-wrap items-center @3xl:flex-nowrap">
                {links.map((item, index) => (
                  <li
                    key={index}
                    className="mr-4 flex h-8 min-w-40 items-center"
                  >
                    {/* link icon */}
                    <span className="flex-center mr-2">{LinkIconComponent(item.icon)}</span>
                    {/* link content */}
                    <a
                      href={item.href || undefined}
                      className={clsx('font-mono', item.href && 'underline')}
                      target="_blank"
                    >
                      {item.content}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
