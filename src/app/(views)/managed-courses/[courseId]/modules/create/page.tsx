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
  CRow,
  CCol,
  CFormTextarea,
  CCard,
  CFormSelect,
  CCardTitle,
} from '@coreui/react-pro'
import toast from '@/utils/toast'
import ModuleContentInput from '@/components/ModuleContentInput'
import CancelButton from '@/components/CancelButton'

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
    const content = watch('content')
    if (!content || content === '<p><br></p>' || content.trim() === '') {
      data.content = ''
    }

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
      <CCard className="p-4">
        <CRow>
          <CCol>
            <CCardTitle className="mb-4 fw-semibold"> Module Details</CCardTitle>
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
        <CRow className="mt-3">
          <CCol>
            <CFormLabel htmlFor="type">Type</CFormLabel>
            <CInputGroup className="mb-3">
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
          </CCol>
        </CRow>

        <CRow className="mt-4">
          <CCol className="d-flex gap-2">
            <CancelButton />
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
