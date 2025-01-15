'use client'

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MathExample } from "./types/math"

interface DivisionExampleProps {
  content: MathExample
  isPlaying: boolean
  onComplete: () => void
}

export function DivisionExample({ content, isPlaying, onComplete }: DivisionExampleProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [groupedItems, setGroupedItems] = useState<number[][]>([])
  const [highlightedItems, setHighlightedItems] = useState<number[]>([])
  const [countingGroup, setCountingGroup] = useState<number | null>(null)
  // Add state for tracking distribution progress
  const [distributionProgress, setDistributionProgress] = useState(0)

  useEffect(() => {
    if (!isPlaying) {
      setCountingGroup(null)
      setHighlightedItems([])
      return
    }

    let timeout: NodeJS.Timeout
    let interval: NodeJS.Timeout

    if (currentStep === 2) {
        // Handle division animation
        const totalGroups = content.visuals.action?.groups?.[0].count || 0
        const itemsPerGroup = Number(content.visuals.action?.groups?.[0].objects[0].count) || 0
        
        // Pre-calculate all groups with sequential distribution
        const allGroups: number[][] = []
        for (let i = 0; i < totalGroups; i++) {
          // Calculate indices for each group to ensure they're distinct
          const startIndex = i * itemsPerGroup
          const groupItems = Array.from(
            { length: itemsPerGroup }, 
            (_, index) => startIndex + index
          )
          allGroups.push(groupItems)
        }
        
        interval = setInterval(() => {
          setDistributionProgress(prev => {
            if (prev < totalGroups) {
              setGroupedItems(currentGroups => {
                // Ensure we're adding a new unique group
                if (!currentGroups.includes(allGroups[prev])) {
                  return [...currentGroups, allGroups[prev]]
                }
                return currentGroups
              })
              return prev + 1
            }
            clearInterval(interval)
            timeout = setTimeout(() => {
              setCurrentStep(prev => prev + 1)
              setDistributionProgress(0)
            }, 2000)
            return prev
          })
        }, 2000)
      }else if (currentStep === 3) {
      // Handle counting animation for each group
      const totalGroups = groupedItems.length
      
      interval = setInterval(() => {
        setDistributionProgress(prev => {
          if (prev < totalGroups) {
            setCountingGroup(prev)
            setHighlightedItems(groupedItems[prev])
            return prev + 1
          }
          clearInterval(interval)
          // Move to final step after counting is complete
          timeout = setTimeout(() => {
            setCountingGroup(null)
            setHighlightedItems([])
            setCurrentStep(prev => prev + 1)
            setDistributionProgress(0) // Reset for next time
          }, 2000)
          return prev
        })
      }, 2500)

    } else if (currentStep < 4) {
      timeout = setTimeout(() => {
        setCurrentStep(prev => prev + 1)
      }, 4000)
    } else {
      timeout = setTimeout(onComplete, 3000)
    }

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [currentStep, isPlaying, content, groupedItems, onComplete])

  const renderItems = (items: number[], grouped: boolean = false) => {
    const totalItems = parseInt(String(content.visuals?.objects?.[0]?.count || 0))
    const emoji = content.visuals?.objects?.[0]?.emoji || '⭐'

    return (
      <div className={`flex gap-4 flex-wrap justify-center ${grouped ? 'p-4 border-2 border-dashed border-purple-300 rounded-xl bg-purple-50/50' : ''}`}>
        {Array.from({ length: totalItems }).map((_, index) => {
          const isHighlighted = highlightedItems.includes(index)
          const isInCurrentGroup = items.includes(index)
          
          return (
            <motion.div
              key={index}
              initial={grouped ? { opacity: 0, scale: 0 } : { scale: 0 }}
              animate={{ 
                opacity: isInCurrentGroup ? 1 : 0.3,
                scale: 1,
                backgroundColor: isHighlighted ? 'rgba(168, 85, 247, 0.2)' : 'transparent'
              }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="text-4xl p-2 rounded-full transition-all duration-300"
            >
              {emoji}
            </motion.div>
          )
        })}
      </div>
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
      title: "Let's See What We Have",
      content: (
        <motion.div className="space-y-6">
          {renderItems(Array.from({ length: parseInt(String(content.visuals?.objects?.[0]?.count || 0)) }, (_, i) => i))}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg text-purple-600"
          >
            We have {content.visuals?.objects?.[0]?.count || 0} {content.visuals?.objects?.[0]?.emoji || '⭐'} in total
          </motion.div>
        </motion.div>
      )
    },
    {
      title: "Time to Divide!",
      content: (
        <motion.div className="space-y-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-2xl font-bold text-purple-500"
          >
            {content.operation}
          </motion.div>
          <div className="grid grid-cols-2 gap-6">
            {Array.from({ length: content.visuals.action?.groups?.[0].count || 0 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="text-lg font-semibold text-purple-600">
                  Friend {index + 1}
                </div>
                {groupedItems[index] && renderItems(groupedItems[index], true)}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )
    },
    {
      title: "Let's Count Each Share",
      content: (
        <motion.div className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl text-purple-600"
          >
            {content.explanation}
          </motion.div>
          <div className="grid grid-cols-2 gap-6">
            {groupedItems.map((group, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center gap-2"
              >
                <div className={`text-lg font-semibold transition-colors duration-300 ${
                  countingGroup === index ? 'text-purple-600' : 'text-gray-400'
                }`}>
                  Friend {index + 1}
                </div>
                {renderItems(group, true)}
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

