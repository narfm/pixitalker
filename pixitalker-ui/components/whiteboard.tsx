'use client'

import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { Maximize2, Minimize2, Pause, Play } from 'lucide-react'
import { Button } from "./ui/button"
import { MathExample } from "./MathExample"
import { MathProblem } from "./MathProblem"
import { MathContent } from "./types/math"
import { parseXML } from "@/lib/xml-parser"


export function Whiteboard() {
  const [isVisible] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentContent, setCurrentContent] = useState<MathContent>()

  const handleComplete = () => {
    // Toggle between example and problem
    // setCurrentContent(currentContent.type === 'example' ? parseXML(problemXML) : parseXML(exampleXML))
    // setIsPlaying(true)
  }

    // Listen for messages from chat component
    useEffect(() => {
      const handleMessage = (event: MessageEvent) => {
        if (event.data && (event.data?.type === 'example' || event.data?.type === 'problem')) {
          // setCurrentExample(event.data.content)
          setCurrentContent(parseXML(event.data.content))

        }
      }
  
      window.addEventListener('message', handleMessage)
      return () => window.removeEventListener('message', handleMessage)
    }, [])

  if (!isVisible || !currentContent) return null

  return (
    <Card className={`absolute right-12 top-1/2 -translate-y-1/2 p-6 shadow-2xl bg-gradient-to-br from-white to-blue-50 border-4 border-blue-300 rounded-xl transition-all duration-300 ${
      isExpanded ? 'w-[800px] h-[600px]' : 'w-[500px] h-[400px]'
    }`}>
      <div className="text-center mb-6 relative">
        <div className="absolute right-0 top-0 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-purple-100"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 text-purple-500" />
            ) : (
              <Play className="h-5 w-5 text-purple-500" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-purple-100"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <Minimize2 className="h-5 w-5 text-purple-500" />
            ) : (
              <Maximize2 className="h-5 w-5 text-purple-500" />
            )}
          </Button>
        </div>
        <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-pink-500">
          {currentContent.type === 'example' ? 'Learning Together' : 'Practice Time'}
        </h3>
      </div>
      <div className="flex flex-col items-center justify-center h-[calc(100%-8rem)] bg-white rounded-xl border-4 border-dashed border-purple-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 to-pink-100 opacity-50" />
        <div className="relative z-10 p-6 flex flex-col items-center justify-center w-full h-full">
          {currentContent.type === 'example' ? (
            <MathExample
              content={currentContent}
              isPlaying={isPlaying}
              onComplete={handleComplete}
            />
          ) : (
            <MathProblem
              content={currentContent}
              isPlaying={isPlaying}
              onComplete={handleComplete}
            />
          )}
        </div>
      </div>
    </Card>
  )
}

