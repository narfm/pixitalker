'use client'

import { useState, useCallback } from 'react'
import { Mic, MicOff, Loader2 } from 'lucide-react'
import { Button } from './ui/button'

interface MicrophoneButtonProps {
  onTranscription: (text: string) => void;
}

export function MicrophoneButton({ onTranscription }: MicrophoneButtonProps) {
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const startListening = useCallback(async () => {
    try {
      setIsListening(true)
      const recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'

      recognition.onresult = (event: { results: { transcript: any; }[][]; }) => {
        const transcript = event.results[0][0].transcript
        onTranscription(transcript)
        setIsListening(false)
      }

      recognition.onerror = (event: { error: any; }) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }

      recognition.start()
    } catch (error) {
      console.error('Speech recognition error:', error)
      setIsListening(false)
    }
  }, [onTranscription])

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full bg-white hover:bg-gray-100"
      onClick={startListening}
      disabled={isListening || isProcessing}
    >
      {isProcessing ? (
        <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
      ) : isListening ? (
        <MicOff className="h-6 w-6 text-red-500" />
      ) : (
        <Mic className="h-6 w-6 text-purple-500" />
      )}
    </Button>
  )
} 