export interface IQuestionDoc {
  totalQuestions: number
  questions: IQuestion[]
}

export interface IQuestion {
  id: number
  question: string
  answers: string[]
  correctAnswer: number
}

export enum Classes {
  Pry1 = "Primary 1",
  Pry2 = "Primary 2",
  Pry3 = "Primary 3",
  Pry4 = "Primary 4",
  Pry5 = "Primary 5",
  JSS1 = "Junior Secondary School 1",
  JSS2 = "Junior Secondary School 2",
  JSS3 = "Junior Secondary School 3",
  SS1 = "Senior Secondary School 1",
  SS2 = "Senior Secondary School 2",
  SS3 = "Senior Secondary School 3",
}

export interface IExam extends IQuestionDoc {
  id?: string
  duration: number
  subjectTeacherName: string
  subject: string
  uploaderName: string
  class: Classes
}
