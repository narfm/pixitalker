'use client'

import { Card } from "@/components/ui/card"
import { useState, useEffect, useCallback } from "react"
import { Maximize2, Minimize2, Pause, Play } from 'lucide-react'
import { Button } from "./ui/button"
import { MathExample } from "./MathExample"
import { MathProblem } from "./MathProblem"
import { parseXML } from "@/lib/xml-parser"
import { eventEmitter } from '@/lib/event-emitter'
import { MathContent } from "./types/math"
import { parseMathContent } from "@/lib/math-parser"
import { SubtractionExample } from "./SubtractionExample"
import { MultiplicationExample } from "./MultiplicationExample"
import { DivisionExample } from "./DivisionExample"


export function Whiteboard() {
  const [isVisible] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [contentQueue, setContentQueue] = useState<MathContent[]>([])
  const [currentContent, setCurrentContent] = useState<MathContent>()
  const [key, setKey] = useState(0)

  const playNextContent = useCallback(() => {
    setContentQueue(prev => {
      if (prev.length === 0) return prev;
      const [nextContent, ...rest] = prev;
      setCurrentContent(nextContent);
      setIsPlaying(true);
      setKey(k => k + 1);
      return rest;
    });
  }, []);

  useEffect(() => {
    const handleMathContent = (data: any) => {
      try {
        console.log('Received content:', data);
        // const newContent = parseXML(data.content);
        // const newContent = parseMathContent(data.content.type, data.content.content);
        let newContent = data.content.content;
        newContent.type = data.content.type;
        
        console.log('Parsed content:', newContent);
        
        setContentQueue(prev => {
          const newQueue = [...prev, newContent];
          console.log('Updated queue:', newQueue);
          return newQueue;
        });

        if (!currentContent) {
          console.log('No current content, playing next...');
          setTimeout(playNextContent, 0);
        }
      } catch (error) {
        console.error('Error processing math content:', error);
      }
    };

    eventEmitter.on('mathContent', handleMathContent);
    return () => eventEmitter.off('mathContent', handleMathContent);
  }, [currentContent, playNextContent]);

  const handleComplete = useCallback(() => {
    setIsPlaying(false);
    setTimeout(() => {
      setCurrentContent(undefined);
      playNextContent();
    }, 1000);
  }, [playNextContent]);

  if (!isVisible || !currentContent) return null;

  return (
    <Card className={`absolute right-12 top-1/2 -translate-y-1/2 p-6 shadow-2xl bg-gradient-to-br from-white to-blue-50 border-4 border-blue-300 rounded-xl transition-all duration-300 ${
      isExpanded ? 'w-[1200px] h-[800px]' : 'w-[800px] h-[600px]'
    }`}>
      {contentQueue.length > 0 && (
        <div className="absolute top-2 right-2">
          <span className="text-sm text-purple-500 bg-purple-100 px-2 py-1 rounded-full">
            {contentQueue.length} more
          </span>
        </div>
      )}
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
        {currentContent.type === 'example' && currentContent.visuals.action?.type === 'divide' ? (
            <DivisionExample
              content={currentContent}
              isPlaying={isPlaying}
              onComplete={handleComplete}
            />
          ) : currentContent.type === 'example' && (currentContent.visuals.action?.type === 'duplicate' || currentContent.visuals.action?.type === 'arrange') ? (
            <MultiplicationExample
              content={currentContent}
              isPlaying={isPlaying}
              onComplete={handleComplete}
            />
          ) : currentContent.type === 'example' && currentContent.visuals.action?.type === 'remove' ? (
            
            <SubtractionExample
            key={key}
              content={currentContent}
              isPlaying={isPlaying}
              onComplete={handleComplete}
            />
          ) : 
          currentContent.type === 'example' ? (
            <MathExample
              key={key}
              content={currentContent}
              isPlaying={isPlaying}
              onComplete={handleComplete}
            />
          ) : (
            <MathProblem
              key={key}
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

