'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface SuccessStory {
  id: number;
  mentorId: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function SuccessStoriesList() {
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the success stories when the component is mounted
  useEffect(() => {
    const fetchSuccessStories = async () => {
      try {
        const response = await axios.get('/api/view-success-stories');
        setSuccessStories(response.data); // Set the success stories data
      } catch (error) {
        setError('Failed to load success stories.');
        console.error('Error fetching success stories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuccessStories();
  }, []);

  if (loading) return <div>Loading success stories...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Mentor Success Stories</h2>
      {successStories.length === 0 ? (
        <div className="text-gray-600">No success stories available.</div>
      ) : (
        <div className="grid gap-6">
          {successStories.map((story) => (
            <div
              key={story.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg"
            >
              <h3 className="text-xl font-semibold text-gray-900">{story.title}</h3>
              <p className="mt-3 text-gray-700">{story.content}</p>
              <p className="mt-4 text-sm text-gray-500">
                Posted on {new Date(story.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
