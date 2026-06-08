import type { CSSProperties, JSX } from 'react'

export type WidgetType =
  | 'BasicInfo'
  | 'TitleSection'
  | 'ExperienceTime'
  | 'TextContent'
  | 'ImageSection'

export interface IWidgetMaterial {
  type: WidgetType
  icon: JSX.Element
  title: string
}

export type IWidgetNode =
  | {
      type: 'BasicInfo'
      id: string
      data: IBasicInfoData
    }
  | {
      type: 'TitleSection'
      id: string
      data: ITitleSectionData
    }
  | {
      type: 'ExperienceTime'
      id: string
      data: IExperienceTimeData
    }
  | {
      type: 'TextContent'
      id: string
      data: ITextContentData
    }
  | {
      type: 'ImageSection'
      id: string
      data: IImageSectionData
    }

export interface IStyleData extends CSSProperties {
  marginTop: number
  marginBottom: number
}

export interface IBasicInfoData {
  styleData: IStyleData
  propsData: {
    avatarUrl: string
    avatarSize: number
    avatarRound: boolean
    name: string
    jobTitle: string
    linksGroup: [ILinkGroupData, ILinkGroupData, ILinkGroupData]
  }
}
export type ILinkGroupData = ILinkData[]
export interface ILinkData {
  href: string
  content: string
  icon: LinkIconName
}

export interface ITitleSectionData {
  styleData: IStyleData
  propsData: {
    title: string
  }
}

export interface IExperienceTimeData {
  styleData: IStyleData
  propsData: {
    title: string
    dateRange: string
  }
}

export interface ITextContentData {
  styleData: IStyleData
  propsData: {
    content: string
  }
}

export interface IImageSectionData {
  styleData: IStyleData
  propsData: {
    url: string
    imageSize: number
    borderRadius: number
  }
}

export const LINK_ICON_NAMES = [
  'cake',
  'location',
  'phone',
  'wechat',
  'link',
  'github',
  'mail',
  'gmail',
] as const
export type LinkIconName = (typeof LINK_ICON_NAMES)[number]
