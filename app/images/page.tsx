"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
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
import { Plus, Pencil, Trash2, Upload } from "lucide-react"
import Image from "next/image"

// Mock album data - in a real app, this would come from an API
const mockAlbums = [
  {
    id: "default",
    name: "Default",
    images: [
      { id: "1", url: "/mountain-valley-vista.png" },
      { id: "2", url: "/vibrant-cityscape.png" },
      { id: "3", url: "/thoughtful-gaze.png" },
      { id: "4", url: "/vibrant-pasta-dish.png" },
      { id: "5", url: "/chromatic-whirlwind.png" },
      { id: "6", url: "/modern-tech-essentials.png" },
    ],
  },
  {
    id: "travel",
    name: "Travel",
    images: [
      { id: "7", url: "/tropical-getaway.png" },
      { id: "8", url: "/alpine-vista-hike.png" },
      { id: "9", url: "/placeholder.svg?height=300&width=300&query=urban exploration" },
      { id: "10", url: "/placeholder.svg?height=300&width=300&query=tropical island" },
    ],
  },
  {
    id: "products",
    name: "Products",
    images: [
      { id: "11", url: "/placeholder.svg?height=300&width=300&query=product photography" },
      { id: "12", url: "/placeholder.svg?height=300&width=300&query=electronics gadgets" },
      { id: "13", url: "/placeholder.svg?height=300&width=300&query=fashion accessories" },
      { id: "14", url: "/placeholder.svg?height=300&width=300&query=cosmetics makeup" },
    ],
  },
]

type Album = {
  id: string
  name: string
  images: { id: string; url: string }[]
}

export default function ImagesPage() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)
  const [newAlbumName, setNewAlbumName] = useState("")
  const [editAlbumName, setEditAlbumName] = useState("")
  const [editAlbumId, setEditAlbumId] = useState("")

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAlbums(mockAlbums)
      setLoading(false)
    }, 500)
  }, [])

  const handleCreateAlbum = () => {
    if (!newAlbumName.trim()) return

    const newAlbum: Album = {
      id: `album-${Date.now()}`,
      name: newAlbumName,
      images: [],
    }

    setAlbums([...albums, newAlbum])
    setNewAlbumName("")
  }

  const handleUpdateAlbum = () => {
    if (!editAlbumName.trim() || !editAlbumId) return

    setAlbums(albums.map((album) => (album.id === editAlbumId ? { ...album, name: editAlbumName } : album)))

    setEditAlbumName("")
    setEditAlbumId("")
  }

  const handleDeleteAlbum = (albumId: string) => {
    if (albumId === "default") {
      alert("Cannot delete the default album")
      return
    }

    setAlbums(albums.filter((album) => album.id !== albumId))
  }

  const handleDeleteImage = (albumId: string, imageId: string) => {
    setAlbums(
      albums.map((album) => {
        if (album.id === albumId) {
          return {
            ...album,
            images: album.images.filter((image) => image.id !== imageId),
          }
        }
        return album
      }),
    )
  }

  const handleUploadImage = (albumId: string) => {
    // In a real app, this would open a file picker and upload the image
    const newImage = {
      id: `img-${Date.now()}`,
      url: `/placeholder.svg?height=300&width=300&query=new upload ${Date.now()}`,
    }

    setAlbums(
      albums.map((album) => {
        if (album.id === albumId) {
          return {
            ...album,
            images: [...album.images, newImage],
          }
        }
        return album
      }),
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="animate-pulse h-8 w-48 bg-muted rounded mb-6" />
        <div className="animate-pulse h-10 w-full bg-muted rounded mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse aspect-square bg-muted rounded" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Image Library</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Album
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Album</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Input
                  placeholder="Album name"
                  value={newAlbumName}
                  onChange={(e) => setNewAlbumName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleCreateAlbum}>Create Album</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-8">
        {albums.map((album) => (
          <Card key={album.id} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {album.name}
                {album.id !== "default" && (
                  <div className="flex gap-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Album</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Input
                              placeholder="Album name"
                              defaultValue={album.name}
                              onChange={(e) => {
                                setEditAlbumName(e.target.value)
                                setEditAlbumId(album.id)
                              }}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button onClick={handleUpdateAlbum}>Save Changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the album and all images in it.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteAlbum(album.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </CardTitle>
              <Button onClick={() => handleUploadImage(album.id)} size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Upload Images
              </Button>
            </CardHeader>
            <CardContent>
              {album.images.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No images in this album yet.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {album.images.map((image) => (
                    <div key={image.id} className="relative group">
                      <Image
                        src={image.url || "/placeholder.svg"}
                        alt=""
                        width={150}
                        height={150}
                        className="image-item"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this image.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteImage(album.id, image.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
