'use client'

import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { MessageSquare, User } from 'lucide-react'

interface Message {
  role: 'user' | 'teacher'
  content: string
  timestamp: string
}

export function ChatPanel() {
  const messages: Message[] = [
    {
      role: 'teacher',
      content: 'Welcome to our interactive classroom! What would you like to learn today?',
      timestamp: '10:00 AM'
    },
    {
      role: 'user',
      content: 'I want to learn about addition!',
      timestamp: '10:01 AM'
    },
    {
      role: 'teacher',
      content: "That's great! Let's start with some simple addition problems.",
      timestamp: '10:01 AM'
    }
  ]

  return (
    <div className="flex h-[calc(100vh-200px)] flex-col">
      <div className="flex items-center gap-2 border-b px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50">
        <MessageSquare className="h-5 w-5 text-blue-500" />
        <h2 className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">Chat</h2>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex gap-3 text-sm",
                message.role === 'user' && "justify-end"
              )}
            >
              {message.role === 'teacher' && (
                <div className="rounded-full bg-orange-100 p-2">
                  <MessageSquare className="h-4 w-4 text-orange-500" />
                </div>
              )}
              <div className={cn(
                "rounded-lg px-3 py-2 max-w-[80%]",
                message.role === 'teacher' 
                  ? "bg-gradient-to-r from-blue-100 to-purple-100 text-gray-800" 
                  : "bg-gradient-to-r from-green-400 to-emerald-400 text-white"
              )}>
                <p>{message.content}</p>
                <span className="text-xs opacity-70">{message.timestamp}</span>
              </div>
              {message.role === 'user' && (
                <div className="rounded-full bg-emerald-100 p-2">
                  <User className="h-4 w-4 text-emerald-500" />
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

