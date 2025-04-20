"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, GripVertical } from "lucide-react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "react-beautiful-dnd"

type StoryboardItem = {
  id: string
  text: string
}

type StoryboardEditorProps = {
  storyboard: StoryboardItem[]
  setStoryboard: React.Dispatch<React.SetStateAction<StoryboardItem[]>>
}

export function StoryboardEditor({ storyboard, setStoryboard }: StoryboardEditorProps) {
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
                      <div className="pt-6">
                        <div className="mb-2 font-medium">Scene {index + 1}</div>
                        <Textarea
                          value={item.text}
                          onChange={(e) => handleTextChange(item.id, e.target.value)}
                          rows={3}
                          placeholder="Enter scene description..."
                        />
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
