'use client'; // Ensures this component is a client-side component

import { useState, useEffect } from 'react';
import SkillAssement from '@/components/quiz/skill_assessment';
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

const AssessmentPage = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]); // Store fetched assessments
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  // Fetch assessments from the API
  useEffect(() => {
    async function fetchAssessments() {
      try {
        const response = await fetch('/api/assessment'); // API endpoint to get assessments
        const data = await response.json(); // Parse the response
        if (data.success) {
          setAssessments(data.assessments); // Set assessments to state
        } else {
          console.error('Failed to fetch assessments:', data.message); // Log error if failed
        }
      } catch (error) {
        console.error('Error fetching assessments:', error); // Handle fetch error
      } finally {
        setLoading(false); // Stop loading regardless of success or error
      }
    }

    fetchAssessments();
  }, []); // Empty dependency array to run the effect only once on mount

  // If loading, show a loading message
  if (loading) return <div>Loading assessments...</div>;

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
        </MainSectionBody>
      </MainSection>

      {/* Assessment list */}
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {assessments.length === 0 ? (
          <p>No assessments available at the moment.</p>
        ) : (
          assessments.map((assessment) => (
            <SkillAssement
              key={assessment.id}
              title={assessment.title}
              count={assessment.duration}
              learnMoreHref={`/quiz/assessment/${assessment.id}`}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AssessmentPage;
