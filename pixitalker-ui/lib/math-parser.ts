import { MathContent, MathExample, MathProblem } from "@/components/types/math"

export const parseMathContent = (type: string, json: any): MathContent => {
  try {
    // Ensure the content has the required structure
    if ( !json.setup || !json.visuals) {
      throw new Error('Invalid content structure')
    }

    // Convert visuals array to the correct format if needed
    // Convert visuals array to the correct format and include actions with their objects if present
    const visuals = {
      objects: Array.isArray(json.visuals.objects) ? json.visuals.objects : [],
      action: json.visuals.action ? {
        type: json.visuals.action.type || '',
        objects: Array.isArray(json.visuals.action.objects) ? json.visuals.action.objects : []
      } : null
    };

    if (type === 'example') {
      return {
        type: 'example',
        setup: json.setup,
        visuals: visuals,
        operation: json.operation || '',
        explanation: json.explanation || '',
        result: json.result?.toString() || ''
      } as MathExample
    }

    return {
      type: 'problem',
      setup: json.setup,
      visuals: visuals,
      operation: json.operation || '',
      question: json.question || '',
      hint: json.hint || '',
      expected_interaction: json.expected_interaction || '',
      options: (json.options || []).map((opt: any) => ({
        value: opt.value.toString(),
        is_correct: Boolean(opt.is_correct),
        response: opt.response || '',
        action: opt.action || ''
      }))
    } as MathProblem
  } catch (error) {
    console.error('Error parsing math content:', error)
    // Return a default example content instead of throwing
    return {
      type: 'example',
      setup: 'Let\'s start with a simple example',
      visuals: {
        objects: [
          { emoji: '🔢', count: '1' }
        ]
      },
      operation: '1 + 0',
      explanation: 'Something went wrong, but we can try again!',
      result: '1'
    } as MathExample
  }
}

