"use client"

import { useState } from "react"
import { VideoList } from "@/components/video-list"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Trash2 } from "lucide-react"
import Link from "next/link"
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

export default function VideosPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVideos, setSelectedVideos] = useState<string[]>([])
  const [isSelectionMode, setIsSelectionMode] = useState(false)

  const handleToggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode)
    setSelectedVideos([])
  }

  const handleDeleteSelected = () => {
    // In a real app, this would call an API to delete the videos
    console.log("Deleting videos:", selectedVideos)
    setSelectedVideos([])
    setIsSelectionMode(false)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Videos</h1>
        <div className="flex gap-2">
          {isSelectionMode ? (
            <>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={selectedVideos.length === 0}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Selected ({selectedVideos.length})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the selected videos.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteSelected}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button variant="outline" onClick={handleToggleSelectionMode}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleToggleSelectionMode} variant="outline">
                Select Videos
              </Button>
              <Button asChild>
                <Link href="/create/script">Create New Video</Link>
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="text"
          placeholder="Search videos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button type="submit" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <VideoList
        selectionMode={isSelectionMode}
        selectedVideos={selectedVideos}
        setSelectedVideos={setSelectedVideos}
      />
    </div>
  )
}
