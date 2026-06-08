import { produce } from 'immer'
import { useTranslation } from 'react-i18next'
import { LayoutTemplate } from 'lucide-react'
import invariant from 'tiny-invariant'

import { BasicInfoForm } from '#widgets/form/basic-info-form'
import { ExperienceTimeForm } from '#widgets/form/experience-time-form'
import { ImageSectionForm } from '#widgets/form/image-section-form'
import { StyleForm } from '#widgets/form/style-form'
import { TextContentForm } from '#widgets/form/text-content-form'
import { TitleSectionForm } from '#widgets/form/title-section-form'
import type { IStyleData, IWidgetNode } from '#widgets/types'
import { useWidgetMaterialList } from '#widgets/common'
import type { WidgetsState } from '@/store'
import { useWidgetsStore } from '@/store'

export function PanelConfig() {
  const { t } = useTranslation()
  const widgetMaterialList = useWidgetMaterialList()
  const updateWidget = useWidgetsStore(state => state.updateWidget)

  const activeWidget = useWidgetsStore((state: WidgetsState) => {
    const { widgets, activeId } = state
    return widgets.find(item => item.id === activeId) || null
  })
  if (!activeWidget) return null

  const widgetMaterialInfo = widgetMaterialList.find(item => item.type === activeWidget.type)
  invariant(widgetMaterialInfo)

  /**
   * widget form
   */
  const onPropsDataChange = (propsData: IWidgetNode['data']['propsData']) => {
    const nextState = produce(activeWidget, draft => {
      draft.data.propsData = propsData
    })
    updateWidget(nextState)
  }
  const WidgetForm = (() => {
    switch (activeWidget.type) {
      case 'BasicInfo':
        return (
          <BasicInfoForm
            propsData={activeWidget.data.propsData}
            onChange={onPropsDataChange}
          />
        )
      case 'TitleSection':
        return (
          <TitleSectionForm
            propsData={activeWidget.data.propsData}
            onChange={onPropsDataChange}
          />
        )
      case 'ExperienceTime':
        return (
          <ExperienceTimeForm
            propsData={activeWidget.data.propsData}
            onChange={onPropsDataChange}
          />
        )
      case 'TextContent':
        return (
          <TextContentForm
            propsData={activeWidget.data.propsData}
            onChange={onPropsDataChange}
          />
        )
      case 'ImageSection':
        return (
          <ImageSectionForm
            propsData={activeWidget.data.propsData}
            onChange={onPropsDataChange}
          />
        )
      default: {
        const exhaustiveCheck: never = activeWidget
        return exhaustiveCheck
      }
    }
  })()

  /**
   * style form
   */
  const onStyleDataChange = (styleData: IStyleData) => {
    const nextState = produce(activeWidget, draft => {
      draft.data.styleData = styleData
    })
    updateWidget(nextState)
  }

  return (
    <div className="p-4">
      {/* specific widget form */}
      <div className="flex items-center text-xl">
        {widgetMaterialInfo.icon}
        <span className="ml-2 font-medium">{widgetMaterialInfo.title}</span>
      </div>
      {WidgetForm}

      {/* common style form */}
      <div className="mt-4 flex items-center text-xl">
        <LayoutTemplate className="icon-size" />
        <span className="ml-2 font-medium">{t('form.styleLayout')}</span>
      </div>
      <StyleForm
        styleData={activeWidget.data.styleData}
        onChange={onStyleDataChange}
      />
    </div>
  )
}
