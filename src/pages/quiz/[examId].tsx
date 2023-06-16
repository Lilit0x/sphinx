"use client"
import dynamic from "next/dynamic"

const ExamComponent = dynamic(() => import("@/app/components/Exam"), {
  ssr: false,
})

const ExamPage = () => <ExamComponent />

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

export default ExamPage
