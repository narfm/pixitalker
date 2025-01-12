'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { MessageSquare, User } from 'lucide-react'
import { Controls } from './controls'
import { eventEmitter } from '@/lib/event-emitter'

interface Message {
  role: 'user' | 'teacher'
  content: string | any
  timestamp: string
}

export function ChatPanel() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'teacher',
      content: 'Welcome to our interactive classroom! What would you like to learn today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])

  const handleNewMessage = useCallback((message: { role: 'user' | 'teacher'; content: string | any }) => {
    // If content is a JSON response, handle it accordingly
    if (typeof message.content === 'object') {
      // Handle chat message if present
      if (message.content.chat?.message) {
        setMessages(prev => {
          const newMessages = [...prev, {
            role: 'teacher' as const,
            content: message.content.chat.message,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]
          setTimeout(scrollToBottom, 100)
          return newMessages
        })
      }

      // Handle whiteboard content if present
      if (message.content.whiteboard) {
        eventEmitter.emit('mathContent', {
          content: message.content.whiteboard
        })
      }

      // Handle achievements if present
      if (message.content.achievements) {
        eventEmitter.emit('achievements', message.content.achievements)
      }
    } else {
      // Handle regular text messages (e.g., user input)
      setMessages(prev => {
        const newMessages = [...prev, {
          ...message,
          content: message.content,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]
        setTimeout(scrollToBottom, 100)
        return newMessages
      })
    }
  }, [])

  return (
    <div className="flex h-[calc(100vh-80px)] flex-col">
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
                <p className="whitespace-pre-wrap">{message.content}</p>
                <span className="text-xs opacity-70">{message.timestamp}</span>
              </div>
              {message.role === 'user' && (
                <div className="rounded-full bg-emerald-100 p-2">
                  <User className="h-4 w-4 text-emerald-500" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      <Controls 
        onNewMessage={handleNewMessage} 
        ref={inputRef}
      />
    </div>
  )
}

