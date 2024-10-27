import { useQuery } from '@tanstack/react-query';

interface MentorFilters {
  specialization: string[];
  availability: string[];
  price: number[];
  country: string[];
  rating: number[];
}

const fetchMentorFilters = async (): Promise<MentorFilters> => {
  const response = await fetch('/api/mentors/filters');
  if (!response.ok) throw new Error('Failed to fetch filter options');
  return response.json();
};

export const useMentorFilters = () => {
  const { data, isLoading, error } = useQuery<MentorFilters, Error>({
    queryKey: ['mentorFilters'],
    queryFn: fetchMentorFilters,
  });

  // Provide default structure for the filters
  const defaultFilters: MentorFilters = {
    specialization: [],
    availability: [],
    price: [],
    country: [],
    rating: [],
  };

  return {
    filters: data || defaultFilters, // Use defaultFilters when data is not available
    isLoading,
    error,
  };
};
