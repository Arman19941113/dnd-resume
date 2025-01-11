import { BasicInfo } from '@/components/widgets/node/basic-info.tsx'
import { ExperienceTime } from '@/components/widgets/node/experience-time.tsx'
import { ImageSection } from '@/components/widgets/node/image-section.tsx'
import { TextContent } from '@/components/widgets/node/text-content.tsx'
import { TitleSection } from '@/components/widgets/node/title-section.tsx'
import { widgetsSchema } from '@/components/widgets/widgets-schema'
import type { WidgetNode } from '@/components/widgets/widgets-type.d.ts'
import { getBasename } from '@/components/widgets/widgets-util.ts'
import { decodeFromBase64Url } from '@/lib/utils'
import { useWidgetsStore } from '@/store/widgets-store.ts'
import { useEffect } from 'react'
import { useNavigate, useSearchParams, useParams } from 'react-router-dom'
import { toast } from 'sonner'

const PagePreview = () => {
  const { filename } = useParams()
  let widgets = useWidgetsStore(state => state.widgets)
  
  // 从文件读取数据
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`/resumes/${filename}`)
        const base64Content = await response.text()
        const json = decodeFromBase64Url(base64Content.trim())
        const ret = widgetsSchema.safeParse(JSON.parse(json))
        if (ret.success) {
          widgets = ret.data
        } else {
          console.error(ret.error)
          toast.error('文件解析失败')
        }
      } catch (error) {
        console.error(error)
        toast.error('文件加载失败')
      }
    }

    if (filename) {
      fetchContent()
    }
  }, [filename])

  /**
   * Get widgets data from the URL query string.
   */
  const [searchParams] = useSearchParams()
  const data = searchParams.get('data')
  if (data) {
    try {
      const json = decodeFromBase64Url(data)
      const ret = widgetsSchema.safeParse(JSON.parse(json))
      if (ret.success) {
        widgets = ret.data
      } else {
        widgets = []
        console.error(ret.error)
        setTimeout(() => {
          toast.error('参数解析失败', {
            position: 'top-center',
          })
        }, 100)
      }
    } catch (error) {
      widgets = []
      console.error(error)
      setTimeout(() => {
        toast.error('参数解析失败', {
          position: 'top-center',
        })
      }, 100)
    }
  }

  /**
   * Print the page when the `PRINT` session storage is set.
   */
  const navigate = useNavigate()
  useEffect(() => {
    if (sessionStorage.getItem('PRINT')) {
      sessionStorage.removeItem('PRINT')
      Promise.resolve().then(() => {
        // print filename
        const originalTitle = document.title
        document.title = getBasename(widgets) || originalTitle

        window.addEventListener(
          'afterprint',
          () => {
            document.title = originalTitle
            navigate(-1)
          },
          { once: true },
        )
        window.print()
      })
    }
  }, [navigate, widgets])

  const WidgetRenderComponent = (item: WidgetNode) => {
    switch (item.type) {
      case 'BasicInfo':
        return <BasicInfo data={item.data.propsData} />
      case 'TitleSection':
        return <TitleSection data={item.data.propsData} />
      case 'ExperienceTime':
        return <ExperienceTime data={item.data.propsData} />
      case 'TextContent':
        return <TextContent data={item.data.propsData} />
      case 'ImageSection':
        return <ImageSection data={item.data.propsData} />
    }
  }

  return (
    <div className="mx-auto lg:w-[900px] print:w-[900px]">
      <ul className="print-wrapper">
        {widgets.map(item => (
          <li
            key={item.id}
            className="flow-root"
          >
            <div style={item.data.styleData}>{WidgetRenderComponent(item)}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export { PagePreview }
