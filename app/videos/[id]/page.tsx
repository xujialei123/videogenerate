"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Mock video data - in a real app, this would come from an API
const mockVideos = {
  "1": {
    id: "1",
    title: "Product Showcase - Summer Collection",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    createdAt: new Date(2023, 5, 15),
  },
  "2": {
    id: "2",
    title: "Travel Guide - Paris Highlights",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    createdAt: new Date(2023, 6, 22),
  },
  "3": {
    id: "3",
    title: "Cooking Tutorial - Easy Pasta Recipes",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    createdAt: new Date(2023, 7, 10),
  },
  "4": {
    id: "4",
    title: "Fitness Routine - 10 Minute Workout",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    createdAt: new Date(2023, 8, 5),
  },
  "5": {
    id: "5",
    title: "Tech Review - Latest Smartphone",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    createdAt: new Date(2023, 9, 18),
  },
}

export default function VideoDetailPage() {
  const { id } = useParams()
  const [video, setVideo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("")

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const videoData = mockVideos[id as string]
      if (videoData) {
        setVideo(videoData)
        setTitle(videoData.title)
      }
      setLoading(false)
    }, 500)
  }, [id])

  const handleSaveTitle = () => {
    // In a real app, this would call an API to update the title
    setVideo({ ...video, title })
    alert("Title updated successfully")
  }

  const handleDownload = () => {
    // In a real app, this would trigger a download of the video
    alert("Download started")
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="animate-pulse h-8 w-48 bg-muted rounded mb-6" />
        <div className="animate-pulse vertical-video-container bg-muted rounded" />
      </div>
    )
  }

  if (!video) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Video not found</h1>
        <Button asChild>
          <Link href="/videos">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Videos
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/videos">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Video Preview</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="vertical-video-container bg-black rounded-lg overflow-hidden">
            <video src={video.videoUrl} controls className="w-full h-full object-contain" />
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Video Title</Label>
                <div className="flex gap-2">
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                  <Button onClick={handleSaveTitle}>Save</Button>
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={handleDownload} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Video
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
