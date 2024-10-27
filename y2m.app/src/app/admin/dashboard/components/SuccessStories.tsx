import React, { useEffect, useState } from 'react';

interface SuccessStory {
  id: number;
  mentorId: string;
  title: string;
  content: string;
  isApproved: boolean | null; // null represents "Pending", true for "Approved", false for "Rejected"
}

const SuccessStories: React.FC = () => {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [rejectedStories, setRejectedStories] = useState<number[]>([]); // To track manually rejected stories

  useEffect(() => {
    fetchSuccessStories();
  }, []);

  const fetchSuccessStories = async () => {
    try {
      const response = await fetch('/api/admin/success-stories'); // Adjust your API endpoint accordingly
      const data = await response.json();
      if (data.success) {
        setStories(data.stories);
      } else {
        console.error('Failed to fetch success stories:', data.message);
      }
    } catch (error) {
      console.error('Error fetching success stories:', error);
    }
  };

  const handleApproval = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/success-stories/${id}`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to approve story');

      // Update the story's approval status in the local state after successful response
      setStories((prevStories) =>
        prevStories.map((story) => (story.id === id ? { ...story, isApproved: true } : story))
      );

      // Remove the story from the rejectedStories list to ensure "Rejected" isn't shown
      setRejectedStories((prevRejected) => prevRejected.filter((storyId) => storyId !== id));
    } catch (error) {
      console.error('Error approving story:', error);
    }
  };

  const handleRejection = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/success-stories/${id}/reject`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to reject story');

      // Update the story's approval status in the local state after successful response
      setStories((prevStories) =>
        prevStories.map((story) => (story.id === id ? { ...story, isApproved: false } : story))
      );

      // Add the story to the rejectedStories list
      setRejectedStories([...rejectedStories, id]);
    } catch (error) {
      console.error('Error rejecting story:', error);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h2 className="mb-6 text-3xl font-bold text-gray-800">Success Stories</h2>
      <ul className="space-y-6">
        {stories.map((story) => (
          <li key={story.id} className="rounded-lg border bg-white p-6 shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-800">{story.title}</h3>
            <p className="mt-4 text-gray-600">{story.content}</p>
            <div className="mt-6 flex items-center">
              <button
                onClick={() => handleApproval(story.id)}
                className="mr-4 rounded bg-green-600 px-4 py-2 font-semibold text-white transition duration-300 hover:bg-green-700"
              >
                Approve
              </button>
              <button
                onClick={() => handleRejection(story.id)}
                className="rounded bg-red-600 px-4 py-2 font-semibold text-white transition duration-300 hover:bg-red-700"
              >
                Reject
              </button>
            </div>
            {/* Render status only if approved and not rejected */}
            {story.isApproved === true && !rejectedStories.includes(story.id) && (
              <span className="ml-4 mt-4 inline-block text-sm font-medium text-green-600">
                Approved
              </span>
            )}
            {/* Render status only if rejected manually */}
            {rejectedStories.includes(story.id) && story.isApproved === false && (
              <span className="ml-4 mt-4 inline-block text-sm font-medium text-red-600">
                Rejected
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SuccessStories;
