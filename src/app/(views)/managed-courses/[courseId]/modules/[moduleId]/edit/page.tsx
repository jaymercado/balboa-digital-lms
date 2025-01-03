'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
import { useGetCourseModule } from '@/hooks/useGetCourseModules'
import { Loading, ModuleContentInput } from '@/components'

const typeOptions = [
  { value: '', label: '-- Select --' },
  { value: 'text', label: 'Text' },
  { value: 'video', label: 'Video' },
  { value: 'image', label: 'Image' },
  { value: 'pdf', label: 'PDF' },
]

export default function EditModule() {
  const router = useRouter()
  const params = useParams()
  const { courseId, moduleId } = params as { courseId: string; moduleId: string }
  const { fetchingModule, courseModule } = useGetCourseModule({ courseId, moduleId })
  const [updatingModule, setUpdatingModule] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [fileExtension, setFileExtension] = useState<string>('')
  const [currentFile, setCurrentFile] = useState<File | null>(null)
  const [dataInitialized, setDataInitialized] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<Inputs>()

  const convertToFile = async (url: string): Promise<File> => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const fileName = url.split('/').pop() || 'file'
      return new File([blob], fileName, { type: blob.type })
    } catch (err) {
      console.error('Error fetching and converting the file:', err)
      throw err
    }
  }

  const fetchCurrentFile = useCallback(async (url: string) => {
    try {
      const file = await convertToFile(url)
      setCurrentFile(file)
      const fileExtension = file.name.split('.').pop() || ''
      setFileExtension(fileExtension)
    } catch (err) {
      console.error('Error fetching and converting the file:', err)
    }
  }, [])

  function onSubmit(data: Inputs) {
    const content = watch('content')
    if (!content || content === '<p><br></p>' || content.trim() === '') {
      data.content = ''
    }

    setUpdatingModule(true)

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
      .put(`/api/courses/${courseId}/modules/${moduleId}`, formData, {
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
              setUpdatingModule(false)
              toast('success', 'Module updated successfully')
              window.location.href = `/managed-courses/${courseId}/modules/${moduleId}`
            })
          } else {
            setUpdatingModule(false)
            toast('success', 'Module updated successfully')
            window.location.href = `/managed-courses/${courseId}/modules/${moduleId}`
          }
        } else {
          throw new Error('Failed to update module')
        }
      })
      .catch((err) => {
        setUpdatingModule(false)
        toast('error', 'Error updating module')
        console.error(err)
      })
  }

  useEffect(() => {
    if (!fetchingModule && courseModule && !dataInitialized) {
      setValue('title', courseModule.title)
      setValue('description', courseModule.description)
      setValue('type', courseModule.type)
      setValue('content', courseModule.content)

      if (courseModule.content && courseModule.type !== 'text') {
        fetchCurrentFile(courseModule.content)
      }
      setDataInitialized(true)
    }
  }, [fetchingModule, courseModule, setValue, fetchCurrentFile, dataInitialized])

  if (fetchingModule) {
    return <Loading />
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

            <ModuleContentInput
              type={watch('type')}
              value={watch('content')}
              setValue={setValue}
              setFile={setFile}
              setFileExtension={setFileExtension}
              currentFile={currentFile}
            />
          </CCol>
        </CRow>

        <CRow className="mt-4">
          <CCol className="d-flex gap-2">
            <CButton color="light" onClick={() => router.back()}>
              Cancel
            </CButton>
            <CButton type="submit" color="primary" className="text-white" disabled={updatingModule}>
              {updatingModule ? <CSpinner size="sm" /> : 'Save'}
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
