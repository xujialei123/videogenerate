"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Play, Pause } from "lucide-react"

export default function AudioUploadPage() {
  const router = useRouter()
  const [storyboard, setStoryboard] = useState<{ id: string; text: string; audioUrl?: string }[]>([
    { id: "1", text: "Enter transcript for the first audio clip here." },
  ])
  const [playingId, setPlayingId] = useState<string | null>(null)
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({})

  const handleAddScene = () => {
    setStoryboard([...storyboard, { id: `item-${Date.now()}`, text: "Enter transcript for this audio clip here." }])
  }

  const handleRemoveScene = (id: string) => {
    setStoryboard(storyboard.filter((item) => item.id !== id))
  }

  const handleTextChange = (id: string, text: string) => {
    setStoryboard(storyboard.map((item) => (item.id === id ? { ...item, text } : item)))
  }

  const handleFileUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create a temporary URL for the uploaded file
    const audioUrl = URL.createObjectURL(file)
    setStoryboard(storyboard.map((item) => (item.id === id ? { ...item, audioUrl } : item)))
  }

  const handlePlayPause = (id: string) => {
    const audio = audioRefs.current[id]
    if (!audio) return

    if (playingId === id) {
      audio.pause()
      setPlayingId(null)
    } else {
      // Pause any currently playing audio
      if (playingId && audioRefs.current[playingId]) {
        audioRefs.current[playingId]?.pause()
      }

      audio.play()
      setPlayingId(id)
    }
  }

  const handleContinue = () => {
    // Check if all scenes have audio
    if (!storyboard.every((item) => item.audioUrl)) {
      alert("Please upload audio for all scenes")
      return
    }

    // Save the storyboard with audio to state/context/storage
    localStorage.setItem("storyboardWithAudio", JSON.stringify(storyboard))
    router.push("/create/video")
  }

  return (
    <div className="space-y-6 pb-10">
      <Card>
        <CardHeader>
          <CardTitle>Upload Audio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Upload audio files for each scene. You can add multiple scenes and provide a transcript for each audio clip.
          </p>

          <div className="space-y-4">
            {storyboard.map((item, index) => (
              <Card key={item.id} className="relative">
                <CardContent className="p-4 space-y-4">
                  <div className="absolute top-2 right-2">
                    {storyboard.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleRemoveScene(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="pt-4">
                    <Label className="mb-2 block">Scene {index + 1}</Label>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`audio-${item.id}`} className="mb-2 block">
                          Audio File
                        </Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id={`audio-${item.id}`}
                            type="file"
                            accept="audio/*"
                            onChange={(e) => handleFileUpload(item.id, e)}
                            className="flex-1"
                          />
                          {item.audioUrl && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handlePlayPause(item.id)}
                              className="flex-shrink-0"
                            >
                              {playingId === item.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                              <audio
                                ref={(el) => (audioRefs.current[item.id] = el)}
                                src={item.audioUrl}
                                preload="metadata"
                              />
                            </Button>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor={`transcript-${item.id}`} className="mb-2 block">
                          Transcript
                        </Label>
                        <Textarea
                          id={`transcript-${item.id}`}
                          value={item.text}
                          onChange={(e) => handleTextChange(item.id, e.target.value)}
                          rows={3}
                          placeholder="Enter transcript for this audio clip..."
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button variant="outline" onClick={handleAddScene} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Scene
          </Button>

          <div className="flex justify-end">
            <Button onClick={handleContinue}>Continue to Video Generation</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
