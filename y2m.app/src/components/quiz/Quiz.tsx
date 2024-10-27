'use client';
import { useState, useEffect, useCallback } from 'react';

interface QuizProps {
  questions: {
    question: string;
    answers: string[];
    correctAnswer: string;
  }[];
  userId: string | undefined;
}

const Quiz = ({ questions, userId }: QuizProps) => {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [checked, setChecked] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  });
  const [timeRemaining, setTimeRemaining] = useState(25);
  const [timerRunning, setTimerRunning] = useState(false);

  const { question, answers, correctAnswer } = questions[activeQuestion];

  const startTimer = useCallback(() => {
    setTimerRunning(true);
  }, []);

  const stopTimer = useCallback(() => {
    setTimerRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    setTimeRemaining(25);
  }, []);

  const nextQuestion = useCallback(() => {
    setSelectedAnswerIndex(null);
    setResults((prev) =>
      selectedAnswer
        ? {
            ...prev,
            score: prev.score + 5,
            correctAnswers: prev.correctAnswers + 1,
          }
        : {
            ...prev,
            wrongAnswers: prev.wrongAnswers + 1,
          }
    );
    if (activeQuestion !== questions.length - 1) {
      setActiveQuestion((prev) => prev + 1);
    } else {
      setShowResults(true);
      stopTimer();
      fetch('/api/quizResults', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          quizScore: results.score,
          correctAnswers: results.correctAnswers,
          wrongAnswers: results.wrongAnswers,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          console.log('Quiz results saved successfully:', data);
        })
        .catch((error) => {
          console.error('Error saving quiz results:', error);
        });
    }
    setChecked(false);
    resetTimer();
    startTimer();
  }, [
    selectedAnswer,
    activeQuestion,
    questions.length,
    stopTimer,
    resetTimer,
    startTimer,
    results.correctAnswers,
    results.score,
    results.wrongAnswers,
    userId,
  ]);

  const handleTimeUp = useCallback(() => {
    stopTimer();
    resetTimer();
    nextQuestion();
  }, [stopTimer, resetTimer, nextQuestion]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timerRunning && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      handleTimeUp();
    }
    return () => clearTimeout(timer);
  }, [timerRunning, timeRemaining, handleTimeUp]);

  useEffect(() => {
    startTimer();

    return () => {
      stopTimer();
    };
  }, [startTimer, stopTimer]);

  const onAnswerSelected = (answer: string, idx: number) => {
    setChecked(true);
    setSelectedAnswerIndex(idx);
    setSelectedAnswer(answer === correctAnswer ? answer : '');
  };

  return (
    <div className="min-h-[500px]">
      <div className="mx-auto flex w-[90%] max-w-[1500px] flex-col justify-center py-10">
        {!showResults ? (
          <>
            <div className="mb-10 flex items-center justify-between">
              <div className="rounded-md bg-primary px-4 py-1 text-white">
                <h2>
                  Question: {activeQuestion + 1}
                  <span>/{questions.length}</span>
                </h2>
              </div>

              <div className="rounded-md bg-primary px-4 py-1 text-white">
                {timeRemaining} seconds to answer
              </div>
            </div>

            <div>
              <h3 className="mb-5 text-2xl font-bold">{question}</h3>
              <ul>
                {answers.map((answer: string, idx: number) => (
                  <li
                    key={idx}
                    onClick={() => onAnswerSelected(answer, idx)}
                    className={`mb-5 cursor-pointer rounded-md p-3 hover:bg-primary hover:text-white ${
                      selectedAnswerIndex === idx && 'bg-primary text-white'
                    } `}
                  >
                    <span>{answer}</span>
                  </li>
                ))}
              </ul>
              <button onClick={nextQuestion} disabled={!checked} className="font-bold">
                {activeQuestion === questions.length - 1 ? 'Finish' : 'Next Question →'}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <h3 className="mb-10 text-2xl uppercase">Results 📈</h3>
            <button onClick={() => window.location.reload()} className="mt-10 font-bold uppercase">
              Restart Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
