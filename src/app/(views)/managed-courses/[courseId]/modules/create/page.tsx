'use client'

import React, { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import {
  CForm,
  CInputGroup,
  CFormLabel,
  CFormInput,
  CButton,
  CSpinner,
  CFormText,
  CFormSelect,
} from '@coreui/react-pro'
import toast from '@/utils/toast'
import ModuleContentInput from '@/components/ModuleContentInput'

const typeOptions = [
  { value: '', label: '-- Select --' },
  { value: 'text', label: 'Text' },
  { value: 'video', label: 'Video' },
  { value: 'image', label: 'Image' },
  { value: 'pdf', label: 'PDF' },
]

export default function CreateModule() {
  const router = useRouter()
  const { courseId } = useParams()
  const [creatingModule, setCreatingModule] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<Inputs>()

  function onSubmit(data: Inputs) {
    setCreatingModule(true)
    fetch(`/api/courses/${courseId}/modules`, {
      method: 'POST',
      body: JSON.stringify({ ...data, courseId }),
    })
      .then(() => {
        toast('success', 'Module created successfully')
        router.push(`/managed-courses/${courseId}`)
      })
      .catch((err) => {
        toast('error', 'Error creating module')
        console.error(err)
      })
      .finally(() => setCreatingModule(false))
  }

  return (
    <CForm onSubmit={handleSubmit(onSubmit)}>
      <CInputGroup>
        <CFormLabel htmlFor="title">Title</CFormLabel>
        <CFormInput id="title" {...register('title', { required: true })} />
        {errors.title && <CFormText className="text-danger">This field is required</CFormText>}
      </CInputGroup>
      <CInputGroup>
        <CFormLabel htmlFor="description">Description</CFormLabel>
        <CFormInput id="description" {...register('description', { required: true })} />
        {errors.description && (
          <CFormText className="text-danger">This field is required</CFormText>
        )}
      </CInputGroup>

      <CInputGroup>
        <CFormLabel htmlFor="type">Type</CFormLabel>
        <CFormSelect id="type" {...register('type', { required: true })}>
          {typeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </CFormSelect>
        {errors.type && <CFormText className="text-danger">This field is required</CFormText>}
      </CInputGroup>

      <ModuleContentInput type={watch('type')} value={watch('content')} setValue={setValue} />

      <CButton type="submit" color="primary" disabled={creatingModule}>
        {creatingModule ? <CSpinner size="sm" /> : 'Save'}
      </CButton>
    </CForm>
  )
}

type Inputs = {
  title: string
  description: string
  type: string
  content: string
}
