"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, Music, Video, Check } from "lucide-react"

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(1)
  const [entryPoint, setEntryPoint] = useState<"blank" | "script" | "audio">("blank")

  useEffect(() => {
    // Determine entry point
    if (pathname.includes("/script/preview") && !pathname.includes("/create/script/preview")) {
      setEntryPoint("blank")
    } else if (pathname.includes("/script/preview")) {
      setEntryPoint("script")
    } else if (pathname.includes("/audio/upload")) {
      setEntryPoint("audio")
    } else {
      setEntryPoint("blank")
    }

    // Set active step based on pathname
    if (pathname.includes("/script") && !pathname.includes("/preview")) {
      setActiveStep(1)
    } else if (pathname.includes("/script/preview")) {
      setActiveStep(1)
    } else if (pathname.includes("/audio")) {
      setActiveStep(2)
    } else if (pathname.includes("/video")) {
      setActiveStep(3)
    } else if (pathname.includes("/preview")) {
      setActiveStep(4)
    }
  }, [pathname])

  const handleBackClick = () => {
    // If starting from script or audio, don't allow going back to dashboard
    if ((entryPoint === "script" && activeStep === 1) || (entryPoint === "audio" && activeStep === 2)) {
      // Stay on current page
      return
    }

    // Otherwise go back to dashboard
    router.push("/dashboard")
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={handleBackClick}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Create New Video</h1>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center w-full max-w-3xl mx-auto">
          <div className={`flex flex-col items-center ${activeStep >= 1 ? "text-primary" : "text-muted-foreground"}`}>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${activeStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            >
              {activeStep > 1 ? <Check className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
            </div>
            <span className="text-sm mt-1">Script</span>
          </div>

          <div className={`flex-1 h-1 mx-2 ${activeStep >= 2 ? "bg-primary" : "bg-muted"}`} />

          <div className={`flex flex-col items-center ${activeStep >= 2 ? "text-primary" : "text-muted-foreground"}`}>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${activeStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            >
              {activeStep > 2 ? <Check className="h-5 w-5" /> : <Music className="h-5 w-5" />}
            </div>
            <span className="text-sm mt-1">Audio</span>
          </div>

          <div className={`flex-1 h-1 mx-2 ${activeStep >= 3 ? "bg-primary" : "bg-muted"}`} />

          <div className={`flex flex-col items-center ${activeStep >= 3 ? "text-primary" : "text-muted-foreground"}`}>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${activeStep >= 3 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            >
              {activeStep > 3 ? <Check className="h-5 w-5" /> : <Video className="h-5 w-5" />}
            </div>
            <span className="text-sm mt-1">Video</span>
          </div>

          <div className={`flex-1 h-1 mx-2 ${activeStep >= 4 ? "bg-primary" : "bg-muted"}`} />

          <div className={`flex flex-col items-center ${activeStep >= 4 ? "text-primary" : "text-muted-foreground"}`}>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${activeStep >= 4 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            >
              <Check className="h-5 w-5" />
            </div>
            <span className="text-sm mt-1">Preview</span>
          </div>
        </div>
      </div>

      {children}
    </div>
  )
}
