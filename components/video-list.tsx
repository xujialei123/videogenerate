"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2 } from "lucide-react"
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
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

// Mock video data - in a real app, this would come from an API
const mockVideos = [
  {
    id: "1",
    title: "Product Showcase - Summer Collection",
    thumbnail: "/urban-chic-display.png",
    createdAt: new Date(2023, 5, 15),
  },
  {
    id: "2",
    title: "Travel Guide - Paris Highlights",
    thumbnail: "/eiffel-tower-cityscape.png",
    createdAt: new Date(2023, 6, 22),
  },
  {
    id: "3",
    title: "Cooking Tutorial - Easy Pasta Recipes",
    thumbnail: "/boiling-pasta.png",
    createdAt: new Date(2023, 7, 10),
  },
  {
    id: "4",
    title: "Fitness Routine - 10 Minute Workout",
    thumbnail: "/diverse-group-workout.png",
    createdAt: new Date(2023, 8, 5),
  },
  {
    id: "5",
    title: "Tech Review - Latest Smartphone",
    thumbnail: "/tech-review-close-up.png",
    createdAt: new Date(2023, 9, 18),
  },
]

type Video = {
  id: string
  title: string
  thumbnail: string
  createdAt: Date
}

type VideoListProps = {
  limit?: number
  selectionMode?: boolean
  selectedVideos?: string[]
  setSelectedVideos?: React.Dispatch<React.SetStateAction<string[]>>
}

export function VideoList({
  limit,
  selectionMode = false,
  selectedVideos = [],
  setSelectedVideos = () => {},
}: VideoListProps) {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setVideos(limit ? mockVideos.slice(0, limit) : mockVideos)
      setLoading(false)
    }, 500)
  }, [limit])

  const handleToggleSelect = (id: string) => {
    if (selectedVideos.includes(id)) {
      setSelectedVideos(selectedVideos.filter((videoId) => videoId !== id))
    } else {
      setSelectedVideos([...selectedVideos, id])
    }
  }

  const handleDeleteVideo = (id: string) => {
    // In a real app, this would call an API to delete the video
    setVideos(videos.filter((video) => video.id !== id))
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: limit || 5 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-square bg-muted animate-pulse" />
            <CardContent className="p-4">
              <div className="h-5 bg-muted animate-pulse rounded w-3/4 mb-2" />
              <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (videos.length === 0) {
    return <p>No videos found.</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {videos.map((video) => (
        <Card key={video.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer relative">
          {selectionMode ? (
            <div className="absolute top-2 left-2 z-10">
              <Checkbox
                checked={selectedVideos.includes(video.id)}
                onCheckedChange={() => handleToggleSelect(video.id)}
              />
            </div>
          ) : (
            <div className="absolute top-2 right-2 z-10">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the video.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteVideo(video.id)}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}

          <Link
            href={selectionMode ? "#" : `/videos/${video.id}`}
            onClick={selectionMode ? () => handleToggleSelect(video.id) : undefined}
          >
            <div className="aspect-square relative group">
              <Image src={video.thumbnail || "/placeholder.svg"} alt={video.title} fill className="object-cover" />
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium line-clamp-1">{video.title}</h3>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(video.createdAt, { addSuffix: true })}
              </p>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  )
}
