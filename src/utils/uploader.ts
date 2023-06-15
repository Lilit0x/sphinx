// import { FileWithPath } from "@mantine/dropzone";
// import Docxtemplater from 'docxtemplater';
// import PizZip from 'pizzip';
// import PizZipUtils from 'pizzip/utils/index.js';

import { IQuestion, IQuestionDoc } from "./interfaces"

// const loadFile = (url: string, callback: (err: Error, data: string) => void) => {
//   PizZipUtils.getBinaryContent(url, callback);
// }

// export const extractFileContents = (reader: FileReader, file: FileWithPath): string => {
//   const result = reader.result;
//   console.log({ result })
//   let finalResult = "";
//   if (typeof result === "string") {
//     finalResult = result
//   } else if (result && typeof result !== "string") {
//     loadFile(file.path as string, (err, data) => {
//       if (err) {
//         console.log(err)
//       }
//       const zip = new PizZip(data);
//       const doc = new Docxtemplater(zip);
//       const text = doc.getFullText();
//       console.log({ text })
//       finalResult = text;
//       return;
//     })
//   }

//   return finalResult
// }

export const extractQuestions = (content: string): IQuestionDoc => {
  ///Delimeter for questions is 10 "-"
  const questionsArr = content.split("==========").filter((q) => q.length !== 0)
  console.log({ questionsArr })
  const questions: IQuestion[] = questionsArr.map((q, idx) => {
    const [question, answers, rightAnswer] = q.trim().split("\r")
    const newQuestion = question.slice(2).trim()
    const answersArr = answers
      .slice(9)
      .split("==")
      .map((answer) => answer.trim())
    const correctAnswer = rightAnswer.trim().split(":")[1]?.trim()
    console.log({ newQuestion, answersArr, correctAnswer })
    return {
      id: idx,
      answers: answersArr,
      question: newQuestion,
      correctAnswer: Number(correctAnswer) - 1,
    }
  })

  return { totalQuestions: questions.length, questions }
}
