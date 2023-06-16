"use client"
import "@/app/globals.css"

import { Grid, rem, SimpleGrid, Skeleton, useMantineTheme } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { IconCheck, IconX } from "@tabler/icons-react"
import { invoke } from "@tauri-apps/api"
import { useRouter } from "next/router"
import React, { useState } from "react"

import EndPage from "@/app/components/EndPage"
import { ExamStats } from "@/app/components/ExamInfo"
import { IExam, IQuestion, IResult } from "@/utils/interfaces"

const PRIMARY_COL_HEIGHT = rem(300)
interface PageDetailsProps {
  exam: IExam
  createdResult: IResult
}

const ExamDetails = ({ exam, createdResult }: PageDetailsProps) => {
  const router = useRouter()

  const [activeQuestion, setActiveQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<boolean>()
  const [checked, setChecked] = useState(false)
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  })

  const updateResult = async (result: IResult) => {
    const res = await invoke<string>("finish_exam", { result })
    return res
  }

  //   Select and check answer
  const onAnswerSelected = (idx: number, correctAnswer: number) => {
    setChecked(true)
    setSelectedAnswerIndex(idx)
    if (idx === correctAnswer) {
      setSelectedAnswer(true)
      console.log("true")
    } else {
      setSelectedAnswer(false)
      console.log("false")
    }
  }

  // Calculate score and increment to next question
  const nextQuestion = (questions?: IQuestion[]) => {
    setSelectedAnswerIndex(null)
    setResult((prev) =>
      selectedAnswer
        ? {
            ...prev,
            score: prev.score + 1,
            correctAnswers: prev.correctAnswers + 1,
          }
        : {
            ...prev,
            wrongAnswers: prev.wrongAnswers + 1,
          },
    )
    if (questions && activeQuestion !== questions.length - 1) {
      setActiveQuestion((prev) => prev + 1)
    } else {
      setActiveQuestion(0)
      notifications.show({
        message: "Uploading Your Results...",
        title: "Exams",
        color: "yellow",
        loading: true,
      })
      const payload = { ...createdResult, ...result }
      updateResult(payload)
        .then(() => {
          notifications.show({
            message: "Results uploaded successfully",
            title: "Success",
            color: "green",
            icon: <IconCheck />,
          })
          setShowResult(true)
          setTimeout(
            () =>
              router
                .push("/")
                .then()
                .catch((err) => console.log(err)),
            1000,
          )
        })
        .catch((err: string) => {
          return notifications.show({
            message: err,
            title: "Error",
            color: "red",
            icon: <IconX />,
          })
        })
    }
    setChecked(false)
  }

  const theme = useMantineTheme()
  const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - ${theme.spacing.md} / 2)`

  return (
    <>
      {!showResult ? (
        <SimpleGrid cols={2} spacing="md" breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
          <div>
            <div className="quiz-container">
              <h3>{exam?.questions[activeQuestion].question}</h3>
              {exam?.questions[activeQuestion].answers.map((answer, idx) => (
                <li
                  key={idx}
                  onClick={() =>
                    onAnswerSelected(idx, exam?.questions[activeQuestion].correctAnswer)
                  }
                  className={selectedAnswerIndex === idx ? "li-selected" : "li-hover"}
                >
                  <span>{answer}</span>
                </li>
              ))}
              {checked ? (
                <button onClick={() => nextQuestion(exam?.questions)} className="btn">
                  {exam?.questions[activeQuestion] &&
                  activeQuestion === exam?.questions[activeQuestion].question.length - 1
                    ? "Finish"
                    : "Next"}
                </button>
              ) : (
                <button
                  onClick={() => nextQuestion(exam?.questions)}
                  disabled
                  className="btn-disabled"
                >
                  {" "}
                  {exam?.questions[activeQuestion] &&
                  activeQuestion === exam?.questions[activeQuestion].question.length - 1
                    ? "Finish"
                    : "Next"}
                </button>
              )}
            </div>
          </div>
          <Grid gutter="md">
            <Grid.Col>
              <ExamStats
                title={exam?.subject}
                total={exam?.questions.length}
                completed={activeQuestion}
                stats={[{ value: exam.questions.length, label: "Total Questions" }]}
                duration={exam.duration}
              />
            </Grid.Col>
            <Grid.Col>
              <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" animate={false} />
            </Grid.Col>
          </Grid>
        </SimpleGrid>
      ) : (
        <EndPage subject={exam.subject} selectedClass={exam.class} />
      )}
    </>
  )
}

export default ExamDetails
