// hooks/useMentorDetail.ts
'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useQuery } from '@tanstack/react-query';

const fetchMentorDetails = async (userId: string, mentorId: string) => {
  const response = await fetch(`/api/mentors/${mentorId}`, {
    headers: { 'X-User-Id': userId },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch mentor details');
  }

  return response.json();
};

export const useMentorDetail = (mentorId: string) => {
  const { user, isLoading: isUserLoading } = useUser();

  const { data, isLoading, error } = useQuery({
    queryKey: ['mentorDetail', mentorId],
    queryFn: () => fetchMentorDetails(user?.sub || '', mentorId),
    enabled: !!mentorId && !!user?.sub && !isUserLoading,
  });

  return {
    mentor: data?.mentor,
    skills: data?.skills,
    education: data?.education,
    reviews: data?.reviews,
    isLoading: isLoading || isUserLoading,
    error,
  };
};
