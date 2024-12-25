'use client'

import { Button } from "@/components/ui/button"
import { Music, Link2OffIcon as Music2Off } from 'lucide-react'
import { useEffect, useRef, useState } from "react"

export function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio('/background-sound.wav')
    audioRef.current.loop = true
    audioRef.current.volume = 0.3

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="bg-white/50 hover:bg-white/80 hover:text-purple-500"
      onClick={togglePlay}
      aria-label={isPlaying ? "Pause background music" : "Play background music"}
    >
      {isPlaying ? (
        <Music className="h-5 w-5 text-purple-500" />
      ) : (
        <Music2Off className="h-5 w-5 text-purple-500" />
      )}
    </Button>
  )
}

