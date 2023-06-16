"use client"

import {
  Box,
  Button,
  Center,
  FileInput,
  Group,
  Loader,
  NativeSelect,
  NumberInput,
  rem,
  TextInput,
} from "@mantine/core"
import { hasLength, isEmail, isInRange, isNotEmpty, useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import { IconCheck, IconUpload, IconX } from "@tabler/icons-react"
import { invoke } from "@tauri-apps/api"
import { useRouter } from "next/router"
import { useState } from "react"

import { Classes, IExam } from "@/utils/interfaces"
import { extractQuestions } from "@/utils/uploader"

const Uploader = () => {
  const router = useRouter()
  const form = useForm({
    initialValues: {
      subjectTeacherName: "",
      subject: "",
      email: "",
      uploaderName: "",
      duration: 30,
    },

    validate: {
      subjectTeacherName: hasLength(
        { min: 2, max: 30 },
        "Name must be 2-30 characters long",
      ),
      subject: isNotEmpty("Enter subject name"),
      email: isEmail("Invalid email"),
      uploaderName: hasLength({ min: 2, max: 30 }, "Name must be 2-30 characters long"),
      duration: isInRange(
        { min: 20, max: 100 },
        "Duration must be between 20 and 100 minutes",
      ),
    },
  })
  const [selectedClass, setClass] = useState<string>("")
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const handleFormSubmit = ({
    subject,
    subjectTeacherName,
    uploaderName,
    duration,
  }: {
    subjectTeacherName: string
    subject: string
    email: string
    uploaderName: string
    duration: number
  }) => {
    if (selectedClass.length < 1) {
      return notifications.show({
        message: "Please select a class",
        title: "Error",
        color: "red",
        icon: <IconX />,
      })
    }
    if (!file) {
      return notifications.show({
        message: "Please select a file",
        title: "Error",
        color: "red",
        icon: <IconX />,
      })
    }

    const reader = new FileReader()

    reader.onabort = () => console.log("file reading was aborted")
    reader.onerror = () => console.log("file reading has failed")
    reader.onload = () => {
      setLoading(true)
      const binaryStr = reader.result
      const questions = extractQuestions(binaryStr as string)
      const payload: IExam = {
        subject,
        subjectTeacherName,
        uploaderName,
        totalQuestions: questions.totalQuestions,
        questions: questions.questions,
        duration,
        class: selectedClass as Classes,
      }
      invoke<string>("upload_exam", {
        exam: { ...payload, questions: JSON.stringify(payload.questions) },
      })
        .then(() => {
          setLoading(false)
          notifications.show({
            message: "Exam File Uploaded Successfully",
            title: "Success",
            color: "green",
            icon: <IconCheck />,
          })

          setTimeout(() => router.reload(), 500)
        })
        .catch((err: string) => {
          setLoading(false)
          return notifications.show({
            message: err,
            title: "Error",
            color: "red",
            icon: <IconX />,
          })
        })
    }
    reader.readAsText(file)
  }

  return (
    <Box
      component="form"
      maw={400}
      mx="auto"
      onSubmit={form.onSubmit((values) => {
        handleFormSubmit(values)
      })}
    >
      {loading ? (
        <Center maw={400} h={100} mx="auto">
          <Loader color="orange" variant="bars" />
        </Center>
      ) : (
        <>
          <TextInput
            label="Subject Teacher Name"
            placeholder="Subject Teacher Name"
            withAsterisk
            {...form.getInputProps("subjectTeacherName")}
          />
          <TextInput
            label="Subject"
            placeholder="Subject"
            withAsterisk
            mt="md"
            {...form.getInputProps("subject")}
          />
          <TextInput
            label="Your email"
            placeholder="Your email"
            withAsterisk
            mt="md"
            {...form.getInputProps("email")}
          />
          <TextInput
            label="Uploader Name"
            placeholder="Name of the teacher uploading the file"
            withAsterisk
            mt="md"
            {...form.getInputProps("uploaderName")}
          />

          <NativeSelect
            data={Object.keys(Classes)}
            value={selectedClass}
            onChange={(event) => setClass(event.target.value)}
            placeholder="Intended class"
            mt="md"
            label="Class"
            withAsterisk
          />

          <NumberInput
            label="Exam Duration"
            placeholder="20"
            withAsterisk
            mt="md"
            {...form.getInputProps("duration")}
          />

          <FileInput
            placeholder="Pick a .txt file"
            mt="md"
            label="Question File"
            withAsterisk
            value={file}
            onChange={setFile}
            disabled={Boolean(file)}
            accept="text/plain"
            icon={<IconUpload size={rem(14)} />}
          />

          <Group position="right" mt="md">
            <Button disabled={loading} type="submit">
              Submit
            </Button>
          </Group>
        </>
      )}
    </Box>
  )
}

export default Uploader
