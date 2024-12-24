'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mic, Send, Lightbulb } from 'lucide-react'
import { useState } from "react"

export function Controls() {
  const [message, setMessage] = useState("")

  return (
    <div className="border-t p-4">
      <div className="flex gap-2 mb-4">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full bg-gradient-to-r from-pink-50 to-red-50 hover:from-pink-100 hover:to-red-100"
        >
          <Mic className="h-4 w-4 text-pink-500" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full bg-gradient-to-r from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100"
        >
          <Lightbulb className="h-4 w-4 text-yellow-500" />
        </Button>
      </div>
      <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="rounded-full border-blue-200 focus-visible:ring-blue-400"
        />
        <Button 
          type="submit" 
          size="icon" 
          className="rounded-full bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}

