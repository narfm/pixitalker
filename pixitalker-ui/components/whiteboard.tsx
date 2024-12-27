'use client'

import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { Maximize2, Minimize2 } from 'lucide-react'
import { Button } from "./ui/button"
import { MathExample } from "./MathExample"

export function Whiteboard() {
  const [isVisible] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentExample, setCurrentExample] = useState<string | null>(null)

  // Listen for messages from chat component
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'example') {
        setCurrentExample(event.data.content)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  if (!isVisible) return null

  return (
    <Card className={`absolute right-12 top-1/2 -translate-y-1/2 p-6 shadow-2xl bg-gradient-to-br from-white to-blue-50 border-4 border-blue-300 rounded-xl transition-all duration-300 ${
      isExpanded ? 'w-[800px] h-[600px]' : 'w-[500px] h-[400px]'
    }`}>
      <div className="text-center mb-6 relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 hover:bg-purple-100"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <Minimize2 className="h-5 w-5 text-purple-500" />
          ) : (
            <Maximize2 className="h-5 w-5 text-purple-500" />
          )}
        </Button>
        <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-pink-500">
          Let's Learn Addition!
        </h3>
      </div>
      <div className="flex items-center justify-center h-[calc(100%-5rem)] bg-white rounded-xl border-4 border-dashed border-purple-300 relative overflow-hidden">
        {currentExample && (
          <MathExample 
            example={currentExample} 
            width={isExpanded ? 750 : 450} 
            height={isExpanded ? 500 : 300} 
          />
        )}
      </div>
    </Card>
  )
}

