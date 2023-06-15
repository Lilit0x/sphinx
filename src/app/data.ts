import { Classes, IExam } from "@/utils/interfaces"

export const quiz = {
  totalQuestions: 5,
  questions: [
    {
      id: 1,
      question:
        "What is the capital of France? jajhssss u;ahhhhhhhhhh u;qweeeeeeeeeeee hleeeeeeeeeeeeeeee  ulqwuddddddddddddddddlulb hshluduasdudedjdhud7e dudhedundu hudwu",
      answers: ["Madrid", "Paris", "Rome", "Berlin"],
      correctAnswer: "Paris",
    },
    {
      id: 2,
      question: "What is the largest planet in our solar system?",
      answers: ["Mars", "Jupiter", "Venus", "Saturn"],
      correctAnswer: "Jupiter",
    },
    {
      id: 3,
      question: "What is the smallest country in the world?",
      answers: ["Monaco", "Maldives", "Vatican City", "San Marino"],
      correctAnswer: "Vatican City",
    },
    {
      id: 4,
      question: "What is the most widely spoken language in the world?",
      answers: ["English", "Mandarin", "Spanish", "Hindi"],
      correctAnswer: "Mandarin",
    },
    {
      id: 5,
      question: "Who is the founder of Microsoft?",
      answers: ["Steve Jobs", "Bill Gates", "Elon Musk", "Mark Zuckerberg"],
      correctAnswer: "Bill Gates",
    },
  ],
}

export const papers: IExam[] = [
  {
    id: "one",
    totalQuestions: quiz.totalQuestions,
    questions: quiz.questions.map((q, idx) => {
      const correctAnswer = q.answers.findIndex((ans) => ans === q.correctAnswer)
      return { id: idx, question: q.question, answers: q.answers, correctAnswer }
    }),
    duration: 60,
    subject: "Social Studies",
    subjectTeacherName: "Mrs. Sobertan",
    uploaderName: "Mr. Rahman",
    class: Classes.Pry1,
  },
  {
    id: "two",
    totalQuestions: quiz.totalQuestions,
    questions: quiz.questions.map((q, idx) => {
      const correctAnswer = q.answers.findIndex((ans) => ans === q.correctAnswer)
      return { id: idx, question: q.question, answers: q.answers, correctAnswer }
    }),
    duration: 20,
    subject: "Islamic Studies",
    subjectTeacherName: "Mrs. Lateefah",
    uploaderName: "Mr. Rahman",
    class: Classes.Pry2,
  },

  {
    id: "three",
    totalQuestions: quiz.totalQuestions,
    questions: quiz.questions.map((q, idx) => {
      const correctAnswer = q.answers.findIndex((ans) => ans === q.correctAnswer)
      return { id: idx, question: q.question, answers: q.answers, correctAnswer }
    }),
    duration: 30,
    subject: "Islamic Studies",
    subjectTeacherName: "Mrs. Rusterman",
    uploaderName: "Mr. Rahman",
    class: Classes.Pry5,
  },
  {
    id: "four",
    totalQuestions: quiz.totalQuestions,
    questions: quiz.questions.map((q, idx) => {
      const correctAnswer = q.answers.findIndex((ans) => ans === q.correctAnswer)
      return { id: idx, question: q.question, answers: q.answers, correctAnswer }
    }),
    duration: 25,
    subject: "Islamic Studies",
    subjectTeacherName: "Mr. Adebayo",
    uploaderName: "Mr. Rahman",
    class: Classes.Pry4,
  },
  {
    id: "five",
    totalQuestions: quiz.totalQuestions,
    questions: quiz.questions.map((q, idx) => {
      const correctAnswer = q.answers.findIndex((ans) => ans === q.correctAnswer)
      return { id: idx, question: q.question, answers: q.answers, correctAnswer }
    }),
    duration: 90,
    subject: "Mathematics",
    subjectTeacherName: "Mr. Ojulobe",
    uploaderName: "Mr. Rahman",
    class: Classes.SS1,
  },
]
