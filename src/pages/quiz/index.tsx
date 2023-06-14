"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { useForm, hasLength } from '@mantine/form';
import { Button, Group, TextInput, Box, MultiSelect, Text } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';

import { Classes, IExam } from '@/utils/interfaces';
import { papers } from '@/app/data';

const Uploader = () => {
  const router = useRouter()

  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
    },

    validate: {
      firstName: hasLength({ min: 2, max: 30 }, 'Name must be 2-30 characters long'),
      lastName: hasLength({ min: 2, max: 30 }, 'Name must be 2-30 characters long'),
    },
  });

  const [selectedClass, setClass] = useState<string[]>([]);
  const [exams, setExams] = useState<IExam[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedExam, setSelectedExam] = useState<string[]>([]);
  const selectedExamObj = exams.find(exam => exam.subject === selectedExam[0] && exam.class === selectedClass[0])

  const openModal = () => modals.openConfirmModal({
    title: 'Start Exam',
    children: (
      <Text size="sm">
        You are about to start {selectedExam[0]} for {selectedClass[0]} and it lasts for {selectedExamObj?.duration} minutes.
      </Text>
    ),
    labels: { confirm: 'Proceed', cancel: 'Back' },
    onCancel: () => console.log('Cancel'),
    onConfirm: () => {
      router.push('/quiz/cbt')
    },
  });

  const handleFormSubmit = ({ firstName, lastName }: {
    firstName: string;
    lastName: string;
  }) => {
    console.log({ lastName, firstName });
    if (selectedClass.length < 1) {
      return notifications.show({ message: 'Please select a class', title: 'Error', color: 'red', icon: <IconX /> })
    }
    if (selectedClass.length > 1) {
      return notifications.show({ message: 'Please select only one class', title: 'Error', color: 'red', icon: <IconX /> })
    }
    if (selectedExam.length > 1) {
      return notifications.show({ message: 'Please select only one exam', title: 'Error', color: 'red', icon: <IconX /> })
    }
    if (selectedExam.length < 1) {
      return notifications.show({ message: 'Please select an exam', title: 'Error', color: 'red', icon: <IconX /> })
    }

    openModal();

  }

  useEffect(() => {
    if (selectedClass.length > 1) {
      return notifications.show({ message: 'Please select only one class', title: 'Error', color: 'red', icon: <IconX /> })
    }
    if (selectedClass.length > 0) {
      console.log({ selectedClass })
      setLoading(true)
      notifications.show({
        message: `Fetching Exam Questions for ${selectedClass}`,
        title: 'Questions',
        color: 'yellow',
      })
      const examPapers = papers.filter(paper => {
        return paper.class === selectedClass[0]
      })
      setExams(examPapers)
    }
  }, [selectedClass, loading])

  return (
    <Box component="form" maw={400} mx="auto" onSubmit={form.onSubmit((values) => {
      handleFormSubmit(values)
    })}>
      <TextInput
        label="Firstname"
        placeholder="Yusrah"
        withAsterisk
        mt="md"
        {...form.getInputProps('firstName')}
      />
      <TextInput
        label="Surname"
        placeholder="Seriki"
        withAsterisk
        mt="md"
        {...form.getInputProps('lastName')}
      />

      <MultiSelect
        data={Object.values(Classes)}
        value={selectedClass}
        onChange={setClass}
        placeholder="Class you belong to"
        mt="md"
        label="Class"
        withAsterisk
      />

      <MultiSelect
        disabled={exams.length === 0}
        data={exams.map(exam => ({ value: exam.subject, label: exam.subject }))}
        value={selectedExam}
        onChange={setSelectedExam}
        placeholder="Select A Paper"
        mt="md"
        label="Select Exam"
        withAsterisk
      />
      <Group position="right" mt="md">
        <Button type="submit">Start Exam</Button>
      </Group>
    </Box>
  );
}

export default Uploader;