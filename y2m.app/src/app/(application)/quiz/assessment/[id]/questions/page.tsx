'use client';

import { useRouter, useParams } from 'next/navigation'; // Use useParams to get assessmentId from the path
import { useState, useEffect, useMemo } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client'; // Correct import for useUser

interface Question {
  id: number;
  text: string;
  questionType: string;
  options: Option[];
}

interface Option {
  id: number;
  text: string;
}

const QuestionsPage = () => {
  const router = useRouter();
  const { id: assessmentId } = useParams(); // Get assessmentId from the URL path
  const duration = 600; // Duration logic for the timer

  // Log assessmentId to check if it's retrieved correctly
  console.log('Assessment ID:', assessmentId);

  const { user, isLoading: userLoading } = useUser();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ [questionId: number]: number | string }>({});
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const [formError, setFormError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const questionsPerPage = 5;
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const totalQuestions = questions.length;
  const answeredQuestions = Object.keys(answers).length;
  const progressPercentage =
    totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;

  // Fetch the questions based on the assessmentId
  useEffect(() => {
    if (!assessmentId) {
      setError('Assessment ID not found.');
      setLoading(false);
      return;
    }

    const fetchQuestions = async () => {
      try {
        const res = await fetch(`/api/questions?assessmentId=${assessmentId}`);

        if (!res.ok) {
          throw new Error(`Failed to fetch questions. Status: ${res.status}`);
        }

        const data: Question[] = await res.json();
        console.log('Fetched questions:', data);

        const shuffledQuestions = shuffleArray(
          data.map((question: Question) => ({
            ...question,
            options: shuffleArray(question.options), // Shuffle options for each question
          }))
        );

        setQuestions(shuffledQuestions); // Set state with fetched questions
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [assessmentId]);

  // Timer logic for countdown
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Shuffle array utility function with generic type
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  // Handle multiple-choice or true/false option selection
  const handleOptionChange = (questionId: number, optionId: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  // Handle short answer input
  const handleShortAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Handle form submission and validate answers
  const handleSubmit = async () => {
    const unansweredQuestions = questions.filter((question) => {
      if (question.questionType === 'SHORT_ANSWER') {
        return !(question.id in answers && answers[question.id] !== '');
      }
      return !(question.id in answers);
    });

    if (unansweredQuestions.length > 0) {
      setFormError('Please answer all questions before submitting.');
      return;
    }

    setFormError(null);

    if (!user || userLoading) {
      setFormError('User not authenticated. Please log in.');
      return;
    }

    const userId = user.sub; // Auth0 User ID

    try {
      const res = await fetch(`/api/assessment/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentId,
          answers,
          userId,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        router.push(
          `/quiz/assessment/${assessmentId}/result?score=${result.score}&passed=${result.passed}`
        );
      } else {
        setFormError('Error submitting answers. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting answers:', err);
      setFormError('An error occurred during submission.');
    }
  };

  // Time formatting utility function
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Memoized paginated questions for optimization
  const getPaginatedQuestions = useMemo(() => {
    const startIndex = currentPage * questionsPerPage;
    return questions.slice(startIndex, startIndex + questionsPerPage);
  }, [currentPage, questions]);

  // Pagination: go to the previous page
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Pagination: go to the next page
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Handle loading and error states
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Assessment Questions</h1>
        <div className="text-lg font-semibold text-red-600">Time Left: {formatTime(timeLeft)}</div>
      </div>

      <div className="mb-6 h-4 w-full rounded-full bg-gray-200">
        <div
          className="h-4 rounded-full bg-green-600 text-center text-white"
          style={{ width: `${progressPercentage}%` }}
        >
          {progressPercentage}% Completed
        </div>
      </div>

      {formError && <div className="mb-4 text-red-500">{formError}</div>}

      {getPaginatedQuestions.map((question: Question, index) => (
        <div key={question.id} className="mb-6">
          <h2 className="text-lg font-semibold">
            Question {currentPage * questionsPerPage + index + 1}: {question.text}
          </h2>

          {question.questionType === 'MULTIPLE_CHOICE' &&
            question.options.map((option: Option) => (
              <div key={option.id} className="mt-2">
                <input
                  type="radio"
                  id={`option-${option.id}`}
                  name={`question-${question.id}`}
                  value={option.id}
                  checked={answers[question.id] === option.id}
                  onChange={() => handleOptionChange(question.id, option.id)}
                  className="mr-2"
                />
                <label htmlFor={`option-${option.id}`}>{option.text}</label>
              </div>
            ))}

          {question.questionType === 'TRUE_FALSE' &&
            question.options.map((option: Option) => (
              <div key={option.id} className="mt-2">
                <input
                  type="radio"
                  id={`option-${option.id}`}
                  name={`question-${question.id}`}
                  value={option.id}
                  checked={answers[question.id] === option.id}
                  onChange={() => handleOptionChange(question.id, option.id)}
                  className="mr-2"
                />
                <label htmlFor={`option-${option.id}`}>{option.text}</label>
              </div>
            ))}

          {question.questionType === 'SHORT_ANSWER' && (
            <textarea
              value={answers[question.id] || ''}
              onChange={(e) => handleShortAnswerChange(question.id, e.target.value)}
              placeholder="Enter your answer"
              className="mt-2 w-full rounded border border-gray-300 p-2"
            />
          )}
        </div>
      ))}

      <div className="flex justify-between">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 0}
          className="rounded bg-green-500 px-4 py-2 text-white disabled:bg-gray-400"
        >
          Previous
        </button>
        {currentPage < totalPages - 1 && (
          <button onClick={handleNextPage} className="rounded bg-green-600 px-4 py-2 text-white">
            Next
          </button>
        )}
        {currentPage === totalPages - 1 && (
          <button onClick={handleSubmit} className="rounded bg-green-600 px-4 py-2 text-white">
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionsPage;
