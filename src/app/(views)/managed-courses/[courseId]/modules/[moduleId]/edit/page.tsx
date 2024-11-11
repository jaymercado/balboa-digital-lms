'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
import Loading from '@/components/Loading'
import useGetModules from '@/hooks/useGetModules'

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

  const { courseModules, fetchingModules } = useGetModules({ courseId, moduleId })
  const [updatingModule, setUpdatingModule] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<Inputs>()

  function onSubmit(data: Inputs) {
    setUpdatingModule(true)
    fetch(`/api/courses/${courseId}/modules/${moduleId}`, {
      method: 'PUT',
      body: JSON.stringify({ ...data, courseId }),
    })
      .then((res) => {
        setUpdatingModule(false)
        toast('success', 'Module updated successfully')
        router.push(`/managed-courses/${courseId}/modules/${moduleId}`)
      })
      .catch((err) => {
        setUpdatingModule(false)
        toast('error', 'Error updating module')
        console.error(err)
      })
  }

  useEffect(() => {
    if (!fetchingModules && courseModules.length > 0) {
      const coursModule = courseModules[0]
      setValue('title', coursModule.title)
      setValue('description', coursModule.description)
      setValue('type', coursModule.type)
      setValue('content', coursModule.content)
    }
  }, [fetchingModules, courseModules, setValue])

  if (fetchingModules) {
    return <Loading />
  }

  return (
    <>
      {/* <CForm onSubmit={handleSubmit(onSubmit)}>
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

        <CButton type="submit" color="primary" disabled={updatingModule}>
          {updatingModule ? <CSpinner size="sm" /> : 'Save'}
        </CButton>
      </CForm> */}
      <CForm onSubmit={handleSubmit(onSubmit)}>
        <CCard className="p-4">
          <CRow>
            <CCol>
              <CCardTitle className="mb-4 fw-semibold"> Module Details</CCardTitle>
              <CFormLabel htmlFor="title" className="">
                Title
              </CFormLabel>
              <CFormInput id="title" {...register('title', { required: true })} />
              {errors.title && (
                <CFormText className="text-danger">This field is required</CFormText>
              )}
            </CCol>
          </CRow>

          <CRow className="mt-3">
            <CCol>
              <CFormLabel htmlFor="description" className="">
                Description
              </CFormLabel>
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
              <CFormLabel htmlFor="type" className="">
                Type
              </CFormLabel>
              <CInputGroup className="mb-3">
                <CFormSelect id="type" {...register('type', { required: true })}>
                  {typeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </CFormSelect>
                {errors.type && (
                  <CFormText className="text-danger">This field is required</CFormText>
                )}
              </CInputGroup>

              <ModuleContentInput
                type={watch('type')}
                value={watch('content')}
                setValue={setValue}
              />
            </CCol>
          </CRow>

          <CRow className="mt-4">
            <CCol xs={12} sm={3} md={1}>
              <CButton
                type="submit"
                color="primary"
                className="w-100 text-white"
                disabled={updatingModule}
              >
                {updatingModule ? <CSpinner size="sm" /> : 'Save'}
              </CButton>
            </CCol>
          </CRow>
        </CCard>
      </CForm>
    </>
  )
}

type Inputs = {
  title: string
  description: string
  type: string
  content: string
}
