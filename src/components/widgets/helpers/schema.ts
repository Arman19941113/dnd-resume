import { z } from 'zod'

import { LINK_ICON_NAMES } from '#widgets/types'

const linkSchema = z.object({
  href: z.string(),
  content: z.string(),
  icon: z.enum(LINK_ICON_NAMES),
})

const basicInfoSchema = z.object({
  type: z.literal('BasicInfo'),
  id: z.string(),
  data: z.object({
    propsData: z.object({
      avatarUrl: z.string(),
      avatarSize: z.number(),
      avatarRound: z.boolean(),
      name: z.string(),
      jobTitle: z.string(),
      linksGroup: z.tuple([z.array(linkSchema), z.array(linkSchema), z.array(linkSchema)]),
    }),
    styleData: z.object({
      marginTop: z.number(),
      marginBottom: z.number(),
    }),
  }),
})

const titleSectionSchema = z.object({
  type: z.literal('TitleSection'),
  id: z.string(),
  data: z.object({
    propsData: z.object({
      title: z.string(),
    }),
    styleData: z.object({
      marginTop: z.number(),
      marginBottom: z.number(),
    }),
  }),
})

const experienceTimeSchema = z.object({
  type: z.literal('ExperienceTime'),
  id: z.string(),
  data: z.object({
    propsData: z.object({
      title: z.string(),
      dateRange: z.string(),
    }),
    styleData: z.object({
      marginTop: z.number(),
      marginBottom: z.number(),
    }),
  }),
})

const textContentSchema = z.object({
  type: z.literal('TextContent'),
  id: z.string(),
  data: z.object({
    propsData: z.object({
      content: z.string(),
    }),
    styleData: z.object({
      marginTop: z.number(),
      marginBottom: z.number(),
    }),
  }),
})

const imageSectionSchema = z.object({
  type: z.literal('ImageSection'),
  id: z.string(),
  data: z.object({
    propsData: z.object({
      url: z.string(),
      imageSize: z.number(),
      borderRadius: z.number().optional().default(0),
    }),
    styleData: z.object({
      marginTop: z.number(),
      marginBottom: z.number(),
    }),
  }),
})

const widgetSchema = z.discriminatedUnion('type', [
  basicInfoSchema,
  titleSectionSchema,
  experienceTimeSchema,
  textContentSchema,
  imageSectionSchema,
])

export const widgetsSchema = widgetSchema.array()
