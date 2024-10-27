'use client';

import { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client'; // Import Auth0 useUser hook
import axios from 'axios';

export default function MentorSuccessStories() {
  const { user, error: userError, isLoading: userLoading } = useUser(); // Get the user from Auth0
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Get the user ID from Auth0 (sub field)
  const userId = user?.sub;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      alert('User not authenticated');
      return;
    }

    try {
      const response = await axios.post('/api/submit-success-stories', {
        mentorId: userId, // Pass the authenticated user ID (from Auth0) as mentorId
        title,
        content,
      });

      if (response.status === 201) {
        alert('Success story submitted for review.');
        setShowModal(false);
        setTitle(''); // Clear the form after successful submission
        setContent('');
      } else {
        alert('Failed to submit success story.');
      }
    } catch (error) {
      console.error('Error submitting success story:', error);
      alert('Failed to submit success story.');
    }
  };

  // Handle loading and error states
  if (userLoading) return <div>Loading...</div>;
  if (userError) return <div>Error: {userError.message}</div>;

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-48 rounded-lg bg-green-600 p-3 font-semibold text-white transition duration-300 hover:bg-green-700"
      >
        Submit Success Story
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-xl font-bold text-gray-800">Submit Success Story</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mb-4 w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
              <textarea
                placeholder="Write your story here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mb-4 w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                rows={4}
                required
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-green-600 p-3 font-semibold text-white transition duration-300 hover:bg-green-700"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="mt-2 w-full text-gray-500 transition duration-300 hover:text-gray-700"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
