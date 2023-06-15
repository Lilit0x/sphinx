"use client"
import {
  Box,
  Button,
  Center,
  Group,
  Loader,
  NativeSelect,
  Text,
  TextInput,
} from "@mantine/core"
import { hasLength, useForm } from "@mantine/form"
import { modals } from "@mantine/modals"
import { notifications } from "@mantine/notifications"
import { IconX } from "@tabler/icons-react"
import { invoke } from "@tauri-apps/api"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import { Classes, IDatabaseExam, IExam, IQuestion } from "@/utils/interfaces"

const StartExamInfo = () => {
  const router = useRouter()

  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
    },

    validate: {
      firstName: hasLength({ min: 2, max: 30 }, "Name must be 2-30 characters long"),
      lastName: hasLength({ min: 2, max: 30 }, "Name must be 2-30 characters long"),
    },
  })

  const [selectedClass, setClass] = useState<string>("")
  const [exams, setExams] = useState<IExam[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedExam, setSelectedExam] = useState<string>("")

  const openModal = () => {
    const selectedExamObj = exams.find(
      (exam) => exam.subject === selectedExam && exam.class === selectedClass,
    )
    console.log({ selectedExamObj })
    return modals.openConfirmModal({
      title: "Start Exam",
      children: (
        <Text size="sm">
          You are about to start {selectedExam[0]} for {selectedClass[0]} and it lasts
          for {selectedExamObj?.duration} minutes.
        </Text>
      ),
      labels: { confirm: "Proceed", cancel: "Back" },
      onCancel: () => console.log("Cancel"),
      onConfirm: async () => {
        try {
          if (selectedExamObj && selectedExamObj?.id) {
            await router.push(`/quiz/${selectedExamObj.id}`)
          }
        } catch (err) {
          console.log(err)
        }
      },
    })
  }

  const handleFormSubmit = ({
    firstName,
    lastName,
  }: {
    firstName: string
    lastName: string
  }) => {
    console.log({ firstName, lastName })
    if (selectedClass.length === 0) {
      return notifications.show({
        message: "Please select a class",
        title: "Error",
        color: "red",
        icon: <IconX />,
      })
    }

    if (selectedExam.length < 1) {
      return notifications.show({
        message: "Please select an exam",
        title: "Error",
        color: "red",
        icon: <IconX />,
      })
    }

    openModal()
  }

  useEffect(() => {
    const fetchExamPapers = async (selectedClass: string) => {
      const papers = await invoke<IDatabaseExam[]>("get_exams_by_class", {
        class: selectedClass,
      })
      return papers.map(
        (paper) =>
          ({
            ...paper,
            questions: JSON.parse(paper.questions) as IQuestion[],
          } as IExam),
      )
    }

    if (selectedClass.length > 0) {
      setLoading(true)
      notifications.show({
        message: `Fetching Exam Questions for ${selectedClass}`,
        title: "Questions",
        color: "yellow",
        loading: true,
      })

      fetchExamPapers(selectedClass)
        .then((values) => {
          console.log({ values })
          setExams(values)
          setLoading(false)
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
  }, [selectedClass])

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
        <Center h={300} mx="auto">
          <Loader color="orange" variant="bars" />
        </Center>
      ) : (
        <>
          <TextInput
            label="Firstname"
            placeholder="Yusrah"
            withAsterisk
            mt="md"
            {...form.getInputProps("firstName")}
          />
          <TextInput
            label="Surname"
            placeholder="Seriki"
            withAsterisk
            mt="md"
            {...form.getInputProps("lastName")}
          />

          <NativeSelect
            data={["Select a class", ...Object.keys(Classes)]}
            value={selectedClass}
            onChange={(event) => setClass(event.target.value)}
            placeholder="Class you belong to"
            mt="md"
            label="Class"
            withAsterisk
          />

          <NativeSelect
            disabled={exams.length === 0}
            data={[
              { value: "", label: "Select an exam" },
              ...exams.map((exam) => ({ value: exam.subject, label: exam.subject })),
            ]}
            value={selectedExam}
            onChange={(event) => setSelectedExam(event.target.value)}
            placeholder="Select A Paper"
            mt="md"
            label="Select Exam"
            withAsterisk
          />
          <Group position="right" mt="md">
            <Button type="submit">Start Exam</Button>
          </Group>
        </>
      )}
    </Box>
  )
}

export default StartExamInfo
