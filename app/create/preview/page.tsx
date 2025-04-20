"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

type FinalVideo = {
  title: string
  url: string
  coverImage: string
  createdAt: string
}

export default function VideoPreviewPage() {
  const router = useRouter()
  const [video, setVideo] = useState<FinalVideo | null>(null)
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // Load final video data
    const savedVideo = localStorage.getItem("finalVideo")
    if (savedVideo) {
      const parsedVideo = JSON.parse(savedVideo)
      setVideo(parsedVideo)
      setTitle(parsedVideo.title)
    }
    setLoading(false)
  }, [])

  const handleSaveTitle = () => {
    if (video) {
      const updatedVideo = { ...video, title }
      setVideo(updatedVideo)
      localStorage.setItem("finalVideo", JSON.stringify(updatedVideo))
      setSaved(true)

      // Reset saved indicator after 2 seconds
      setTimeout(() => {
        setSaved(false)
      }, 2000)
    }
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
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="vertical-video-container bg-black rounded-lg overflow-hidden">
            <video src={video.url} controls className="w-full h-full object-contain" />
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Video Title</Label>
                <div className="flex gap-2">
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                  <Button onClick={handleSaveTitle} className="relative">
                    {saved ? <CheckCircle className="h-4 w-4" /> : "Save"}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cover Image</Label>
                <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
                  <Image src={video.coverImage || "/placeholder.svg"} alt="Video cover" fill className="object-cover" />
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <Button onClick={handleDownload} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Video
                </Button>

                <Button asChild variant="outline" className="w-full">
                  <Link href="/videos">View All Videos</Link>
                </Button>

                <Button asChild variant="outline" className="w-full">
                  <Link href="/dashboard">Back to Dashboard</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
