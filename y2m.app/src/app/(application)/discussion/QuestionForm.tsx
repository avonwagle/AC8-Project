// QuestionForm.tsx
import React, { useState } from 'react';

interface QuestionFormProps {
  onAddQuestion: (newThread: { user: string; text: string }) => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ onAddQuestion }) => {
  const [user, setUser] = useState('');
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user && text) {
      onAddQuestion({ user, text });
      setText(''); // Clear the text field after submission
      setUser(''); // Clear the user field after submission
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-700" htmlFor="user">
          Your name
        </label>
        <input
          type="text"
          id="user"
          placeholder="Your name"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700" htmlFor="question">
          Write your question...
        </label>
        <textarea
          id="question"
          placeholder="Write your question..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
        />
      </div>

      <button
        type="submit"
        className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Submit Question
      </button>
    </form>
  );
};

export default QuestionForm;
