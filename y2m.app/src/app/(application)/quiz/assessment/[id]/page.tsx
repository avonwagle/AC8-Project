'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Use useParams instead of useRouter for dynamic route
import MainSection from '@/components/common/main-section';
import MainSectionBody from '@/components/common/main-section-body';
import Title from '@/components/common/title';
import { Button } from '@/components/ui/button';
import Link from 'next/link'; // Make sure Link is imported for client-side navigation

interface Assessment {
  id: number;
  title: string;
  description: string;
  objective: string;
  duration: number;
}

const AssessmentDetailsPage = () => {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams(); // Get the dynamic route parameters
  const id = params.id; // Extract the 'id' from params

  // Fetch assessment details based on the ID
  useEffect(() => {
    const fetchAssessmentDetails = async (id: string | string[] | undefined) => {
      try {
        const response = await fetch(`/api/assessment/${id}`);
        const data = await response.json();
        if (data.success) {
          setAssessment(data.assessment);
        } else {
          setError('Failed to fetch assessment details');
        }
      } catch (error) {
        setError('Error fetching assessment details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAssessmentDetails(id); // Call the function only when the ID is available
    }
  }, [id]);

  if (loading) return <div>Loading assessment details...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 py-8 dark:from-gray-900 dark:to-gray-800 sm:px-6 lg:px-8">
      {assessment && (
        <MainSection>
          <MainSectionBody className="space-y-6">
            <div className="space-y-6 md:w-1/2">
              <Title>{assessment.title}</Title>
            </div>
            <div>
              <p>
                <strong>Description:</strong> {assessment.description}
              </p>
              <p>
                <strong>Objective:</strong> {assessment.objective}
              </p>
              <p>
                <strong>Duration:</strong> {assessment.duration} minutes
              </p>
            </div>
          </MainSectionBody>

          {/* Button to start quiz */}
          <div className="mt-8">
            <Link href={`/quiz/assessment/${id}/questions`} passHref>
              <Button className="bg-green-600 text-white">Start Quiz</Button>
            </Link>
          </div>
          {/* Go Back Button */}
          <div className="mt-8">
            <Link href="/quiz" passHref>
              <Button variant="outline" className="bg-green-600 text-white">
                Go Back to All Assessments
              </Button>
            </Link>
          </div>
        </MainSection>
      )}
    </div>
  );
};

export default AssessmentDetailsPage;
