import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful and friendly teacher. Keep your responses concise and engaging for students.'
        },
        {
          role: 'user',
          content
        }
      ],
      model: 'gpt-3.5-turbo',
    });

    // Generate speech from the response
    const speechResponse = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: completion.choices[0].message.content || '',
    });

    // Convert audio buffer to base64
    const audioBuffer = await speechResponse.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');

    return NextResponse.json({
      message: completion.choices[0].message.content,
      audioBase64
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 