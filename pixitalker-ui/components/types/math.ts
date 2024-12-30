export interface MathObject {
  emoji: string;
  count: number;
  text?: string;
}

export interface MathSetup {
  objects: MathObject[];
}

export interface MathVisuals {
  objects: MathObject[];
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
  options: MathOption[]
}

export type MathContent = MathExample | MathProblem;
  
export interface MathOption {
  value: string
  is_correct: boolean
  response: string
  action: string
}