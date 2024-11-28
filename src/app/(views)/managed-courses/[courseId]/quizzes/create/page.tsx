'use client'

import React, { useState } from 'react'
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
} from '@coreui/react-pro'
import toast from '@/utils/toast'
import QuizQuestionInput from '@/components/QuizQuestionInput'

export default function CreateQuiz() {
  const router = useRouter()
  const { courseId } = useParams()
  const [creatingModule, setCreatingModule] = useState(false)
  const [questions, setQuestions] = useState<Record<string, any>[]>([{}])

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<Inputs>()

  function onSubmit(data: Inputs) {
    const content = watch('content')
    if (!content || content === '<p><br></p>' || content.trim() === '') {
      data.content = ''
    }

    setCreatingModule(true)

    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('description', data.description)
    formData.append('type', data.type)
    formData.append('content', data.content)
    formData.append('courseId', courseId as string)

    axios
      .post(`/api/courses/${courseId}/modules`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error('Failed to create quiz')
        }
      })
      .catch((err) => {
        setCreatingModule(false)
        toast('error', 'Error creating quiz')
        console.error(err)
      })
  }

  return (
    <CForm onSubmit={handleSubmit(onSubmit)}>
      <CCard className="p-4">
        <CRow>
          <CCol>
            <CCardTitle className="mb-4 fw-semibold"> Quiz Details</CCardTitle>
            <CFormLabel htmlFor="title">Title</CFormLabel>
            <CFormInput id="title" {...register('title', { required: true })} />
            {errors.title && <CFormText className="text-danger">This field is required</CFormText>}
          </CCol>
        </CRow>

        <CRow className="mt-3">
          <CCol>
            <CFormLabel htmlFor="description">Description</CFormLabel>
            <CFormTextarea
              id="description"
              {...register('description', { required: true })}
              placeholder="Enter course description"
            />
            {errors.description && (
              <CFormText className="text-danger">This field is required</CFormText>
            )}
          </CCol>
        </CRow>

        {questions.map((_, index) => (
          <QuizQuestionInput key={`question-${index + 1}`} index={index + 1} />
        ))}

        <CRow>
          <CCol>
            <CButton onClick={() => setQuestions([...questions, {}])}>Add Question</CButton>
          </CCol>
        </CRow>

        <CRow className="mt-4">
          <CCol className="d-flex gap-2">
            <CButton color="light" onClick={() => router.back()}>
              Cancel
            </CButton>
            <CButton type="submit" color="primary" className="text-white" disabled={creatingModule}>
              {creatingModule ? <CSpinner size="sm" /> : 'Save'}
            </CButton>
          </CCol>
        </CRow>
      </CCard>
    </CForm>
  )
}

type Inputs = {
  title: string
  description: string
  type: string
  content: string
}
