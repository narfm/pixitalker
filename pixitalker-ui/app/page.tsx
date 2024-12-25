'use client'

import { Classroom } from "@/components/classroom"
import { ChatPanel } from "@/components/chat-panel"
import { Controls } from "@/components/controls"
import { Whiteboard } from "@/components/whiteboard"
import { Header } from "@/components/header"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Page() {
  const [isChatOpen, setIsChatOpen] = useState(true)

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex flex-1 relative overflow-hidden">
        <div className={`relative flex-1 transition-all duration-300 ease-in-out`}>
          <Classroom />
          <Whiteboard />
        </div>
        <div className={`relative flex h-full transition-all duration-300 ease-in-out ${
          isChatOpen ? 'w-[350px]' : 'w-0'
        }`}>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 h-12 w-12 rounded-full bg-white border shadow-lg hover:bg-purple-100"
            onClick={() => setIsChatOpen(!isChatOpen)}
          >
            {isChatOpen ? (
              <ChevronRight className="h-6 w-6 text-purple-500" />
            ) : (
              <ChevronLeft className="h-6 w-6 text-purple-500" />
            )}
          </Button>
          <div className={`w-[350px] border-l transition-all duration-300 ease-in-out ${
            isChatOpen ? 'translate-x-0' : 'translate-x-[350px]'
          }`}>
            <ChatPanel />
          </div>
        </div>
      </main>
    </div>
  )
}

