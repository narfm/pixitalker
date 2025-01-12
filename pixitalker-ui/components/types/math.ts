export interface MathObject {
  emoji: string
  count: number | string
}

export interface VisualAction {
  type: string
  rows?: VisualRow[]
  objects?: MathObject[]
}

export interface VisualRow {
  count: number
  objects: MathObject[]
}

export interface DuplicateAction {
  type: 'duplicate'
  rows: VisualRow[]
}

export interface RemoveAction {
  type: 'remove'
  objects: MathObject[]
}

export interface BaseContent {
  setup: string
  visuals: {
    objects?: MathObject[]
    action?: VisualAction
    initialObjects?: MathObject[]
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

export interface MathOption {
  value: string
  is_correct: boolean
  response: string
  action: string
}

export interface ChatMessage {
  message: string
}

export interface WhiteboardContent {
  type: string
  content: string
}

export interface MessageContent {
  chat: ChatMessage
  whiteboard?: WhiteboardContent
}

export interface Message {
  role: 'user' | 'teacher'
  content: MessageContent
  timestamp: string
}

export type MathContent = MathExample | MathProblem;


export interface MultiplicationVisuals {
  initialObjects: MathObject[]
  action: DuplicateAction
}

