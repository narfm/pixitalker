'use client'

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "./ui/button"
import { ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react'
import confetti from 'canvas-confetti'
import type { MathProblem } from "./types/math"

interface MathProblemProps {
  content: MathProblem
  isPlaying: boolean
  onComplete: () => void
}

export function MathProblem({ content, isPlaying, onComplete }: MathProblemProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showResponse, setShowResponse] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showCountingAnimation, setShowCountingAnimation] = useState(false)
  const [currentCount, setCurrentCount] = useState(0)
  const countingRef = useRef<NodeJS.Timeout | null>(null)

  // Ensure content has all required properties with default values
  const safeContent: MathProblem = {
    type: 'problem',
    setup: content?.setup || '',
    visuals: {
      objects: content?.visuals?.objects || []
    },
    operation: content?.operation || '',
    question: content?.question || '',
    hint: content?.hint || '',
    expected_interaction: content?.expected_interaction || '',
    options: content?.options || []
  }

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

  const performAction = (correctAnswer: boolean) => {
    if (!correctAnswer) {
      // setShowCountingAnimation(true)
      // let count = 0
      // const totalCount = safeContent.visuals.objects.reduce((acc, obj) => acc + parseInt(String(obj.count)), 0)
      
      // countingRef.current = setInterval(() => {
      //   count++
      //   setCurrentCount(count)
      //   if (count >= totalCount) {
      //     if (countingRef.current) clearInterval(countingRef.current)
      //     setTimeout(() => setShowCountingAnimation(false), 2000)
      //   }
      // }, 1000)
    } else if (correctAnswer) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
  }

  const handleOptionSelect = (value: string) => {
    setSelectedOption(value)
    setShowResponse(true)
    const option = safeContent.options.find(opt => opt.value === value)
    if (option) {
      setIsCorrect(option.is_correct)
      performAction(option.is_correct)
      
      // If answer is correct, trigger completion after celebration
      if (option.is_correct) {
        setTimeout(() => {
          onComplete()
        }, 2000) // Wait for celebration animation
      }
    }
  }

  useEffect(() => {
    return () => {
      if (countingRef.current) {
        clearInterval(countingRef.current)
      }
    }
  }, [])

  const steps = [
    {
      title: "Problem",
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl text-purple-600"
        >
          {safeContent.setup}
        </motion.div>
      )
    },
    {
      title: "Let's Visualize",
      content: (
        <motion.div className="flex justify-center gap-8">
          {safeContent.visuals.objects.map((obj, groupIndex) => (
            <motion.div
              key={groupIndex}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: groupIndex * 0.3 }}
              className="flex gap-2"
            >
              {[...Array(parseInt(obj.count))].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: (groupIndex * parseInt(obj.count) + i) * 0.2 }}
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
      title: "Solve the Problem!",
      content: (
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-4xl font-bold text-purple-500"
            >
              {safeContent.operation}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-bold text-purple-600"
            >
              {safeContent.question}
            </motion.div>
          </div>

          {!showResponse ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-3 gap-4 mt-8"
            >
              {safeContent.options.map((option) => (
                <Button
                  key={option.value}
                  onClick={() => handleOptionSelect(option.value)}
                  className="text-xl p-6 bg-purple-500 hover:bg-purple-600 transition-all duration-300 transform hover:scale-105"
                >
                  {option.value}
                </Button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className={`text-lg p-4 rounded-lg ${
                isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {safeContent.options.find(opt => opt.value === selectedOption)?.response}
              </div>

              {showCountingAnimation && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold text-purple-500 mb-4">
                    Let's count together!
                  </div>
                  <div className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                    {currentCount}
                  </div>
                </motion.div>
              )}

              {!isCorrect && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowResponse(false)
                    setSelectedOption(null)
                    setShowCountingAnimation(false)
                    if (countingRef.current) clearInterval(countingRef.current)
                  }}
                  className="w-full border-purple-200 hover:bg-purple-100"
                >
                  Try Again
                </Button>
              )}
            </motion.div>
          )}

          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-lg text-orange-500 italic bg-orange-50 p-4 rounded-lg"
              >
                💡 {safeContent.hint}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-center">
            <Button
              variant="ghost"
              onClick={() => setShowHint(!showHint)}
              className="border-purple-200 hover:bg-purple-100"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              {showHint ? "Hide Hint" : "Need a Hint?"}
            </Button>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className="w-full">
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
      <div className="flex justify-between mt-6">
        <Button
          variant="ghost"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0 || showResponse}
          className="text-purple-500 hover:text-purple-700"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          variant="ghost"
          onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
          disabled={currentStep === steps.length - 1 || showResponse}
          className="text-purple-500 hover:text-purple-700"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}

