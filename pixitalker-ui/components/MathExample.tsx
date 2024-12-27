'use client'

import { useEffect, useRef } from 'react'
import * as PIXI from 'pixi.js'
import { parseExample } from '@/lib/parse-example'

interface MathExampleProps {
  example: string
  width: number
  height: number
}

export function MathExample({ example, width, height }: MathExampleProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const appRef = useRef<PIXI.Application | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Create audio element for pop sound
    audioRef.current = new Audio('/assets/pop.mp3')
    
    if (!containerRef.current) return

    const app = new PIXI.Application({
      width,
      height,
      backgroundColor: 0xFFFFFF,
      antialias: true,
    })

    containerRef.current.appendChild(app.view as HTMLCanvasElement)
    appRef.current = app
    renderExample(example)

    return () => {
      app.destroy(true)
      if (audioRef.current) {
        audioRef.current = null
      }
    }
  }, [example, width, height])

  const playPopSound = async () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      try {
        await audioRef.current.play()
      } catch (error) {
        console.error('Error playing sound:', error)
      }
    }
  }

  const animateObject = (object: PIXI.Text) => {
    // Initial scale and alpha
    object.scale.set(0)
    object.alpha = 0

    // Pop-in animation
    const duration = 0.3
    let elapsed = 0
    const animate = () => {
      elapsed += 1/60
      const progress = Math.min(elapsed / duration, 1)
      
      // Elastic ease-out function
      const t = progress
      const scale = 1 + Math.pow(2, -10 * t) * Math.sin((t - 0.075) * (2 * Math.PI) / 0.3)
      
      object.scale.set(scale)
      object.alpha = progress

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    animate()
  }

  const renderExample = async (exampleXml: string) => {
    if (!appRef.current) return

    const app = appRef.current
    app.stage.removeChildren()

    const parsed = parseExample(exampleXml)

    // Create setup text
    const setupText = new PIXI.Text(parsed.setup, {
      fontSize: 24,
      fill: 0x333333,
      fontFamily: 'Arial',
      align: 'center',
      wordWrap: true,
      wordWrapWidth: width * 0.9,
    })
    setupText.x = width / 2 - setupText.width / 2
    setupText.y = 20
    app.stage.addChild(setupText)

    // Create containers for visual groups
    const leftGroup = new PIXI.Container()
    const rightGroup = new PIXI.Container()
    leftGroup.x = width * 0.25
    rightGroup.x = width * 0.65
    leftGroup.y = rightGroup.y = height * 0.4

    // Render objects for each group with sequential animation
    const renderObjects = async (container: PIXI.Container, visual: { emoji: string; count: number }) => {
      const spacing = 60
      const totalWidth = (visual.count - 1) * spacing
      const startX = -totalWidth / 2

      for (let i = 0; i < visual.count; i++) {
        const object = new PIXI.Text(visual.emoji, {
          fontSize: 40,
          align: 'center',
        })
        object.anchor.set(0.5)
        object.x = startX + i * spacing
        object.y = 0

        // Add bounce animation
        const startY = object.y
        const bounceTimeline = () => {
          object.y = startY + Math.sin(Date.now() / 500 + i) * 10
          requestAnimationFrame(bounceTimeline)
        }
        bounceTimeline()

        container.addChild(object)
        
        // Animate object appearance with sound
        await new Promise<void>(resolve => {
          setTimeout(async () => {
            await playPopSound()
            animateObject(object)
            resolve()
          }, 300) // Delay between each object
        })
      }
    }

    // Add static elements
    const operationText = new PIXI.Text('+', {
      fontSize: 48,
      fill: 0x333333,
      fontFamily: 'Arial',
    })
    operationText.x = width * 0.45
    operationText.y = height * 0.4
    app.stage.addChild(operationText)
    
    const equalsText = new PIXI.Text('=', {
      fontSize: 48,
      fill: 0x333333,
      fontFamily: 'Arial',
    })
    equalsText.x = width * 0.85
    equalsText.y = height * 0.4
    app.stage.addChild(equalsText)

    const resultText = new PIXI.Text(parsed.result, {
      fontSize: 48,
      fill: 0x333333,
      fontFamily: 'Arial',
    })
    resultText.x = width * 0.92
    resultText.y = height * 0.4
    app.stage.addChild(resultText)

    const explanationText = new PIXI.Text(parsed.explanation, {
      fontSize: 20,
      fill: 0x666666,
      fontFamily: 'Arial',
      align: 'center',
      wordWrap: true,
      wordWrapWidth: width * 0.8,
    })
    explanationText.x = width / 2 - explanationText.width / 2
    explanationText.y = height * 0.7
    app.stage.addChild(explanationText)

    // Add groups to stage
    app.stage.addChild(leftGroup, rightGroup)

    // Render objects with sequential animation
    if (parsed.visuals[0]) await renderObjects(leftGroup, parsed.visuals[0])
    if (parsed.visuals[1]) await renderObjects(rightGroup, parsed.visuals[1])
  }

  return (
    <>
      <div ref={containerRef} className="w-full h-full" />
    </>
  )
} 