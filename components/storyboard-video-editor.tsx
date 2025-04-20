"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, GripVertical, Play, Pause, ImageIcon, Upload, FolderPlus } from "lucide-react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "react-beautiful-dnd"
import Image from "next/image"

type StoryboardItem = {
  id: string
  text: string
  audioUrl?: string
  imageUrl?: string
  videoUrl?: string
}

type StoryboardVideoEditorProps = {
  storyboard: StoryboardItem[]
  setStoryboard: React.Dispatch<React.SetStateAction<StoryboardItem[]>>
  aspectRatio: string
}

// Mock image library
const mockImageLibrary = {
  default: [
    { id: "img1", url: "/mountain-valley-vista.png" },
    { id: "img2", url: "/vibrant-cityscape.png" },
    { id: "img3", url: "/thoughtful-gaze.png" },
    { id: "img4", url: "/vibrant-pasta-dish.png" },
    { id: "img5", url: "/chromatic-whirlwind.png" },
    { id: "img6", url: "/modern-tech-essentials.png" },
  ],
  travel: [
    { id: "img7", url: "/tropical-getaway.png" },
    { id: "img8", url: "/alpine-vista-hike.png" },
    { id: "img9", url: "/placeholder.svg?height=300&width=300&query=urban exploration" },
    { id: "img10", url: "/placeholder.svg?height=300&width=300&query=tropical island" },
  ],
  products: [
    { id: "img11", url: "/placeholder.svg?height=300&width=300&query=product photography" },
    { id: "img12", url: "/placeholder.svg?height=300&width=300&query=electronics gadgets" },
    { id: "img13", url: "/placeholder.svg?height=300&width=300&query=fashion accessories" },
    { id: "img14", url: "/placeholder.svg?height=300&width=300&query=cosmetics makeup" },
  ],
}

