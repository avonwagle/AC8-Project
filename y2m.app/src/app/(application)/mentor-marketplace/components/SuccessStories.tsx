// components/SuccessStories.tsx
import { useEffect, useState } from 'react';
import { format } from 'date-fns';

interface SuccessStory {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

interface SuccessStoriesProps {
  mentorId: string;
}

const SuccessStories: React.FC<SuccessStoriesProps> = ({ mentorId }) => {
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuccessStories = async () => {
      try {
        const response = await fetch(`/api/success-stories/${mentorId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch success stories');
        }
        const data = await response.json();
        setSuccessStories(data);
      } catch (err) {
        // Check if err is an instance of Error
        if (err instanceof Error) {
          setError(err.message); // Set the error message
        } else {
          setError('An unknown error occurred'); // Fallback for unknown error types
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSuccessStories();
  }, [mentorId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-8 w-full rounded-lg bg-white p-8 shadow-md">
      <h3 className="mb-4 text-xl font-bold">My Success Stories</h3>
      {successStories.length === 0 ? (
        <p>No success stories available.</p>
      ) : (
        successStories.map((story) => (
          <div key={story.id} className="mb-4 rounded-md border p-4">
            <h4 className="text-lg font-semibold">{story.title}</h4>
            <p className="text-gray-700">{story.content}</p>
            <p className="text-sm text-gray-500">{format(new Date(story.createdAt), 'PPP')}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default SuccessStories;
