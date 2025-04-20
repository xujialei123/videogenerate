"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { StoryboardAudioEditor } from "@/components/storyboard-audio-editor"

// Mock voice models
const voiceModels = [
  { id: "voice1", name: "Professional Male" },
  { id: "voice2", name: "Professional Female" },
  { id: "voice3", name: "Casual Male" },
  { id: "voice4", name: "Casual Female" },
  { id: "voice5", name: "News Anchor" },
]

export default function AudioGenerationPage() {
  const router = useRouter()
  const [storyboard, setStoryboard] = useState<{ id: string; text: string; audioUrl?: string }[]>([])
  const [selectedVoice, setSelectedVoice] = useState("")
  const [stability, setStability] = useState([0.5])
  const [clarity, setClarity] = useState([0.7])
  const [generating, setGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState("settings")

  useEffect(() => {
    // Load storyboard from previous step
    const savedStoryboard = localStorage.getItem("storyboard")
    if (savedStoryboard) {
      setStoryboard(JSON.parse(savedStoryboard))
    } else {
      // Mock data if nothing is saved
      setStoryboard([
        { id: "1", text: "Introduction to the topic with key highlights." },
        { id: "2", text: "Detailed explanation of the first main point with supporting evidence." },
        { id: "3", text: "Exploration of the second main point with real-world examples." },
        { id: "4", text: "Discussion of implications and future considerations." },
        { id: "5", text: "Conclusion summarizing the key takeaways." },
      ])
    }
  }, [])

  const handleGenerateAudio = () => {
    if (!selectedVoice) {
      alert("Please select a voice model")
      return
    }

    setGenerating(true)

    // Simulate AI audio generation
    setTimeout(() => {
      // Mock generated audio URLs
      const updatedStoryboard = storyboard.map((item) => ({
        ...item,
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Sample audio URL
      }))

      setStoryboard(updatedStoryboard)
      setGenerating(false)
      setActiveTab("preview")
    }, 2000)
  }

  const handleContinue = () => {
    // Save the storyboard with audio to state/context/storage
    localStorage.setItem("storyboardWithAudio", JSON.stringify(storyboard))
    router.push("/create/video")
  }

  return (
    <div className="space-y-6 pb-10">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="settings">Voice Settings</TabsTrigger>
          <TabsTrigger value="preview" disabled={!storyboard.some((item) => item.audioUrl)}>
            Audio Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Audio Generation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="voice">Select Voice Model</Label>
                <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a voice model" />
                  </SelectTrigger>
                  <SelectContent>
                    {voiceModels.map((voice) => (
                      <SelectItem key={voice.id} value={voice.id}>
                        {voice.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stability">Stability: {stability[0].toFixed(1)}</Label>
                <Slider id="stability" min={0} max={1} step={0.1} value={stability} onValueChange={setStability} />
                <p className="text-xs text-muted-foreground">
                  Higher values make the voice more consistent but may sound less natural.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clarity">Clarity & Enhancement: {clarity[0].toFixed(1)}</Label>
                <Slider id="clarity" min={0} max={1} step={0.1} value={clarity} onValueChange={setClarity} />
                <p className="text-xs text-muted-foreground">
                  Higher values enhance details in the voice but may introduce artifacts.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Storyboard Content</Label>
                <div className="space-y-4 max-h-[400px] overflow-y-auto p-2">
                  {storyboard.map((item, index) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <p className="font-medium">Scene {index + 1}</p>
                        <p className="text-sm mt-1">{item.text}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Button onClick={handleGenerateAudio} disabled={generating || !selectedVoice} className="w-full">
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Audio...
                  </>
                ) : (
                  "Generate Audio"
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Audio Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <StoryboardAudioEditor storyboard={storyboard} setStoryboard={setStoryboard} />

              <div className="flex justify-end">
                <Button onClick={handleContinue}>Continue to Video Generation</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