export function StoryboardVideoEditor({ storyboard, setStoryboard, aspectRatio }: StoryboardVideoEditorProps) {
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [selectedAlbum, setSelectedAlbum] = useState("default")
  const [newAlbumName, setNewAlbumName] = useState("")
  const [showNewAlbumInput, setShowNewAlbumInput] = useState(false)
  const [imageLibrary, setImageLibrary] = useState(mockImageLibrary)
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({})

  const handleAddItem = () => {
    const newItem = {
      id: `item-${Date.now()}`,
      text: "",
    }
    setStoryboard([...storyboard, newItem])
  }

  const handleDeleteItem = (id: string) => {
    setStoryboard(storyboard.filter((item) => item.id !== id))
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(storyboard)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setStoryboard(items)
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

  const handleSelectImage = (itemId: string) => {
    setSelectedItemId(itemId)
    setImageDialogOpen(true)
  }

  const handleImageSelected = (imageUrl: string) => {
    if (selectedItemId) {
      setStoryboard(storyboard.map((item) => (item.id === selectedItemId ? { ...item, imageUrl } : item)))
      setImageDialogOpen(false)
      setSelectedItemId(null)
    }
  }

  const handleUploadImage = () => {
    // In a real app, this would open a file picker
    // For now, we'll just set a different placeholder
    if (selectedItemId) {
      const randomImage = `/placeholder.svg?height=300&width=300&query=custom upload ${Date.now()}`
      setStoryboard(storyboard.map((item) => (item.id === selectedItemId ? { ...item, imageUrl: randomImage } : item)))
      setImageDialogOpen(false)
      setSelectedItemId(null)
    }
  }

  const handleCreateAlbum = () => {
    if (!newAlbumName.trim()) return

    // Create new album in the image library
    const updatedLibrary = {
      ...imageLibrary,
      [newAlbumName.toLowerCase().replace(/\s+/g, "-")]: [],
    }

    setImageLibrary(updatedLibrary)
    setSelectedAlbum(newAlbumName.toLowerCase().replace(/\s+/g, "-"))
    setNewAlbumName("")
    setShowNewAlbumInput(false)
  }

  // Handle audio ended event
  useEffect(() => {
    const handleAudioEnded = () => {
      setPlayingId(null)
    }

    Object.values(audioRefs.current).forEach((audio) => {
      if (audio) {
        audio.addEventListener("ended", handleAudioEnded)
      }
    })

    return () => {
      Object.values(audioRefs.current).forEach((audio) => {
        if (audio) {
          audio.removeEventListener("ended", handleAudioEnded)
        }
      })
    }
  }, [audioRefs.current])

  return (
    <div className="space-y-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="storyboard">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {storyboard.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} className="storyboard-item">
                      <div {...provided.dragHandleProps} className="storyboard-item-handle">
                        <GripVertical className="h-5 w-5" />
                      </div>
                      <div className="storyboard-item-delete" onClick={() => handleDeleteItem(item.id)}>
                        <Trash2 className="h-5 w-5" />
                      </div>

                      <div className="pt-6 space-y-4">
                        <div className="mb-2 font-medium">Scene {index + 1}</div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm mb-2">Scene Image</p>
                            <div className="relative aspect-square bg-muted rounded-md overflow-hidden">
                              {item.imageUrl ? (
                                <Image src={item.imageUrl || "/placeholder.svg"} alt="" fill className="object-cover" />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <ImageIcon className="h-10 w-10 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2 mt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => handleSelectImage(item.id)}
                              >
                                <ImageIcon className="mr-2 h-4 w-4" />
                                Select Image
                              </Button>
                            </div>
                          </div>

                          <div>
                            <p className="text-sm mb-2">Scene Audio</p>
                            <div className="bg-muted rounded-md p-4 h-full flex flex-col justify-between">
                              <p className="text-sm line-clamp-3">{item.text}</p>

                              {item.audioUrl && (
                                <div className="flex items-center gap-2 mt-4">
                                  <audio
                                    ref={(el) => (audioRefs.current[item.id] = el)}
                                    src={item.audioUrl}
                                    preload="metadata"
                                  />
                                  <Button variant="outline" size="icon" onClick={() => handlePlayPause(item.id)}>
                                    {playingId === item.id ? (
                                      <Pause className="h-4 w-4" />
                                    ) : (
                                      <Play className="h-4 w-4" />
                                    )}
                                  </Button>
                                  <div className="text-sm text-muted-foreground">
                                    {playingId === item.id ? "Playing..." : "Play Audio"}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Button variant="outline" onClick={handleAddItem} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Add Scene
      </Button>

      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Select Image</DialogTitle>
          </DialogHeader>

          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2 flex-wrap">
              {Object.keys(imageLibrary).map((album) => (
                <Button
                  key={album}
                  variant={selectedAlbum === album ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedAlbum(album)}
                >
                  {album.charAt(0).toUpperCase() + album.slice(1)}
                </Button>
              ))}
              <Button variant="outline" size="sm" onClick={() => setShowNewAlbumInput(!showNewAlbumInput)}>
                <FolderPlus className="h-4 w-4 mr-1" />
                New Album
              </Button>
            </div>
          </div>

          {showNewAlbumInput && (
            <div className="flex gap-2 mb-4">
              <Input placeholder="Album name" value={newAlbumName} onChange={(e) => setNewAlbumName(e.target.value)} />
              <Button onClick={handleCreateAlbum}>Create</Button>
            </div>
          )}

          <div className="image-album-grid">
            {imageLibrary[selectedAlbum]?.length > 0 ? (
              imageLibrary[selectedAlbum].map((image) => (
                <div
                  key={image.id}
                  className="relative cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => handleImageSelected(image.url)}
                >
                  <Image src={image.url || "/placeholder.svg"} alt="" width={150} height={150} className="image-item" />
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-muted-foreground col-span-full">No images in this album yet.</p>
            )}
          </div>

          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => setImageDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUploadImage}>
              <Upload className="mr-2 h-4 w-4" />
              Upload New Image
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
