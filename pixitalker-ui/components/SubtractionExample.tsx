'use client'

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MathExample } from "./types/math"

interface SubtractionExampleProps {
  content: MathExample
  isPlaying: boolean
  onComplete: () => void
}

export function SubtractionExample({ content, isPlaying, onComplete }: SubtractionExampleProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [removedItems, setRemovedItems] = useState<number[]>([])
  const [counting, setCounting] = useState(0)

  useEffect(() => {
    if (!isPlaying) return

    let timeout: NodeJS.Timeout

    if (currentStep === 2) {
      // Handle removal animation
      const totalToRemove = parseInt(content.visuals.action?.objects[0].count || "0")
      let currentCount = 0

      const interval = setInterval(() => {
        if (currentCount < totalToRemove) {
          setRemovedItems(prev => [...prev, currentCount])
          currentCount++
        } else {
          clearInterval(interval)
          timeout = setTimeout(() => {
            setCurrentStep(prev => prev + 1)
          }, 2000)
        }
      }, 1000)

      return () => {
        clearInterval(interval)
        clearTimeout(timeout)
      }
    } else if (currentStep < 4) {
      timeout = setTimeout(() => {
        setCurrentStep(prev => prev + 1)
      }, currentStep === 3 ? 3000 : 4000)
    } else {
      timeout = setTimeout(onComplete, 3000)
    }

    return () => clearTimeout(timeout)
  }, [currentStep, isPlaying, content, onComplete])

  const steps = [
    {
      title: "Initial State",
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl text-purple-600"
        >
          {content.setup}
        </motion.div>
      )
    },
    {
      title: "Let's See What We Have",
      content: (
        <motion.div className="flex flex-col items-center gap-8">
          <div className="flex gap-2 flex-wrap justify-center max-w-[400px]">
            {Array.from({ length: parseInt(content.visuals.objects[0].count) }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.2 }}
                className={`text-4xl transition-all duration-300 ${
                  removedItems.includes(i) ? 'opacity-20 scale-75' : ''
                }`}
              >
                {content.visuals.objects[0].emoji}
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg text-purple-600"
          >
            We start with {content.visuals.objects[0].count} {content.visuals.objects[0].emoji}
          </motion.div>
        </motion.div>
      )
    },
    {
      title: "Time to Subtract!",
      content: (
        <motion.div className="space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-2xl font-bold text-purple-500"
          >
            {content.operation}
          </motion.div>
          <div className="flex gap-2 flex-wrap justify-center max-w-[400px]">
            {Array.from({ length: parseInt(content.visuals.objects[0].count) }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 1 }}
                animate={removedItems.includes(i) ? {
                  scale: 0,
                  opacity: 0,
                  y: 50,
                  x: Math.random() * 100 - 50
                } : { scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-4xl"
              >
                {content.visuals.objects[0].emoji}
              </motion.div>
            ))}
          </div>
          {removedItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg text-purple-600"
            >
              Taking away {removedItems.length} {content.visuals.objects[0].emoji}...
            </motion.div>
          )}
        </motion.div>
      )
    },
    {
      title: "Let's Count What's Left",
      content: (
        <motion.div className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl text-purple-600"
          >
            {content.explanation}
          </motion.div>
          <div className="flex gap-2 flex-wrap justify-center max-w-[400px]">
            {Array.from({ length: parseInt(content.visuals.objects[0].count) }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 1 }}
                animate={removedItems.includes(i) ? {
                  scale: 0,
                  opacity: 0,
                  display: 'none'
                } : {
                  scale: [1, 1.2, 1],
                  transition: {
                    duration: 0.5,
                    delay: i * 0.5
                  }
                }}
                className="text-4xl"
              >
                {content.visuals.objects[0].emoji}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )
    },
    {
      title: "Final Result",
      content: (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="space-y-4"
        >
          <div className="text-2xl font-bold text-purple-500">
            {content.result}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-6xl"
          >
            ✨
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

