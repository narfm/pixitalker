export interface MathObject {
    emoji: string
    count: number
    text?: string
  }
  
  export interface BaseContent {
    setup: {
      objects: Array<{
        emoji: string
        count: number
        text: string
      }>
    }
    visuals: {
      objects: Array<MathObject>
    }
    operation: string
  }
  
  export interface MathExample extends BaseContent {
    type: 'example'
    explanation: string
    result: string
  }
  
  export interface MathProblem extends BaseContent {
    type: 'problem'
    question: string
    hint: string
    expected_interaction: string
  }
  
  export type MathContent = MathExample | MathProblem
  
  