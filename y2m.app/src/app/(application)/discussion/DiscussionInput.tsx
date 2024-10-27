// app/discussion/DiscussionInput.tsx
import React, { useState } from 'react';

interface DiscussionInputProps {
  handleAddDiscussion: (title: string) => void;
}

const DiscussionInput: React.FC<DiscussionInputProps> = ({ handleAddDiscussion }) => {
  const [discussionTitle, setDiscussionTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (discussionTitle.trim()) {
      handleAddDiscussion(discussionTitle.trim());
      setDiscussionTitle(''); // Clear the input after submission
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={discussionTitle}
        onChange={(e) => setDiscussionTitle(e.target.value)}
        placeholder="Add a new discussion..."
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default DiscussionInput;
