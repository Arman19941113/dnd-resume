import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { widgetsSchema } from '@/components/widgets/widgets-schema'
import { getBasename } from '@/components/widgets/widgets-util.ts'
import { encodeToBase64Url } from '@/lib/utils.ts'
import { useWidgetsStore } from '@/store/widgets-store.ts'
import { type ChangeEvent, useRef } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

const EditHeader = () => {
  const widgets = useWidgetsStore(state => state.widgets)
  const resetWidgets = useWidgetsStore(state => state.resetWidgets)
  const setWidgets = useWidgetsStore(state => state.setWidgets)
  const setSelectedId = useWidgetsStore(state => state.setSelectedId)
  const navigate = useNavigate()

  const inputRef = useRef<HTMLInputElement>(null)
  const handleImportConfig = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = e => {
        try {
          const json = e.target?.result as string
          const ret = widgetsSchema.safeParse(JSON.parse(json))
          if (ret.success) {
            const importedWidgets = ret.data
            setWidgets(importedWidgets)
            setSelectedId(importedWidgets.length ? importedWidgets[0].id : '')
            toast.success('成功导入配置文件', {
              position: 'top-center',
            })
          } else {
            console.error(ret.error)
            toast.error('配置文件解析失败', {
              position: 'top-center',
            })
          }
        } catch (error) {
          console.error(error)
          toast.error('配置文件解析失败', {
            position: 'top-center',
          })
        }
      }
      reader.readAsText(file)
    }
  }

  const handleClickExport = () => {
    const dataStr = JSON.stringify(widgets, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = (getBasename(widgets) || 'resume-config') + '.json'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('成功导出配置文件', {
      position: 'top-center',
    })
  }

  const handleExportBase64 = () => {
    const base64 = encodeToBase64Url(JSON.stringify(widgets))
    const blob = new Blob([base64], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = (getBasename(widgets) || 'resume') + '.txt'
    a.click() 
    URL.revokeObjectURL(url)
    toast.success('成功导出 base64 文件', {
      position: 'top-center',
    })
  }

  const handleClickPreview = () => {
    const base64 = encodeToBase64Url(JSON.stringify(widgets))
    navigate('/preview?data=' + base64)
  }

  const handleClickPrint = () => {
    sessionStorage.setItem('PRINT', 'true')
    const base64 = encodeToBase64Url(JSON.stringify(widgets))
    navigate('/preview?data=' + base64)
  }

  return (
    <div className="border-b-10 flex h-[52px] items-center justify-between border-b px-6">
      {/* github */}
      <a
        href="https://github.com/Arman19941113/dnd-resume"
        target="_blank"
        className="flex-center"
      >
        <span className="iconify text-2xl ri--github-fill"></span>
        <span className="ml-1 text-sm underline">Github</span>
      </a>

      <div className="flex-center gap-4">
        <input
          ref={inputRef}
          type="file"
          accept="application/json"
          onChange={handleImportConfig}
          style={{ display: 'none' }}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
        >
          导入配置
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleClickExport}
        >
          导出配置
        </Button>

        <Button
          variant="outline"
          size="sm" 
          onClick={handleExportBase64}
        >
          导出 base64
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
            >
              重置
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确认重置？</AlertDialogTitle>
              <AlertDialogDescription>重置后数据不可恢复。</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction onClick={resetWidgets}>确认</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="flex-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleClickPreview}
        >
          预览
        </Button>
        <Button
          size="sm"
          onClick={handleClickPrint}
        >
          打印
        </Button>
      </div>
    </div>
  )
}
export { EditHeader }
