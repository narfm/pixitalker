import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// In-memory session store (replace with database in production)
const sessions = new Map<string, ChatCompletionMessageParam[]>();

interface ExampleTemplate {
  setup: {
    objects: Array<{
      type: string;
      emoji: string;
      count: number;
    }>;
    theme: string;
  };
  operation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface TeacherTemplate {
  instruction: string;
  operation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface MathAgent {
  name: string;
  description: string;
  enhanceExample: (template: TeacherTemplate) => Promise<string>;
  enhanceProblem: (template: TeacherTemplate) => Promise<string>;
}

// Agent factory to create specialized math agents
class MathAgentFactory {
  private static createPrompt(operation: string, task: 'example' | 'problem', template: TeacherTemplate): string {
    const basePrompt = `You are a specialized math education agent for ${operation}. 
    Enhance this ${task} template with operation-specific details while maintaining the exact scenario:

    Template Information:
    Instruction: ${template.instruction}
    Operation: ${template.operation}
    Difficulty: ${template.difficulty}

    Your task is to enhance this template by:
    1. Adding operation-specific explanations and steps
    2. Maintaining consistency with the teacher's scenario`;

    const exampleFormat = `
     {
      "setup": "You have [number] [specific emoji]] in one hand and [number] [specific emoji] in the other.",
      "visuals": {
        "objects": [
          { "emoji": "[specific emoji]", "count": "[number]" },
          { "emoji": "[specific emoji]", "count": "[number]" }
        ]
      },
      "operation": "[Provide the mathematical operation using the exact numbers]",
      "explanation": "[Provide step-by-step explanation using the objects, i.e Let’s count them together! "1, 2, 3... 4, 5!"  ]",
      "result": "[Calculate and provide the result]"
    }`;

    const problemFormat = `
    {
      "setup": "6 puppies are playing in the park, and 4 more puppies join them.",
      "visuals": {
        "objects": [
          { "emoji": "[specific emoji]", "count": "[number]" },
          { "emoji": "[specific emoji]", "count": "[number]" }
        ]
      },
      "operation": "[Provide the mathematical operation using the exact numbers, like 6 + 4]",
      "question": "[Frame question using the theme and objects],
      "hint": "[Provide helpful hint using the objects]",
      "options": [
        {
          "value": "9",
          "is_correct": "false",
          "response": "Think again, count them one by one"
        },
        {
          "value": 10,
          "is_correct": "true",
          "response": "Great job! That's correct. There are 10 puppies in total!",
          action: "Show a happy animation with puppies celebrating."
        },
        {
          "value": 1,
          "is_correct": "false",
          "response": "Not quite. Remember, there were 6 puppies, and 4 more joined. Try again!"
        },
        {
          "value": 15,
          "is_correct": "false",
          "response": "Oops, that's too many puppies! Count carefully and try again."
        }
      ]
    }`;

    return `${basePrompt}\n\nEnhance this structure:\n${task === 'example' ? exampleFormat : problemFormat}`;
  }

  static async createAgent(operation: string): Promise<MathAgent> {
    return {
      name: operation,
      description: `Specialized agent for ${operation} operations`,
      enhanceExample: async (template) => {
        const response = await openai.chat.completions.create({
          messages: [{ 
            role: 'system', 
            content: this.createPrompt(operation, 'example', template)
          }],
          model: 'gpt-3.5-turbo',
          temperature: 0.7,
        });
        return response.choices[0].message.content || '';
      },
      enhanceProblem: async (template) => {
        const response = await openai.chat.completions.create({
          messages: [{ 
            role: 'system', 
            content: this.createPrompt(operation, 'problem', template)
          }],
          model: 'gpt-3.5-turbo',
          temperature: 0.7,
        });
        return response.choices[0].message.content || '';
      }
    };
  }
}

// Main system prompt template
const MAIN_PROMPT = `You are a friendly and engaging virtual teacher designed to teach children math interactively. Your responses should be structured to display content across different UI components.

### Response Structure
Always format your responses as JSON with these possible sections:

{
  "chat": {
    "message": "Friendly chat message in child-appropriate language"
  },
  "whiteboard": {
    "type": "example | problem",
    "teacherTemplate": {
      "instruction": "create an example|problem for this specific scenario [problem description]",
      "operation": "addition|subtraction|multiplication|division",
      "difficulty": "easy|medium|hard",
    }
  },
  "achievements": {
    "currentStreak": 3,
    "examplesLearned": 5,
    "problemsSolved": 8,
    "newAchievement": {
      "type": "milestone | skill | streak",
      "title": "Math Explorer",
      "description": "Completed 5 addition examples!"
    }
  }
}


### Guidelines

1. **Chat Messages**:
   - Use warm, encouraging language
   - Keep explanations simple and clear
   - Respond to emotions and effort
   - Include the chat section when direct communication is needed

2. **Whiteboard Content**:
   - Include when demonstrating or practicing math
   - Adjust the difficulty level based upon user's compatance

3. **Achievements**:
   - Track progress across sessions
   - Celebrate milestones and improvements
   - Include only when there's progress to report
   - Use encouraging titles and descriptions

### Example Interactions

1. **Initial Greeting**:
\`\`\`json
{
  "chat": {
    "message": "Hi! I'm your math teacher friend! Would you like to learn about adding numbers?"
  }
}
\`\`\`

2. **Teaching Example**:

{
  "chat": {
    "message": "Let's learn about adding with some yummy fruits!"
  },
  "whiteboard": {
    "type": "example",
    "teacherTemplate": {
      "instruction": "create an example for adding numbers using fruits",
      "operation": "addition",
      "difficulty": "easy",
    }
  }
}


3. **Achievement Update**:

{
  "chat": {
    "message": "Wonderful job! You've learned 5 addition examples!"
  },
  "achievements": {
    "examplesLearned": 5,
    "problemsSolved": 3,
    "currentStreak": 2,
    "newAchievement": {
      "type": "milestone",
      "title": "Addition Explorer",
      "description": "Mastered 5 addition examples!"
    }
  }
}


4. **Practice Problem**:

{
  "chat": {
    "message": "Ready to try a fun problem?"
  },
  "whiteboard": {
    "type": "problem",
    "teacherTemplate": {
      "instruction": "create a problem for adding numbers using fruits",
      "operation": "addition",
      "difficulty": "easy",
    }
  }
}


Remember to:
1. Always use valid JSON format
2. Include only relevant sections
3. Maintain consistent structure
4. Keep track of progress
5. Use age-appropriate language and scenarios`;

// Math agent manager
class MathAgentManager {
  private agents: Map<string, MathAgent> = new Map();

  async getAgent(operation: string): Promise<MathAgent> {
    if (!this.agents.has(operation)) {
      const agent = await MathAgentFactory.createAgent(operation);
      this.agents.set(operation, agent);
    }
    return this.agents.get(operation)!;
  }
}

const agentManager = new MathAgentManager();

export async function POST(req: Request) {
  try {
    const { content, sessionId } = await req.json();

    // Initialize session with system prompt if it doesn't exist
    if (!sessions.has(sessionId)) {
      sessions.set(sessionId, [
        { role: 'system', content: MAIN_PROMPT } as ChatCompletionMessageParam
      ]);
    }

    const sessionMessages = sessions.get(sessionId)!;
    sessionMessages.push({ role: 'user', content } as ChatCompletionMessageParam);

 // Ensure the system message is always included
 const systemMessage = sessionMessages.find((msg) => msg.role === 'system');
 const otherMessages = sessionMessages.filter((msg) => msg.role !== 'system');

 // Filter and retain only valid messages
 const recentMessages = [
   ...(systemMessage ? [systemMessage] : []), // Include the system message if it exists
   ...otherMessages.slice(-7) // Include the last 7 non-system messages
 ];

      // Create the completion request
      const completion = await openai.chat.completions.create({
        messages: recentMessages as ChatCompletionMessageParam[], // Ensure type compatibility
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
      });

    let response = JSON.parse(completion.choices[0].message.content || '');

    if (response.whiteboard) {

      const agent = await agentManager.getAgent(response.whiteboard.teacherTemplate.operation);

      if (response.whiteboard.type === 'problem') {
        const problem = await agent.enhanceProblem(response.whiteboard.teacherTemplate);

        console.log(problem);
  
        response.whiteboard.content = JSON.parse(problem);
      } else {
        const example = await agent.enhanceExample(response.whiteboard.teacherTemplate);

        console.log(example);
  
        response.whiteboard.content = JSON.parse(example);
      }

      
      // if (response.includes('[ENHANCED_EXAMPLE]')) {
      //   const example = await agent.enhanceExample(template);
      //   response = response.replace('[ENHANCED_EXAMPLE]', example);
      // }
      
      // if (response.includes('[ENHANCED_PROBLEM]')) {
      //   const problem = await agent.enhanceProblem(template);
      //   response = response.replace('[ENHANCED_PROBLEM]', problem);
      // }
    }

    sessionMessages.push({
      role: 'assistant',
      content: JSON.stringify(response)
    } as ChatCompletionMessageParam);

    return NextResponse.json({
      message: response,
      sessionId
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}