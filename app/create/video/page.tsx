"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Loader2, Upload } from "lucide-react"
import { StoryboardVideoEditor } from "@/components/storyboard-video-editor"
import Image from "next/image"

type StoryboardItem = {
  id: string
  text: string
  audioUrl?: string
  imageUrl?: string
  videoUrl?: string
}

export default function VideoGenerationPage() {
  const router = useRouter()
  const [storyboard, setStoryboard] = useState<StoryboardItem[]>([])
  const [aspectRatio, setAspectRatio] = useState("9:16")
  const [coverImage, setCoverImage] = useState("")
  const [generating, setGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState("settings")
  const [finalVideoUrl, setFinalVideoUrl] = useState("")

  useEffect(() => {
    // Load storyboard from previous step
    const savedStoryboard = localStorage.getItem("storyboardWithAudio")
    if (savedStoryboard) {
      setStoryboard(JSON.parse(savedStoryboard))
    } else {
      // Mock data if nothing is saved
      setStoryboard([
        {
          id: "1",
          text: "Introduction to the topic with key highlights.",
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        },
        {
          id: "2",
          text: "Detailed explanation of the first main point with supporting evidence.",
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        },
        {
          id: "3",
          text: "Exploration of the second main point with real-world examples.",
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        },
        {
          id: "4",
          text: "Discussion of implications and future considerations.",
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        },
        {
          id: "5",
          text: "Conclusion summarizing the key takeaways.",
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        },
      ])
    }
  }, [])

  const handleGenerateVideos = () => {
    // Cover image is now optional
    if (!storyboard.every((item) => item.imageUrl)) {
      alert("Please select images for all scenes")
      return
    }

    setGenerating(true)

    // Simulate AI video generation
    setTimeout(() => {
      // Mock generated video URLs
      const updatedStoryboard = storyboard.map((item) => ({
        ...item,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", // Sample video URL
      }))

      setStoryboard(updatedStoryboard)
      setGenerating(false)
      setActiveTab("preview")
    }, 3000)
  }

  const handleFinalizeVideo = () => {
    setGenerating(true)

    // Simulate final video generation
    setTimeout(() => {
      setFinalVideoUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4")
      setGenerating(false)

      // Save the final video data
      localStorage.setItem(
        "finalVideo",
        JSON.stringify({
          title: "Generated Video - " + new Date().toLocaleDateString(),
          url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          coverImage: coverImage || "/abstract-geometric-shapes.png", // Default cover if none provided
          createdAt: new Date().toISOString(),
        }),
      )

      router.push("/create/preview")
    }, 3000)
  }

  const handleUploadCover = () => {
    // In a real app, this would open a file picker
    // For now, we'll just set a different placeholder
    setCoverImage("/abstract-geometric-cover.png")
    alert("Cover image uploaded")
  }

  return (
    <div className="space-y-6 pb-10">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="settings">Video Settings</TabsTrigger>
          <TabsTrigger value="preview" disabled={!storyboard.some((item) => item.videoUrl)}>
            Video Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Video Generation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Video Aspect Ratio</Label>
                <RadioGroup value={aspectRatio} onValueChange={setAspectRatio} className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="16:9" id="ratio-16-9" />
                    <Label htmlFor="ratio-16-9">16:9 (Landscape)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="9:16" id="ratio-9-16" />
                    <Label htmlFor="ratio-9-16">9:16 (Vertical)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1:1" id="ratio-1-1" />
                    <Label htmlFor="ratio-1-1">1:1 (Square)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Cover Image (Optional)</Label>
                <div className="flex items-center gap-4">
                  <div className="relative w-32 h-32 overflow-hidden rounded-md border">
                    {coverImage ? (
                      <Image src={coverImage || "/placeholder.svg"} alt="Cover" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-sm">
                        No cover
                      </div>
                    )}
                  </div>
                  <Button onClick={handleUploadCover} variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Cover
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Storyboard Configuration</Label>
                <StoryboardVideoEditor
                  storyboard={storyboard}
                  setStoryboard={setStoryboard}
                  aspectRatio={aspectRatio}
                />
              </div>

              <Button
                onClick={handleGenerateVideos}
                disabled={generating || !storyboard.every((item) => item.imageUrl)}
                className="w-full"
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Videos...
                  </>
                ) : (
                  "Generate Videos"
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Video Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {storyboard.map((item, index) => (
                  <Card key={item.id}>
                    <CardContent className="p-4 space-y-2">
                      <p className="font-medium">Scene {index + 1}</p>
                      <div
                        className={`
                        ${
                          aspectRatio === "9:16"
                            ? "vertical-video-container"
                            : aspectRatio === "1:1"
                              ? "square-video-container"
                              : "horizontal-video-container"
                        } 
                        bg-black rounded-md overflow-hidden
                      `}
                      >
                        {item.videoUrl && (
                          <video src={item.videoUrl} controls className="w-full h-full object-contain" />
                        )}
                      </div>
                      <p className="text-sm mt-1 line-clamp-2">{item.text}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Remove the videoUrl to force regeneration
                          const updatedStoryboard = [...storyboard]
                          updatedStoryboard[index] = { ...updatedStoryboard[index], videoUrl: undefined }
                          setStoryboard(updatedStoryboard)

                          // Simulate regeneration
                          setTimeout(() => {
                            const regeneratedStoryboard = [...storyboard]
                            regeneratedStoryboard[index] = {
                              ...regeneratedStoryboard[index],
                              videoUrl:
                                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
                            }
                            setStoryboard(regeneratedStoryboard)
                          }, 1500)
                        }}
                        className="w-full mt-2"
                      >
                        Regenerate Video
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-end">
                <Button onClick={handleFinalizeVideo} disabled={generating}>
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Finalizing...
                    </>
                  ) : (
                    "Finalize Video"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
