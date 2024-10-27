// pages/my-success-stories.tsx
'use client';
import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client'; // Import Auth0 useUser hook
import axios from 'axios';
import { LoadingSkeleton } from '@/components/common/loading-skeleton';
import { ErrorAlert } from '@/components/common/error-alert';

interface SuccessStory {
  id: number;
  mentorId: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function MySuccessStories() {
  const { user, error: userError, isLoading: userLoading } = useUser(); // Get the user from Auth0
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuccessStories = async () => {
      if (!user) return;

      try {
        const response = await axios.get('/api/my-success-stories');
        setSuccessStories(response.data);
      } catch (error) {
        setError('Failed to load success stories.');
        console.error('Error fetching success stories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuccessStories();
  }, [user]);

  if (userLoading) return <LoadingSkeleton />;
  if (userError) return <ErrorAlert message={userError.message} />;
  if (loading) return <div>Loading...</div>;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h2 className="mb-4 text-2xl font-bold">My Success Stories</h2>
      {successStories.length === 0 ? (
        <div>No success stories available.</div>
      ) : (
        <div className="grid gap-6">
          {successStories.map((story) => (
            <div key={story.id} className="rounded-lg bg-white p-4 shadow-lg">
              <h3 className="text-xl font-bold">{story.title}</h3>
              <p className="mt-2 text-gray-700">{story.content}</p>
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
