"use client"
import "@/app/globals.css"

import {
  Container,
  Grid,
  rem,
  SimpleGrid,
  Skeleton,
  useMantineTheme,
} from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { IconCheck, IconX } from "@tabler/icons-react"
import { invoke } from "@tauri-apps/api"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"

import EndPage from "@/app/components/EndPage"
import { ExamStats } from "@/app/components/ExamInfo"
import { IDatabaseExam, IExam, IQuestion, IResult } from "@/utils/interfaces"

const PRIMARY_COL_HEIGHT = rem(300)
interface PageDetailsProps {
  exam: IExam
  createdResult: IResult
}

const PageDetails = ({ exam, createdResult }: PageDetailsProps) => {
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

const Page = () => {
  const router = useRouter()
  const [exam, setExam] = useState<IExam | null>(null)
  const [result, setResult] = useState<IResult | null>(null)

  const getExamById = async (id: number) => {
    const [exam] = await invoke<IDatabaseExam[]>("get_exam_by_id", { id })
    return { ...exam, questions: JSON.parse(exam.questions) as IQuestion[] } as IExam
  }

  const startExam = async (name: string, examId: number) => {
    const result = await invoke<IResult>("start_exam", {
      result: { examId, studentName: name },
    })
    return result
  }

  useEffect(() => {
    const { name, examId } = router.query
    console.log({ name, examId })
    getExamById(Number(router.query.examId as string))
      .then((exam) => {
        startExam(name as string, Number(exam.id as string))
          .then((res) => {
            setResult(res)
            setExam(exam)
          })
          .catch((err: string) => {
            return notifications.show({
              message: String(err),
              title: "Error",
              color: "red",
              icon: <IconX />,
            })
          })
      })
      .catch((err: string) => {
        //TODO, display error page and refresh
        return notifications.show({
          message: `${err}. \nCould not fetch exam details. Please refresh`,
          title: "Error",
          color: "red",
          icon: <IconX />,
        })
      })
  }, [router])

  return (
    <Container my="md">
      {exam && exam?.id && result ? (
        <PageDetails exam={exam} createdResult={result} />
      ) : (
        <>
          <Skeleton height={50} animate={true} circle mb="xl" />
          <Skeleton height={8} animate={true} radius="xl" />
          <Skeleton height={8} animate={true} mt={6} radius="xl" />
          <Skeleton height={8} mt={6} animate={true} width="70%" radius="xl" />
        </>
      )}
    </Container>
  )
}

// export const getStaticProps = async (ctx: GetStaticPropsContext) => {
//   const getExamById = async (id: number) => {
//     const [exam] = await invoke<IDatabaseExam[]>("get_exam_by_id", { id })
//     return { ...exam, questions: JSON.parse(exam.questions) as IQuestion[] } as IExam
//   }

//   const { params } = ctx;
//   console.log({ params })

//   try {
//     const exam = await getExamById(Number(params?.examId))
//     return { props: { exam } };
//   } catch (err) {
//     console.log(err)
//     return {
//       notFound: true,
//     }
//   }
// }

export default Page
