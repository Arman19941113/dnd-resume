import { produce } from 'immer'
import { Upload } from 'lucide-react'
import type { ChangeEvent } from 'react'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import invariant from 'tiny-invariant'

import { Button } from '#ui/button'
import { Input } from '#ui/input'
import { Slider } from '#ui/slider'
import { AvatarRoundedSelect } from '#widgets/form/avatar/avatar-rounded-select'
import { ContactsForm } from '#widgets/form/contacts/contacts-form'
import type { IBasicInfoData, ILinkData } from '#widgets/types'
import { WIDGET_CONSTRAINTS } from '#widgets/constraints'

type PropsData = IBasicInfoData['propsData']

export function BasicInfoForm({
  propsData,
  onChange,
}: {
  propsData: PropsData
  onChange: (value: PropsData) => void
}) {
  const { t } = useTranslation()
  const { avatarUrl, avatarSize, avatarRound, name, jobTitle, linksGroup } = propsData

  function handleChange<K extends keyof PropsData>(fieldName: K, value: PropsData[K]) {
    onChange({
      ...propsData,
      [fieldName]: value,
    })
  }

  // upload local image
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const handleClickUpload = () => {
    invariant(fileInputRef.current)
    fileInputRef.current.click()
  }
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const objectUrl = URL.createObjectURL(file)
      handleChange('avatarUrl', objectUrl)
      // revoke old object url to avoid memory leak
      if (propsData.avatarUrl.startsWith('blob:')) {
        URL.revokeObjectURL(propsData.avatarUrl)
      }
    }
  }

  const handleLinkGroupChange = (groupIndex: number, linkGroup: ILinkData[]) => {
    const nextState = produce(linksGroup, draft => {
      draft[groupIndex] = linkGroup
    })
    handleChange('linksGroup', nextState)
  }

  return (
    <div>
      {/* Avatar URL */}
      <div>
        <div className="form-label">
          <span>{t('form.avatarUrl')}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Input
              className="mr-1 w-32 2xl:mr-2"
              value={avatarUrl}
              placeholder={t('form.enterAvatarUrl')}
              onChange={e => handleChange('avatarUrl', e.target.value)}
            />
            {/* upload local image */}
            <Button
              variant="outline"
              size="icon"
              onClick={handleClickUpload}
            >
              <Upload />
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <AvatarRoundedSelect
            url={avatarUrl}
            rounded={avatarRound}
            onChange={value => handleChange('avatarRound', value)}
          />
        </div>
      </div>
      {/* Avatar Size */}
      <div>
        <div className="form-label">
          <span>{t('form.avatarSize')}</span>
        </div>
        <div className="flex items-center">
          <Input
            className="mr-1 w-32 shrink-0 2xl:mr-2"
            type="number"
            min={WIDGET_CONSTRAINTS.basicInfo.avatar.size.min}
            max={WIDGET_CONSTRAINTS.basicInfo.avatar.size.max}
            value={avatarSize}
            onChange={e => handleChange('avatarSize', Number(e.target.value))}
          />
          <Slider
            min={WIDGET_CONSTRAINTS.basicInfo.avatar.size.min}
            max={WIDGET_CONSTRAINTS.basicInfo.avatar.size.max}
            value={[avatarSize]}
            onValueChange={value => handleChange('avatarSize', value[0])}
          />
        </div>
      </div>
      {/* Name */}
      <div>
        <div className="form-label">
          <span>{t('form.name')}</span>
        </div>
        <Input
          value={name}
          placeholder={t('form.enterName')}
          onChange={e => handleChange('name', e.target.value)}
        />
      </div>
      {/* Position */}
      <div>
        <div className="form-label">
          <span>{t('form.position')}</span>
        </div>
        <Input
          value={jobTitle}
          placeholder={t('form.enterPosition')}
          onChange={e => handleChange('jobTitle', e.target.value)}
        />
      </div>
      {/* Contact Information */}
      <div>
        <div className="form-label">
          <span>{t('form.contactInfo1')}</span>
        </div>
        <ContactsForm
          data={linksGroup[0]}
          onChange={data => handleLinkGroupChange(0, data)}
        />
        <div className="form-label">
          <span>{t('form.contactInfo2')}</span>
        </div>
        <ContactsForm
          data={linksGroup[1]}
          onChange={data => handleLinkGroupChange(1, data)}
        />
        <div className="form-label">
          <span>{t('form.contactInfo3')}</span>
        </div>
        <ContactsForm
          data={linksGroup[2]}
          onChange={data => handleLinkGroupChange(2, data)}
        />
      </div>
    </div>
  )
}
