'use client'

import React, { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios'
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

const typeOptions = [{ value: 'text', label: 'Text' }]

export default function CreateModule() {
  const router = useRouter()
  const { courseId } = useParams()
  const [creatingModule, setCreatingModule] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [fileExtension, setFileExtension] = useState<string>('')

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
    if (file && ['video', 'image', 'pdf'].includes(data.type)) {
      formData.append('fileExtension', fileExtension)
    }
    formData.append('courseId', courseId as string)

    axios
      .post(`/api/courses/${courseId}/modules`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        if (res.status === 200) {
          const { awsS3UploadUrl } = res.data
          if (awsS3UploadUrl) {
            fetch(awsS3UploadUrl, {
              method: 'PUT',
              body: file,
              headers: {
                'Content-Type': fileExtension,
              },
            }).then(() => {
              setCreatingModule(false)
              toast('success', 'Module created successfully')
              router.push(`/managed-courses/${courseId}`)
            })
          } else {
            setCreatingModule(false)
            toast('success', 'Module created successfully')
            router.push(`/managed-courses/${courseId}`)
          }
        } else {
          throw new Error('Failed to create module')
        }
      })
      .catch((err) => {
        setCreatingModule(false)
        toast('error', 'Error creating module')
        console.error(err)
      })
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
            <CInputGroup className="mb-3">
              <CFormSelect id="type" {...register('type', { required: true })} defaultValue="text">
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </CFormSelect>
              {errors.type && <CFormText className="text-danger">This field is required</CFormText>}
            </CInputGroup>

            <ModuleContentInput
              type={watch('type')}
              value={watch('content')}
              setValue={setValue}
              setFile={setFile}
              setFileExtension={setFileExtension}
              currentFile={null}
            />
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
