"use client"
import dynamic from "next/dynamic"

const StartExamComponent = dynamic(() => import("@/app/components/StartExam"), {
  ssr: false,
})

const ExamStartPage = () => {
  return <StartExamComponent />
}

export default ExamStartPage
