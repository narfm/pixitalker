'use client'

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { MathExample } from "./types/math"

interface MathExampleProps {
  content: MathExample
  isPlaying: boolean
  onComplete: () => void
}

export function MathExample({ content, isPlaying, onComplete }: MathExampleProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [counting, setCounting] = useState(0)
  const [countedEmojis, setCountedEmojis] = useState<string[]>([])

  useEffect(() => {
    if (!isPlaying) return

    let timeout: NodeJS.Timeout
    let countInterval: NodeJS.Timeout

    if (currentStep === 3) {
      let count = 0
      const allEmojis = content.visuals.objects.flatMap(obj => 
        Array(obj.count).fill(obj.emoji)
      )
      
      countInterval = setInterval(() => {
        count++
        setCounting(count)
        setCountedEmojis(allEmojis.slice(0, count))
        
        if (count >= parseInt(content.result)) {
          clearInterval(countInterval)
          timeout = setTimeout(() => {
            setCurrentStep(prev => prev + 1)
          }, 2000)
        }
      }, 1000)
    } else if (currentStep < 4) {
      timeout = setTimeout(() => {
        setCurrentStep(prev => prev + 1)
      }, currentStep === 2 ? 3000 : 4000)
    } else {
      timeout = setTimeout(onComplete, 3000)
    }

    return () => {
      clearTimeout(timeout)
      clearInterval(countInterval)
    }
  }, [currentStep, isPlaying, content.result, content.visuals.objects, onComplete])

  const steps = [
    {
      title: "Question",
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl text-purple-600"
        >
          {content.setup.objects.map((obj, i) => (
            <span key={i}>
              {i > 0 && " and "}
              {obj.count} {obj.emoji}
            </span>
          ))}
        </motion.div>
      )
    },
    {
      title: "Let's Visualize",
      content: (
        <motion.div className="flex justify-center gap-8">
          {content.visuals.objects.map((obj, groupIndex) => (
            <motion.div
              key={groupIndex}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: groupIndex * 0.3 }}
              className="flex gap-2"
            >
              {[...Array(obj.count)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: (groupIndex * obj.count + i) * 0.2 }}
                  className="text-4xl"
                >
                  {obj.emoji}
                </motion.div>
              ))}
            </motion.div>
          ))}
        </motion.div>
      )
    },
    {
      title: "Operation",
      content: (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-4xl font-bold text-purple-500"
        >
          {content.operation} = ?
        </motion.div>
      )
    },
    {
      title: "Let's Count",
      content: (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl text-purple-600"
          >
            {content.explanation}
          </motion.div>
          <div className="flex flex-col items-center gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-6xl font-bold text-purple-500"
            >
              {counting}
            </motion.div>
            <motion.div 
              className="flex flex-wrap justify-center gap-2 max-w-[80%]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {countedEmojis.map((emoji, index) => (
                <motion.span
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl"
                >
                  {emoji}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </div>
      )
    },
    {
      title: "Result",
      content: (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="space-y-4"
        >
          <div className="text-4xl font-bold text-purple-500">
            {content.operation} = {content.result}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-6xl"
          >
            🎉
          </motion.div>
        </motion.div>
      )
    }
  ]

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="text-center"
      >
        <h4 className="text-2xl font-bold text-purple-500 mb-6">
          {steps[currentStep].title}
        </h4>
        {steps[currentStep].content}
      </motion.div>
    </AnimatePresence>
  )
}

