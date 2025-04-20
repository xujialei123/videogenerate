"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, GripVertical, Play, Pause, RotateCcw } from "lucide-react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "react-beautiful-dnd"

type StoryboardItem = {
  id: string
  text: string
  audioUrl?: string
}

type StoryboardAudioEditorProps = {
  storyboard: StoryboardItem[]
  setStoryboard: React.Dispatch<React.SetStateAction<StoryboardItem[]>>
}

export function StoryboardAudioEditor({ storyboard, setStoryboard }: StoryboardAudioEditorProps) {
  const [playingId, setPlayingId] = useState<string | null>(null)
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

  const handleTextChange = (id: string, text: string) => {
    setStoryboard(storyboard.map((item) => (item.id === id ? { ...item, text } : item)))
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

  const handleRegenerate = (id: string) => {
    // In a real app, this would call the API to regenerate the audio
    alert(`Regenerating audio for scene ${id}`)
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
                        {/* Read-only text display instead of editable textarea */}
                        <div className="p-3 bg-muted rounded-md text-sm min-h-[80px]">{item.text}</div>

                        {item.audioUrl && (
                          <div className="flex items-center gap-2">
                            <audio
                              ref={(el) => (audioRefs.current[item.id] = el)}
                              src={item.audioUrl}
                              preload="metadata"
                            />
                            <Button variant="outline" size="icon" onClick={() => handlePlayPause(item.id)}>
                              {playingId === item.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleRegenerate(item.id)}>
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                            <div className="text-sm text-muted-foreground">
                              {playingId === item.id ? "Playing..." : "Click to play"}
                            </div>
                          </div>
                        )}
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
    </div>
  )
}
