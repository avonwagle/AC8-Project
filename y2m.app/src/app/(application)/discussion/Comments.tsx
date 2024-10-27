// app/discussion/Comments.tsx
import React, { useState } from 'react';

interface CommentsProps {
  comments: { id: number; content: string }[];
  onAddComment: (content: string) => void;
}

const Comments: React.FC<CommentsProps> = ({ comments, onAddComment }) => {
  const [commentInput, setCommentInput] = useState('');

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentInput.trim()) {
      onAddComment(commentInput.trim());
      setCommentInput(''); // Clear the input after submission
    }
  };

  return (
    <div style={{ marginTop: '10px' }}>
      <form onSubmit={handleCommentSubmit}>
        <input
          type="text"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          placeholder="Add a comment..."
          required
        />
        <button type="submit">Submit</button>
      </form>
      <ul className="comments-list">
        {comments.map((comment) => (
          <li key={comment.id}>{comment.content}</li>
        ))}
      </ul>
    </div>
  );
};

export default Comments;
