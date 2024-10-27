'use client'; // Ensure client-side rendering

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client'; // Fetch user data using Auth0
import MainSection from '@/components/common/main-section';
import MainSectionBody from '@/components/common/main-section-body';
import Title from '@/components/common/title';
import { Button } from '@/components/ui/button';

interface Option {
  id: number;
  text: string;
}

interface Question {
  id: number;
  text: string;
  type: string;
  options: Option[];
}

interface Quiz {
  assessmentTitle: string;
  questions: Question[];
}

const QuizPage = () => {
  const { user } = useUser(); // Get user from Auth0
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const params = useParams();
  const router = useRouter();
  const assessmentId = params.id; // Fetch assessment ID from URL

  // Fetch Quiz Data
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await fetch(`/api/quiz?id=${assessmentId}`);
        const data = await response.json();

        if (data.success) {
          setQuiz(data.quiz);
        } else {
          setError(data.message || 'Failed to load quiz');
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
        setError('Error fetching quiz');
      } finally {
        setLoading(false);
      }
    };

    if (assessmentId) {
      fetchQuizData();
    }
  }, [assessmentId]);

  // Handle answer selection
  const handleAnswerChange = (questionId: number, optionId: number) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: optionId,
    }));
  };

  // Submit Quiz
  const handleSubmitQuiz = async () => {
    if (!user?.sub) {
      console.error('User is not authenticated.');
      return;
    }

    try {
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assessmentId: assessmentId,
          answers: userAnswers,
          userId: user.sub, // Authenticated user ID from Auth0
        }),
      });

      const resultData = await response.json();

      if (resultData.success) {
        // Redirect to result page with the score
        router.push(`/quiz/assessment/${assessmentId}/result?score=${resultData.score}`);
      } else {
        console.error('Failed to submit quiz:', resultData.message);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  if (loading) return <div>Loading quiz...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {quiz && (
        <MainSection>
          <MainSectionBody className="space-y-6">
            <div className="space-y-6 md:w-1/2">
              <Title>{quiz.assessmentTitle}</Title>
            </div>
            <div>
              {quiz.questions.map((question: Question, index: number) => (
                <div key={question.id} className="my-4">
                  <p>
                    <strong>Question {index + 1}:</strong> {question.text}
                  </p>
                  <div className="mt-2">
                    {question.options.map((option: Option) => (
                      <div key={option.id} className="flex items-center">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          id={`option-${question.id}-${option.id}`}
                          onChange={() => handleAnswerChange(question.id, option.id)}
                          checked={userAnswers[question.id] === option.id}
                        />
                        <label htmlFor={`option-${question.id}-${option.id}`} className="ml-2">
                          {option.text}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </MainSectionBody>
          <div className="mt-8">
            <Button className="bg-blue-500 text-white" onClick={handleSubmitQuiz}>
              Submit Quiz
            </Button>
          </div>
        </MainSection>
      )}
    </div>
  );
};

export default QuizPage;
