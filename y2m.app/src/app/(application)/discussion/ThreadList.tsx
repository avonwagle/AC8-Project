// ThreadList.tsx
import React from 'react';
import { Thread, Answer } from '@/app/api/discussion/types'; // Adjust path as necessary
import AnswerForm from './AnswerForm'; // Import AnswerForm component if you have one

interface ThreadListProps {
  threads: Thread[];
  onAddAnswer: (threadId: number, newAnswer: { user: string; text: string }) => void;
}

const ThreadList: React.FC<ThreadListProps> = ({ threads, onAddAnswer }) => {
  return (
    <div>
      {threads.map((thread) => (
        <div key={thread.id} className="thread">
          <h3>
            {thread.text} (by {thread.user})
          </h3>
          <div>
            {thread.answers.map((answer: Answer) => (
              <div key={answer.id} className="answer">
                <p>
                  {answer.text} (by {answer.user})
                </p>
              </div>
            ))}
          </div>
          {/* Assuming AnswerForm is a component to submit answers */}
          <AnswerForm threadId={thread.id} onAddAnswer={onAddAnswer} />
        </div>
      ))}
    </div>
  );
};

export default ThreadList;
