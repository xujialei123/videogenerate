"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StoryboardEditor } from "@/components/storyboard-editor"

export default function ScriptPreviewPage() {
  const router = useRouter()
  const [storyboard, setStoryboard] = useState<{ id: string; text: string }[]>([
    { id: "1", text: "Enter your script for the first scene here." },
    { id: "2", text: "Enter your script for the second scene here." },
  ])

  const handleContinue = () => {
    // Save the storyboard to state/context/storage
    localStorage.setItem("storyboard", JSON.stringify(storyboard))
    router.push("/create/audio")
  }

  return (
    <div className="space-y-6 pb-10">
      <Card>
        <CardHeader>
          <CardTitle>Your Scripts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Create or edit your script by adding, removing, or rearranging scenes. Each scene will be converted to audio
            in the next step.
          </p>

          <StoryboardEditor storyboard={storyboard} setStoryboard={setStoryboard} />

          <div className="flex justify-end">
            <Button onClick={handleContinue}>Continue to Audio Generation</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
