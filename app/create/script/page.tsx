'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2 } from 'lucide-react'
import { StoryboardEditor } from '@/components/storyboard-editor'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'

interface ScriptTemplate {
  id: string
  name: string
  prompt: string
}

export default function ScriptGenerationPage() {
  const router = useRouter()
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [inputContent, setInputContent] = useState('')
  const [prompt, setPrompt] = useState('')
  const [generating, setGenerating] = useState(false)
  const [storyboard, setStoryboard] = useState<{ id: string; text: string }[]>(
    []
  )
  const [activeTab, setActiveTab] = useState('input')
  const [templates, setTemplates] = useState<ScriptTemplate[]>([])
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('script_templates')
        .select('*')
        .order('created_at')

      if (error) throw error
      setTemplates(data || [])
    } catch (error) {
      console.error('获取模板失败:', error)
      toast.error('获取模板失败')
    } finally {
      setIsLoadingTemplates(false)
    }
  }

  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value)
    const template = templates.find((t) => t.id === value)
    if (template) {
      setPrompt(template.prompt)
    }
  }

  const handleGenerate = async () => {
    if (!inputContent.trim()) {
      toast.error('请输入内容以生成脚本')
      return
    }

    setGenerating(true)

    try {
      // 这里可以添加实际的 AI 生成逻辑
      // 目前使用模拟数据
      setTimeout(() => {
        const mockStoryboard = [
          { id: '1', text: '主题介绍，突出关键亮点。' },
          { id: '2', text: '详细解释第一个要点，并提供支持证据。' },
          { id: '3', text: '探讨第二个要点，并提供实际案例。' },
          { id: '4', text: '讨论影响和未来考虑。' },
          { id: '5', text: '总结关键要点。' }
        ]

        setStoryboard(mockStoryboard)
        setGenerating(false)
        setActiveTab('preview')
      }, 2000)
    } catch (error) {
      console.error('生成脚本失败:', error)
      toast.error('生成脚本失败')
      setGenerating(false)
    }
  }

  const handleContinue = () => {
    localStorage.setItem('storyboard', JSON.stringify(storyboard))
    router.push('/create/audio')
  }

  return (
    <div className="space-y-6 pb-10">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="input">输入</TabsTrigger>
          <TabsTrigger value="preview" disabled={storyboard.length === 0}>
            预览
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input">
          <Card>
            <CardHeader>
              <CardTitle>脚本生成</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="template">选择模板</Label>
                <Select
                  value={selectedTemplate}
                  onValueChange={handleTemplateChange}
                  disabled={isLoadingTemplates}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        isLoadingTemplates ? '加载中...' : '选择模板'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedTemplate && (
                <div className="space-y-2">
                  <Label htmlFor="prompt">提示词</Label>
                  <Textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={3}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="content">输入内容</Label>
                <Textarea
                  id="content"
                  value={inputContent}
                  onChange={(e) => setInputContent(e.target.value)}
                  placeholder="输入新闻文章、产品详情或其他内容以生成脚本..."
                  rows={8}
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={generating || !inputContent.trim()}
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    生成中...
                  </>
                ) : (
                  '生成脚本'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>脚本预览</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <StoryboardEditor
                storyboard={storyboard}
                setStoryboard={setStoryboard}
              />

              <div className="flex justify-end">
                <Button onClick={handleContinue}>继续到音频生成</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
