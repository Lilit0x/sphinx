'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { Container, SimpleGrid, Skeleton, useMantineTheme, Grid, rem, Box } from '@mantine/core';

import { papers } from '../../app/data';
import { IExam, IQuestion } from '@/utils/interfaces';
import { ExamStats } from '@/app/components/ExamInfo';

const PRIMARY_COL_HEIGHT = rem(300);

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

  const theme = useMantineTheme();
  const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - ${theme.spacing.md} / 2)`;

  return (
    <Container my="md">
      {exam && exam?.id ?
        <SimpleGrid cols={2} spacing="md" breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
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
          <Grid gutter="md">
            <Grid.Col>
              <ExamStats
                title={exam?.subject}
                total={exam?.questions.length}
                completed={activeQuestion}
                stats={[{ value: exam.questions.length, label: 'Total Questions' }]}
                duration={exam.duration}
              />
            </Grid.Col>
            <Grid.Col>
              <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" animate={false} />
            </Grid.Col>
          </Grid>
        </SimpleGrid>

        : <>
          <Skeleton height={50} animate={true} circle mb="xl" />
          <Skeleton height={8} animate={true} radius="xl" />
          <Skeleton height={8} animate={true} mt={6} radius="xl" />
          <Skeleton height={8} mt={6} animate={true} width="70%" radius="xl" />
        </>}


    </Container>
  );
};

export default Page;