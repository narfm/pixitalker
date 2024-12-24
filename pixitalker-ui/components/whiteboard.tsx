'use client'

import { Card } from "@/components/ui/card"
import { useState } from "react"
import { Maximize2, Minimize2 } from 'lucide-react'
import { Button } from "./ui/button"

export function Whiteboard() {
  const [isVisible] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)

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
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 to-pink-100 opacity-50" />
        <div className="relative z-10 space-y-6 text-center">
          <div className={`font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ${
            isExpanded ? 'text-7xl' : 'text-5xl'
          }`}>
            2 + 2 = ?
          </div>
          <div className="flex justify-center gap-4">
            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className={`flex items-center justify-center font-bold bg-white rounded-xl shadow-lg border-4 border-purple-200 cursor-pointer hover:scale-110 transition-transform duration-200 text-purple-500 ${
                  isExpanded ? 'w-24 h-24 text-4xl' : 'w-16 h-16 text-2xl'
                }`}
              >
                {num}
              </div>
            ))}
          </div>
          <p className={`font-medium text-purple-500 transition-all duration-300 ${
            isExpanded ? 'text-2xl' : 'text-lg'
          }`}>
            Click the correct answer!
          </p>
        </div>
      </div>
    </Card>
  )
}

