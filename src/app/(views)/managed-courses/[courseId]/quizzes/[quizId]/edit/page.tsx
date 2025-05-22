'use client'

import React, { useState, useEffect, useCallback } from 'react'
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
import { useGetQuiz } from '@/hooks/useGetQuizzes'
import { QuizQuestion } from '@/types/quiz'
import { QuizQuestionInput } from '@/components'

const defaultQuizQuestion: QuizQuestion = {
  question: '',
  type: 'multipleChoice',
  options: [
    { option: '', isCorrect: true },
    { option: '', isCorrect: false },
    { option: '', isCorrect: false },
    { option: '', isCorrect: false },
  ],
}

export default function EditQuiz() {
  const router = useRouter()
  const params = useParams()
  const { courseId, quizId } = params as { courseId: string; quizId: string }
  const [updatingQuiz, setUpdatingQuiz] = useState(false)
  const [questions, setQuestions] = useState<QuizQuestion[]>([{ ...defaultQuizQuestion }])
  const { fetchingQuiz, courseQuiz } = useGetQuiz({
    courseId,
    quizId,
  })
  const [isValid, setIsValid] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>()

  const initializeForm = useCallback(() => {
    if (courseQuiz) {
      setValue('title', courseQuiz.title)
      setValue('description', courseQuiz.description)
      setValue('numQuestions', courseQuiz.numQuestions)
      setQuestions(courseQuiz?.questions || [{ ...defaultQuizQuestion }])
    }
  }, [courseQuiz, setValue, setQuestions])

  useEffect(() => {
    initializeForm()
  }, [initializeForm])

  function onSubmit(data: Inputs) {
    setUpdatingQuiz(true)
    axios
      .put(`/api/courses/${courseId}/quizzes/${quizId}`, { ...data, questions })
      .then((res) => {
        if (res.status !== 200) throw new Error('Failed to update quiz')
        toast('success', 'Quiz updated successfully')
        router.push(`/managed-courses/${courseId}/quizzes`)
      })
      .catch((err) => {
        toast('error', 'Error updating quiz')
        console.error(err)
      })
      .finally(() => {
        setUpdatingQuiz(false)
      })
  }

  useEffect(() => {
    const allQuestionsAreValid = questions.every(({ question }) => question.trim() !== '')
    const allOptionsAreValid = questions.every(({ options }) =>
      options.every(({ option }) => option.trim() !== ''),
    )
    const eachQuestionHasAtLeastOneCorrectAnswer = questions.every(({ options }) =>
      options.some(({ isCorrect }) => isCorrect),
    )
    setIsValid(allQuestionsAreValid && allOptionsAreValid && eachQuestionHasAtLeastOneCorrectAnswer)
  }, [questions])

  if (fetchingQuiz) {
    return <CSpinner />
  }

  return (
    <CForm onSubmit={handleSubmit(onSubmit)}>
      <CCard className="mb-2">
        <CCardBody className="p-4">
          <CCardTitle className="mb-4 fw-semibold">Edit Quiz Details</CCardTitle>
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
          <CFormLabel htmlFor="numQuestions">Number of Question(s) to be used</CFormLabel>
          <CFormInput
            id="numQuestions"
            type="number"
            min={1}
            max={questions.length}
            {...register('numQuestions', { required: true })}
          />
          <hr className="mb-3" />
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
            disabled={updatingQuiz || !isValid}
          >
            {updatingQuiz ? <CSpinner size="sm" /> : 'Save'}
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
  numQuestions: number
  content: string
}
