'use client'

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MathExample } from "@/types/math"

interface MultiplicationExampleProps {
  content: MathExample
  isPlaying: boolean
  onComplete: () => void
}

export function MultiplicationExample({ content, isPlaying, onComplete }: MultiplicationExampleProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [visibleRows, setVisibleRows] = useState<number[]>([])
  const [countingTotal, setCountingTotal] = useState(0)
  const [highlightedItems, setHighlightedItems] = useState<number[]>([])

  useEffect(() => {
    if (!isPlaying) return

    let timeout: NodeJS.Timeout

    if (currentStep === 2) {
      // Handle row duplication animation
      const totalRows = content.visuals.action?.rows?.[0].count || 0
      let currentRow = 0

      const interval = setInterval(() => {
        if (currentRow < totalRows) {
          setVisibleRows(prev => [...prev, currentRow])
          currentRow++
        } else {
          clearInterval(interval)
          timeout = setTimeout(() => {
            setCurrentStep(prev => prev + 1)
          }, 2000)
        }
      }, 1500)

      return () => {
        clearInterval(interval)
        clearTimeout(timeout)
      }
    } else if (currentStep === 3) {
      // Handle counting animation
      const itemsPerRow = content.visuals.action?.rows?.[0].objects[0].count || 0
      const totalRows = content.visuals.action?.rows?.[0].count || 0
      const totalItems = itemsPerRow * totalRows
      let count = 0

      const interval = setInterval(() => {
        if (count < totalItems) {
          setCountingTotal(count + 1)
          setHighlightedItems(prev => [...prev, count])
          count++
        } else {
          clearInterval(interval)
          timeout = setTimeout(() => {
            setCurrentStep(prev => prev + 1)
          }, 2000)
        }
      }, 800)

      return () => {
        clearInterval(interval)
        clearTimeout(timeout)
      }
    } else if (currentStep < 4) {
      timeout = setTimeout(() => {
        setCurrentStep(prev => prev + 1)
      }, 4000)
    } else {
      timeout = setTimeout(onComplete, 3000)
    }

    return () => clearTimeout(timeout)
  }, [currentStep, isPlaying, content, onComplete])

  const renderRow = (rowIndex: number) => {
    const itemsPerRow = content.visuals.action?.rows?.[0].objects[0].count || 0
    const emoji = content.visuals.action?.rows?.[0].objects[0].emoji || ''

    return (
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: rowIndex * 0.2 }}
        className="flex gap-4 justify-center"
      >
        {Array.from({ length: Number(itemsPerRow) }).map((_, itemIndex) => {
          const globalIndex = rowIndex * itemsPerRow + itemIndex
          return (
            <motion.div
              key={`${rowIndex}-${itemIndex}`}
              initial={{ scale: 0 }}
              animate={{ 
                scale: 1,
                backgroundColor: highlightedItems.includes(globalIndex) ? 'rgba(168, 85, 247, 0.2)' : 'transparent'
              }}
              transition={{ duration: 0.3, delay: itemIndex * 0.1 }}
              className="text-4xl p-2 rounded-full transition-colors duration-300"
            >
              {emoji}
            </motion.div>
          )
        })}
      </motion.div>
    )
  }

  const steps = [
    {
      title: "Initial Setup",
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
      title: "Let's Start with One Row",
      content: (
        <motion.div className="space-y-6">
          <div className="flex justify-center gap-4">
            {Array.from({ length: Number(content.visuals.objects?.[0].count || 0) }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.2 }}
                className="text-4xl"
              >
                {content.visuals.objects?.[0].emoji}
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg text-purple-600"
          >
            Here's our first row of {content.visuals.objects?.[0].count} {content.visuals.objects?.[0].emoji}
          </motion.div>
        </motion.div>
      )
    },
    {
      title: "Time to Multiply!",
      content: (
        <motion.div className="space-y-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-2xl font-bold text-purple-500"
          >
            {content.operation}
          </motion.div>
          <div className="space-y-4">
            {Array.from({ length: Number(content.visuals.action?.rows?.[0].count || 0) }).map((_, i) => (
              visibleRows.includes(i) && (
                <motion.div key={i} className="flex justify-center">
                  {renderRow(i)}
                </motion.div>
              )
            ))}
          </div>
        </motion.div>
      )
    },
    {
      title: "Let's Count Everything!",
      content: (
        <motion.div className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl text-purple-600"
          >
            {content.explanation}
          </motion.div>
          <div className="space-y-4">
            {Array.from({ length: Number(content.visuals.action?.rows?.[0].count || 0) }).map((_, i) => (
              <div key={i} className="flex justify-center">
                {renderRow(i)}
              </div>
            ))}
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500"
          >
            {countingTotal}
          </motion.div>
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

