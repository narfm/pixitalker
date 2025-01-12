'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mic, Send, Lightbulb } from 'lucide-react'
import { useState, useCallback, useRef, useEffect, forwardRef, ForwardedRef } from "react"

interface ControlsProps {
  onNewMessage: (message: { role: 'user' | 'teacher'; content: string }) => void;
}

export const Controls = forwardRef<HTMLInputElement, ControlsProps>(
  ({ onNewMessage }, forwardedRef: ForwardedRef<HTMLInputElement>) => {
    const [message, setMessage] = useState("")
    const [isListening, setIsListening] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const audioRef = useRef<HTMLAudioElement>(null);
    const sessionIdRef = useRef<string>(
      typeof window !== 'undefined' 
        ? localStorage.getItem('chatSessionId') || crypto.randomUUID()
        : ''
    );

    // Store sessionId in localStorage on mount
    useEffect(() => {
      if (sessionIdRef.current) {
        localStorage.setItem('chatSessionId', sessionIdRef.current);
      }
    }, []);

    const handleComplete = useCallback(async () => {
      try {
        setIsProcessing(false)
        // Use setTimeout to ensure focus happens after state updates
        setTimeout(() => {
          if (typeof forwardedRef === 'object' && forwardedRef?.current) {
            forwardedRef.current.focus()
          }
        }, 100)
      } catch (error) {
        console.error('Error:', error)
      }
    }, [forwardedRef])

    const processMessage = useCallback(async (content: string) => {
      if (!content.trim()) return;

      try {
        setIsProcessing(true)
        
        // Add user message
        onNewMessage?.({ role: 'user', content })

        // Call server-side API with sessionId
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            content,
            sessionId: sessionIdRef.current
          })
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error);

        // Add AI response with structured content
        onNewMessage?.({ 
          role: 'teacher', 
          content: data.message // This will be the JSON object
        })
        
        setMessage("")
        await handleComplete()
      } catch (error) {
        console.error('Error processing message:', error)
      } finally {
        setIsProcessing(false)
      }
    }, [onNewMessage, handleComplete])

    const startListening = useCallback(async () => {
      try {
        setIsListening(true)
        const recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = 'en-US'

        recognition.onresult = (event: { results: { transcript: any }[][] }) => {
          const transcript = event.results[0][0].transcript
          setMessage(transcript)
          setIsListening(false)
        }

        recognition.onerror = (event: { error: any }) => {
          console.error('Speech recognition error:', event.error)
          setIsListening(false)
        }

        recognition.start()
      } catch (error) {
        console.error('Speech recognition error:', error)
        setIsListening(false)
      }
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      processMessage(message)
    }

    return (
      <div className="border-t p-4">
        <audio ref={audioRef} className="hidden" />
        <div className="flex gap-2 mb-4">
          <Button 
            variant="outline" 
            size="icon" 
            className={`rounded-full ${
              isListening 
                ? 'bg-red-100 hover:bg-red-200' 
                : 'bg-gradient-to-r from-pink-50 to-red-50 hover:from-pink-100 hover:to-red-100'
            }`}
            onClick={startListening}
            disabled={isProcessing}
          >
            <Mic className={`h-4 w-4 ${isListening ? 'text-red-500' : 'text-pink-500'}`} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full bg-gradient-to-r from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100"
          >
            <Lightbulb className="h-4 w-4 text-yellow-500" />
          </Button>
        </div>
        <form className="flex gap-2" onSubmit={handleSubmit}>
          <Input
            ref={forwardedRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="rounded-full border-blue-200 focus-visible:ring-blue-400"
            disabled={isProcessing}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="rounded-full bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500"
            disabled={!message.trim() || isProcessing}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    )
  }
)

Controls.displayName = 'Controls'

