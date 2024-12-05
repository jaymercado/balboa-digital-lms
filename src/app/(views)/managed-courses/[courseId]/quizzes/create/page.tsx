'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import {
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
  CSpinner,
  CFormText,
  CRow,
  CCol,
  CFormTextarea,
  CCard,
  CCardTitle,
  CCardBody,
} from '@coreui/react-pro'
import toast from '@/utils/toast'
import { QuizQuestion } from '@/types/quiz'
import QuizQuestionInput from '@/components/QuizQuestionInput'

const defaultQuizQuestion: QuizQuestion = {
  question: '',
  type: 'multipleChoice',
  answers: [
    { answer: '', isCorrect: true },
    { answer: '', isCorrect: false },
    { answer: '', isCorrect: false },
    { answer: '', isCorrect: false },
  ],
}

export default function CreateQuiz() {
  const router = useRouter()
  const { courseId } = useParams()
  const [creatingModule, setCreatingModule] = useState(false)
  const [questions, setQuestions] = useState<QuizQuestion[]>([{ ...defaultQuizQuestion }])
  const [isValid, setIsValid] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Inputs>()

  function onSubmit(data: Inputs) {
    const content = watch('content')
    if (!content || content === '<p><br></p>' || content.trim() === '') {
      data.content = ''
    }

    setCreatingModule(true)

    axios
      .post(`/api/courses/${courseId}/quizzes`, data)
      .then((res) => {
        if (res.status !== 200) throw new Error('Failed to create quiz')
      })
      .catch((err) => {
        toast('error', 'Error creating quiz')
        console.error(err)
      })
      .finally(() => {
        setCreatingModule(false)
      })
  }

  useEffect(() => {
    const allQuestionsAreValid = questions.every(({ question }) => question.trim() !== '')
    const allAnswersAreValid = questions.every(({ answers }) =>
      answers.every(({ answer }) => answer.trim() !== ''),
    )
    const eachQuestionHasAtLeastOneCorrectAnswer = questions.every(({ answers }) =>
      answers.some(({ isCorrect }) => isCorrect),
    )
    setIsValid(allQuestionsAreValid && allAnswersAreValid && eachQuestionHasAtLeastOneCorrectAnswer)
  }, [questions])

  return (
    <CForm onSubmit={handleSubmit(onSubmit)}>
      <CCard className="mb-2">
        <CCardBody className="p-4">
          <CCardTitle className="mb-4 fw-semibold">Quiz Details</CCardTitle>
          <CFormLabel htmlFor="title">Title</CFormLabel>
          <CFormInput id="title" {...register('title', { required: true })} className="mb-3" />
          {errors.title && <CFormText className="text-danger">This field is required</CFormText>}
          <CFormLabel htmlFor="description">Description</CFormLabel>
          <CFormTextarea
            rows={3}
            id="description"
            {...register('description', { required: true })}
            placeholder="Enter course description"
          />
          {errors.description && (
            <CFormText className="text-danger">This field is required</CFormText>
          )}
        </CCardBody>
      </CCard>
      <CCard>
        <CCardBody className="p-4">
          {questions.map((_, index) => (
            <QuizQuestionInput
              key={`question-${index + 1}`}
              index={index}
              question={questions[index]}
              setQuestions={setQuestions}
            />
          ))}

          <CRow className="mt-2">
            <CCol>
              <CButton
                color="secondary"
                variant="outline"
                onClick={() => setQuestions([...questions, { ...defaultQuizQuestion }])}
              >
                Add Question <i className="bi bi-plus" />
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
      <CRow className="my-3 justify-content-end">
        <CCol className="d-flex gap-2" xs="auto">
          <CButton color="secondary" onClick={() => router.back()}>
            Cancel
          </CButton>
          <CButton
            type="submit"
            color="primary"
            className="text-white"
            disabled={creatingModule || !isValid}
          >
            {creatingModule ? <CSpinner size="sm" /> : 'Save'}
          </CButton>
        </CCol>
      </CRow>
    </CForm>
  )
}

type Inputs = {
  title: string
  description: string
  type: string
  content: string
}
