'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { CCard, CCol, CFormTextarea, CFormSelect } from '@coreui/react-pro'
import Answer from './Answer'

interface CreateQuizProps {
  index: number
}

export default function CreateQuiz({ index }: CreateQuizProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<Inputs>()

  return (
    <CCard className="p-3 mt-3 bg-light">
      <CCol>
        <h2>Question {index}</h2>
        <CFormTextarea
          id="description"
          {...register('text', { required: true })}
          placeholder="Enter question"
        />
        <CFormSelect id="type" {...register('type', { required: true })}>
          <option value="multipleChoice">Multiple Choice</option>
          <option value="trueOrFalse">True or False</option>
          <option value="identification">Identification</option>
        </CFormSelect>
        <Answer type={watch('type')} />
      </CCol>
    </CCard>
  )
}

type Inputs = {
  text: string
  type: string
  points: number
}
