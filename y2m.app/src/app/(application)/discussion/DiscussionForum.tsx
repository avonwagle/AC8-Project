// app/discussion/DiscussionForum.tsx
import React from 'react';
import Comments from '@/app/(application)/discussion/Comments'; // Updated import

interface Discussion {
  id: number;
  title: string;
  comments: { id: number; content: string }[];
}

interface DiscussionForumProps {
  discussions: Discussion[];
  onAddComment: (discussionId: number, content: string) => void;
}

const DiscussionForum: React.FC<DiscussionForumProps> = ({ discussions, onAddComment }) => {
  return (
    <div className="forum">
      {discussions.map((discussion) => (
        <div key={discussion.id} className="discussion-box">
          <h2>{discussion.title}</h2>
          <Comments
            comments={discussion.comments}
            onAddComment={(content) => onAddComment(discussion.id, content)}
          />
        </div>
      ))}
    </div>
  );
};

export default DiscussionForum;
