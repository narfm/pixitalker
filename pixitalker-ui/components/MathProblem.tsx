'use client'

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "./ui/button"
import type { MathProblem } from "./types/math"

interface MathProblemProps {
  content: MathProblem
  isPlaying: boolean
  onComplete: () => void
}

export function MathProblem({ content, isPlaying, onComplete }: MathProblemProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    if (!isPlaying) return

    let timeout: NodeJS.Timeout

    if (currentStep < 2) {
      timeout = setTimeout(() => {
        setCurrentStep(prev => prev + 1)
      }, 4000)
    }

    return () => clearTimeout(timeout)
  }, [currentStep, isPlaying])

  const steps = [
    {
      title: "Problem",
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
      title: "Your Turn!",
      content: (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-bold text-purple-600"
          >
            {content.question}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg text-purple-500"
          >
            {content.expected_interaction}
          </motion.div>
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-lg text-orange-500 italic"
              >
                💡 {content.hint}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => setShowHint(!showHint)}
              className="border-purple-200 hover:bg-purple-100"
            >
              {showHint ? "Hide Hint" : "Show Hint"}
            </Button>
            <Button
              onClick={onComplete}
              className="bg-purple-500 hover:bg-purple-600"
            >
              I Got It!
            </Button>
          </div>
        </div>
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

