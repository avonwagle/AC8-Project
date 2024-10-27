'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client'; // Import Auth0 useUser hook
import SkillAssessment from '@/components/quiz/skill_assessment';
import MainSection from '@/components/common/main-section';
import MainSectionBody from '@/components/common/main-section-body';
import Title from '@/components/common/title';

interface Assessment {
  id: number;
  title: string;
  description: string;
  objective: string;
  duration: number;
}

interface Category {
  id: number;
  name: string;
}

interface AssessmentsByCategory {
  [categoryName: string]: Assessment[];
}

const AssessmentPage = () => {
  const { user, error: userError, isLoading: userLoading } = useUser(); // Get the user from Auth0
  const [assessmentsByCategory, setAssessmentsByCategory] = useState<AssessmentsByCategory>({}); // Store fetched assessments by category
  const [categories, setCategories] = useState<Category[]>([]); // Store fetched categories
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // Store selected category
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Fetch assessments from the API
  useEffect(() => {
    async function fetchAssessments() {
      if (!user) return; // If the user is not authenticated, don't fetch assessments

      const userId = user?.sub ?? ''; // Auth0's user ID is typically in the `sub` field

      try {
        const response = await fetch('/api/assessment', {
          headers: {
            'Content-Type': 'application/json',
            userId: userId, // Pass the authenticated user ID
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch assessments');
        }

        const data = await response.json(); // Parse the response
        if (data.success) {
          setAssessmentsByCategory(data.assessments); // Set assessments to state, grouped by category
        } else {
          throw new Error(data.message || 'Failed to fetch assessments');
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message); // Properly access the error message
        } else {
          setError('An unexpected error occurred'); // Fallback for non-Error instances
        }
        console.error('Error fetching assessments:', error); // Handle fetch error
      } finally {
        setLoading(false); // Stop loading regardless of success or error
      }
    }

    fetchAssessments();
  }, [user]); // Fetch when the user is authenticated

  // Fetch categories for the filter dropdown
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories'); // API to fetch categories
        const data = await response.json();
        if (data.success) {
          setCategories(data.categories); // Set categories to state
        } else {
          throw new Error(data.message || 'Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }

    fetchCategories();
  }, []);

  // Handle category selection change
  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
  };

  if (userLoading) return <div>Loading user data...</div>; // Show loading if user data is being fetched
  if (userError) return <div>Error loading user data: {userError.message}</div>; // Handle user error

  // If loading assessments, show a loading message
  if (loading) return <div>Loading assessments...</div>;

  // If there is an error in fetching assessments, show the error message
  if (error) return <div>Error: {error}</div>;

  // Filter assessments by selected category
  const filteredAssessments = selectedCategory
    ? { [selectedCategory]: assessmentsByCategory[selectedCategory] }
    : assessmentsByCategory;

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 py-8 dark:from-gray-900 dark:to-gray-800 sm:px-6 lg:px-8">
      <MainSection>
        <MainSectionBody className="space-y-6">
          <div className="space-y-6 md:w-1/2">
            <Title>Skill Assessments</Title>
          </div>
          <h2>
            Choose a quiz, get instant feedback, and earn a certificate to showcase your skills!
          </h2>

          {/* Filter dropdown for category styled like button */}
          <div className="mt-4 flex items-center">
            <label
              htmlFor="categoryFilter"
              className="mr-4 block text-sm font-medium text-gray-700"
            >
              Filter by Category
            </label>
            <select
              id="categoryFilter"
              className="rounded-md border border-gray-300 bg-green-600 px-4 py-2 shadow-sm transition duration-150 ease-in-out hover:border-green-400 hover:bg-blue-400 focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
              value={selectedCategory ?? ''}
              onChange={handleCategoryChange}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </MainSectionBody>
      </MainSection>

      {/* Display assessments by category */}
      {Object.keys(filteredAssessments).map((categoryName) => (
        <div key={categoryName} className="mt-8">
          <h3 className="text-2xl font-bold">{categoryName}</h3>
          <div className="mt-4 grid gap-8 lg:grid-cols-2">
            {filteredAssessments[categoryName]?.map((assessment) => (
              <SkillAssessment
                key={assessment.id}
                title={assessment.title}
                count={assessment.duration} // Display the duration
                learnMoreHref={`/quiz/assessment/${assessment.id}`} // Link to assessment details page
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AssessmentPage;
