import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json(); // Fetching the prompt from the request body

    if (!prompt) {
      return NextResponse.json({ message: 'Prompt is required' }, { status: 400 });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Ensure your API key is stored in .env
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // Or 'gpt-4' if you have access
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json({ message: data.choices[0].message.content });
    } else {
      return NextResponse.json({ message: data.error.message }, { status: response.status });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
