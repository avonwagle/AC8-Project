'use client';
import { useParams, useSearchParams } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import CertificateCard from '@/components/certificate/certificatecard';
import MainSection from '@/components/common/main-section';
import MainSectionBody from '@/components/common/main-section-body';

const QuizResultPage = () => {
  const { id: assessmentIdParam } = useParams(); // Grabbing assessmentId from params
  const searchParams = useSearchParams();
  const scoreParam = searchParams.get('score');
  const score = scoreParam ? parseInt(scoreParam, 10) : null;
  const passed = searchParams.get('passed') === 'true';

  const { user, isLoading: authLoading } = useUser();
  const userId = user?.sub;

  const [certificateGenerated, setCertificateGenerated] = useState(false);
  const [assessmentTitle, setAssessmentTitle] = useState<string>(''); // State for the assessment title

  // Convert assessmentId to a string, handle array case
  const assessmentId = Array.isArray(assessmentIdParam) ? assessmentIdParam[0] : assessmentIdParam;

  // Fetch assessment title based on the assessmentId
  useEffect(() => {
    async function fetchAssessmentTitle() {
      try {
        const response = await fetch(`/api/assessment/${assessmentId}`); // Fetch the assessment details based on the id
        const data = await response.json();

        // Log data for debugging
        console.log('Assessment data:', data);

        // If title is present in the response, set it, otherwise default to 'Unknown Assessment'
        if (data && data.assessment && data.assessment.title) {
          setAssessmentTitle(data.assessment.title); // Use the fetched assessment title
        } else {
          setAssessmentTitle('Unknown Assessment');
        }
      } catch (error) {
        console.error('Failed to fetch assessment details:', error);
        setAssessmentTitle('Unknown Assessment'); // Default in case of error
      }
    }

    if (assessmentId) {
      fetchAssessmentTitle(); // Fetch assessment title when assessmentId is available
    }
  }, [assessmentId]); // Depend on assessmentId to refetch when the id changes

  useEffect(() => {
    if (score !== null && passed) {
      setCertificateGenerated(true);
    } else {
      setCertificateGenerated(false);
    }
  }, [score, passed]);

  if (score === null || isNaN(score)) {
    return <div>Invalid score. Please try again.</div>;
  }

  if (authLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <MainSection>
        <MainSectionBody>
          <h1 className="text-2xl font-bold">Quiz Results</h1>
        </MainSectionBody>
      </MainSection>

      <div className="-mt-20 flex min-h-screen flex-col items-center justify-center">
        <p>Your score: {score}</p>

        {passed ? (
          <>
            <p>Congratulations! You passed the quiz.</p>

            {certificateGenerated && (
              <div className="mt-4">
                <CertificateCard
                  title={assessmentTitle} // Use the dynamic assessment title here
                  issuedAt={new Date().toLocaleDateString()}
                  userName={user?.name || 'Anonymous'}
                  resultId={assessmentId ?? ''} // Ensure that resultId is a string
                />
              </div>
            )}

            <div className="mt-20 flex justify-center space-x-4">
              <Link href="/quiz/certificates">
                <Button className="w-60 bg-green-600 text-white">View All Certificates</Button>
              </Link>
              <Link href="/quiz">
                <Button className="w-60 bg-green-600 text-white">Back to Skill Assessments</Button>
              </Link>
              <Link href={`/quiz/assessment/${assessmentId}/reviewpage?userId=${userId}`}>
                <Button className="w-60 bg-green-600 text-white">Review</Button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <p>Sorry, you did not pass. Try again!</p>

            <div className="mt-20 flex justify-center space-x-4">
              <Link href="/quiz">
                <Button className="w-60 bg-green-500 text-white">Back to Skill Assessments</Button>
              </Link>
              <Link href={`/quiz/assessment/${assessmentId}/reviewpage?userId=${userId}`}>
                <Button className="w-60 bg-green-500 text-white">Review</Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default QuizResultPage;
