"use client"
import "@/app/globals.css"

import { Container, Skeleton } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { IconX } from "@tabler/icons-react"
import { invoke } from "@tauri-apps/api"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"

import { IDatabaseExam, IExam, IQuestion, IResult } from "@/utils/interfaces"

import ExamDetails from "./ExamDetails"

const Exam = () => {
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
        <ExamDetails exam={exam} createdResult={result} />
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

export default Exam
