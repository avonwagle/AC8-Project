// AnswerForm.tsx
import React, { useState } from 'react';

interface AnswerFormProps {
  threadId: number;
  onAddAnswer: (threadId: number, newAnswer: { user: string; text: string }) => void;
}

const AnswerForm: React.FC<AnswerFormProps> = ({ threadId, onAddAnswer }) => {
  const [user, setUser] = useState('');
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAnswer(threadId, { user, text });
    setUser('');
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <input
        type="text"
        value={user}
        onChange={(e) => setUser(e.target.value)}
        placeholder="Your name"
        required
        className="mr-2" // margin-right to create space
      />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Your answer"
        required
        className="mr-2"
      />
      <button type="submit" className="ml-2">
        Submit Answer
      </button>
    </form>
  );
};

export default AnswerForm;
