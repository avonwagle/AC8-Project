// Example of your API route in `/app/api/discussion/route.ts`

import { NextResponse } from 'next/server';
import { Thread, Answer } from '@/app/api/discussion/types'; // Adjust path as necessary

const discussions: Thread[] = []; // In-memory storage for simplicity

export async function GET() {
  return NextResponse.json(discussions);
}

export async function POST(request: Request) {
  const newThread: { user: string; text: string } = await request.json();

  // Basic validation
  if (!newThread.user || !newThread.text) {
    return NextResponse.json({ message: 'User and text are required' }, { status: 400 });
  }

  const createdThread: Thread = {
    id: discussions.length + 1, // Ensure unique thread ID
    user: newThread.user,
    text: newThread.text,
    answers: [],
  };

  discussions.push(createdThread);
  return NextResponse.json(createdThread, { status: 201 }); // Created status
}

export async function PUT(request: Request) {
  const { threadId, newAnswer }: { threadId: number; newAnswer: { user: string; text: string } } =
    await request.json();

  // Basic validation
  if (!newAnswer.user || !newAnswer.text) {
    return NextResponse.json({ message: 'User and text are required' }, { status: 400 });
  }

  const threadIndex = discussions.findIndex((thread) => thread.id === threadId);
  if (threadIndex === -1) {
    return NextResponse.json({ message: 'Thread not found' }, { status: 404 });
  }

  const answer: Answer = {
    id: discussions[threadIndex].answers.length + 1, // Ensure unique answer ID (consider revising this)
    user: newAnswer.user,
    text: newAnswer.text,
  };

  discussions[threadIndex].answers.push(answer);
  return NextResponse.json(discussions[threadIndex], { status: 200 }); // OK status
}
