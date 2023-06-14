'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'

import { papers } from '../../app/data';
import { IExam, IQuestion } from '@/utils/interfaces';
import { Skeleton } from '@mantine/core';

const Page = () => {
  const router = useRouter()
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean>();
  const [checked, setChecked] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  });
  const [exam, setExam] = useState<IExam | null>(null);
  useEffect(() => {
    const exam = papers.find(paper => paper.id === router.query.examId) ?? {} as IExam;
    setExam(exam);
  }, [router])


  //   Select and check answer
  const onAnswerSelected = (idx: number, correctAnswer: number) => {
    setChecked(true);
    setSelectedAnswerIndex(idx);
    if (idx === correctAnswer) {
      setSelectedAnswer(true);
      console.log('true');
    } else {
      setSelectedAnswer(false);
      console.log('false');
    }
  };

  // Calculate score and increment to next question
  const nextQuestion = (questions?: IQuestion[]) => {
    setSelectedAnswerIndex(null);
    setResult((prev) =>
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
    if (questions && activeQuestion !== questions.length - 1) {
      setActiveQuestion((prev) => prev + 1);
    } else {
      setActiveQuestion(0);
      setShowResult(true);
    }
    setChecked(false);
  };

  return (
    <div className='container'>
      {exam && exam?.id ?
        (<>
          <h1>Quiz Page</h1>
          <div>
            <h2>
              Question: {activeQuestion + 1}
              <span>/{exam?.questions.length}</span>
            </h2>
          </div>
          <div>

            {
              !showResult ? (
                <div className='quiz-container'>
                  <h3>{exam?.questions[activeQuestion].question}</h3>
                  {exam?.questions[activeQuestion].answers.map((answer, idx) => (
                    <li
                      key={idx}
                      onClick={() => onAnswerSelected(idx, exam?.questions[activeQuestion].correctAnswer)}
                      className={
                        selectedAnswerIndex === idx ? 'li-selected' : 'li-hover'
                      }
                    >
                      <span>{answer}</span>
                    </li>
                  ))}
                  {checked ? (
                    <button onClick={() => nextQuestion(exam?.questions)} className='btn'>
                      {exam?.questions[activeQuestion] && activeQuestion === exam?.questions[activeQuestion].question.length - 1 ? 'Finish' : 'Next'}
                    </button>
                  ) : (
                    <button onClick={() => nextQuestion(exam?.questions)} disabled className='btn-disabled'>
                      {' '}
                      {exam?.questions[activeQuestion] && activeQuestion === exam?.questions[activeQuestion].question.length - 1 ? 'Finish' : 'Next'}
                    </button>
                  )}
                </div>
              ) : (
                <div className='quiz-container'>
                  <h3>Results</h3>
                  <h3>Overall {(result.score / 25) * 100}%</h3>
                  <p>
                    Total Questions: <span>{exam?.questions.length}</span>
                  </p>
                  <p>
                    Total Score: <span>{result.score}</span>
                  </p>
                  <p>
                    Correct Answers: <span>{result.correctAnswers}</span>
                  </p>
                  <p>
                    Wrong Answers: <span>{result.wrongAnswers}</span>
                  </p>
                  <button onClick={() => window.location.reload()}>Restart</button>
                </div>
              )}
          </div>
        </>)
        : <>
          <Skeleton height={50} circle mb="xl" />
          <Skeleton height={8} radius="xl" />
          <Skeleton height={8} mt={6} radius="xl" />
          <Skeleton height={8} mt={6} width="70%" radius="xl" />
        </>}
    </div>
  );
};

export default Page;