import { useUser } from '@auth0/nextjs-auth0/client';
import { useQuery } from '@tanstack/react-query';
import { User } from '@/types/db';

const fetchMentors = async (): Promise<User[]> => {
  const response = await fetch(`/api/mentors`);
  if (!response.ok) throw new Error('Failed to fetch mentors');
  return response.json();
};

export const useMentors = () => {
  const { user } = useUser();

  const { data, isLoading, error } = useQuery<User[], Error>({
    queryKey: ['mentors'],
    queryFn: fetchMentors,
    enabled: !!user?.sub,  // Only run the query if the user is authenticated
  });

  return {
    mentors: data || [],
    isLoading,
    error,
  };
};
