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

export interface MathExample {
  type: 'example';
  setup: MathSetup;
  visuals: MathVisuals;
  operation: string;
  explanation: string;
  result: string;
}

export interface MathProblem {
  type: 'problem';
  setup: MathSetup;
  visuals: MathVisuals;
  operation: string;
  question: string;
  hint: string;
  expected_interaction: string;
}

export type MathContent = MathExample | MathProblem;
  
  