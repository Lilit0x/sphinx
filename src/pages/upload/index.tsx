"use client";
import { useState } from 'react';
import { useForm, isNotEmpty, isEmail, hasLength, isInRange } from '@mantine/form';
import { Button, Group, TextInput, Box, MultiSelect, FileInput, rem, NumberInput } from '@mantine/core';
import { IconCheck, IconUpload, IconX } from '@tabler/icons-react';

import { Classes } from '@/utils/interfaces';
import { notifications } from '@mantine/notifications';
import { extractQuestions } from '@/utils/uploader';

const Uploader = () => {
	const form = useForm({
		initialValues: {
			subjectTeacherName: '',
			subject: '',
			email: '',
			uploaderName: '',
			duration: 30,
		},

		validate: {
			subjectTeacherName: hasLength({ min: 2, max: 30 }, 'Name must be 2-30 characters long'),
			subject: isNotEmpty('Enter subject name'),
			email: isEmail('Invalid email'),
			uploaderName: hasLength({ min: 2, max: 30 }, 'Name must be 2-30 characters long'),
			duration: isInRange({ min: 20, max: 100 }, 'Duration must be between 20 and 100 minutes'),
		},
	});

	const [selectedClass, setClass] = useState<string[]>([]);
	const [file, setFile] = useState<File | null>(null);

	const handleFormSubmit = ({ subject, subjectTeacherName, email, uploaderName }: {
		subjectTeacherName: string;
		subject: string;
		email: string;
		uploaderName: string;
	}) => {
		console.log({ subject, subjectTeacherName, email, uploaderName });
		if(selectedClass.length < 1) {
			return notifications.show({ message: 'Please select a class', title: 'Error', color: 'red', icon: <IconX /> })
		}
		if(!file) {
			return notifications.show({ message: 'Please select a file', title: 'Error', color: 'red', icon: <IconX /> })
		}

		  const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        const binaryStr = reader.result
				const questions = extractQuestions(binaryStr as string)
				const payload = { subject, subjectTeacherName, email, uploaderName, questions }
        console.log({ payload })

				return notifications.show({ message: 'File Uploaded Successfully', title: 'Success', color: 'green', icon: <IconCheck /> })
      }
      reader.readAsText(file)
		
	}

	return (
		<Box component="form" maw={400} mx="auto" onSubmit={form.onSubmit((values) => {
			handleFormSubmit(values)
		})}>
			<TextInput label="Subject Teacher Name" placeholder="Subject Teacher Name" withAsterisk {...form.getInputProps('subjectTeacherName')} />
			<TextInput
				label="Subject"
				placeholder="Subject"
				withAsterisk
				mt="md"
				{...form.getInputProps('subject')}
			/>
			<TextInput
				label="Your email"
				placeholder="Your email"
				withAsterisk
				mt="md"
				{...form.getInputProps('email')}
			/>
			<TextInput
				label="Uploader Name"
				placeholder="Name of the teacher uploading the file"
				withAsterisk
				mt="md"
				{...form.getInputProps('uploaderName')}
			/>

			<MultiSelect
				data={Object.keys(Classes)}
				value={selectedClass}
				onChange={setClass}
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
        {...form.getInputProps('duration')}
      />

		<FileInput
      placeholder="Pick a .txt file"
			mt="md"
      label="Question File"
      withAsterisk
			value={file} 
			onChange={setFile}
			disabled={!!file}
			accept="text/plain"
			icon={<IconUpload size={rem(14)} />}
    />

			<Group position="right" mt="md">
				<Button type="submit">Submit</Button>
			</Group>
		</Box>
	);
}

export default Uploader;