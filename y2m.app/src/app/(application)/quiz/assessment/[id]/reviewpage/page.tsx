'use client';
import { useParams, useSearchParams, useRouter } from 'next/navigation'; // Correct imports
import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client'; // Assuming you're using Auth0 for user data
import { Button } from '@/components/ui/button'; // Ensure this is the correct import for your Button component

interface ReviewData {
  questionText: string;
  questionType: string;
  selectedOptionId?: number;
  selectedOptionText?: string;
  shortAnswerText?: string;
  correctOptionText?: string;
  isCorrect: boolean;
}

const ReviewPage = () => {
  const { id: assessmentId } = useParams(); // Fetch assessmentId from dynamic URL
  const searchParams = useSearchParams();
  const { user, isLoading: isUserLoading } = useUser(); // Fetch user data from Auth0
  const userId = searchParams.get('userId') || user?.sub; // Use userId from query or fallback to user.sub

  const [reviewData, setReviewData] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Correct hook for Next.js 13+

  useEffect(() => {
    if (isUserLoading) return; // Wait for user data to load

    console.log('Assessment ID:', assessmentId);
    console.log('User ID:', userId);

    if (!assessmentId || !userId) {
      setError('Assessment ID or User ID is missing.');
      setLoading(false);
      return;
    }

    const fetchReviewData = async () => {
      try {
        const res = await fetch(`/api/review?assessmentId=${assessmentId}&userId=${userId}`);

        if (!res.ok) {
          throw new Error('Failed to fetch review data');
        }

        const data = await res.json();
        setReviewData(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load review data');
      } finally {
        setLoading(false);
      }
    };

    fetchReviewData();
  }, [assessmentId, userId, isUserLoading]);

  const handleBackToAssessments = () => {
    // Navigate back to the skill assessments page
    router.push('/quiz');
  };

  if (loading || isUserLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Review Assessment</h1>
      {reviewData.length === 0 ? (
        <p className="text-gray-500">No review data available.</p>
      ) : (
        reviewData.map((question, index) => (
          <div key={index} className="mb-8 rounded-lg bg-gray-100 p-4">
            <h2 className="text-lg font-semibold">Question: {question.questionText}</h2>
            <p className="mt-2">
              <strong>Your Answer: </strong>
              {question.questionType === 'SHORT_ANSWER'
                ? question.shortAnswerText || 'Not Applicable'
                : question.selectedOptionText || 'Not Applicable'}
            </p>
            <p className="mt-2">
              <strong>Correct Answer: </strong>
              {question.correctOptionText || 'Not Applicable'}
            </p>
            <p
              className={`mt-2 font-semibold ${
                question.isCorrect ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {question.isCorrect ? 'Your answer is correct' : 'Your answer is incorrect'}
            </p>
          </div>
        ))
      )}

      {/* Back to Skill Assessments Button */}
      <div className="mt-8">
        <Button onClick={handleBackToAssessments} className="w-60 bg-green-600 text-white">
          Back to Skill Assessments
        </Button>
      </div>
    </div>
  );
};

export default ReviewPage;
