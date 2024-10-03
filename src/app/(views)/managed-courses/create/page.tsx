'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import {
  CForm,
  CInputGroup,
  CFormLabel,
  CFormInput,
  CButton,
  CSpinner,
  CFormText,
} from '@coreui/react-pro'
import Select, { MultiValue } from 'react-select'
import useGetUsers from '@/hooks/useGetUsers'
import toast from '@/utils/toast'

export default function CreateCourse() {
  const router = useRouter()
  const { users, fetchingUsers } = useGetUsers()
  const [creatingCourse, setCreatingCourse] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<Inputs>()

  function onSubmit(data: Inputs) {
    setCreatingCourse(true)
    fetch('/api/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((course) => {
        toast('success', 'Course created successfully')
        router.push(`/managed-courses/${course._id}`)
      })
      .catch((err) => {
        toast('error', 'Error creating course')
        console.error(err)
      })
      .finally(() => setCreatingCourse(false))
  }

  const userOptions: UserOption[] = users.map((user) => ({
    value: user._id,
    label: user.name,
    role: user.role,
  }))

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
        <CFormLabel htmlFor="enrollees">Enrollees</CFormLabel>
        {fetchingUsers ? (
          <CSpinner color="primary" />
        ) : (
          <Controller
            name="enrollees"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                id="enrollees"
                isMulti
                options={userOptions}
                onChange={(selectedOptions: MultiValue<UserOption>) => {
                  field.onChange(selectedOptions.map((option) => option.value))
                }}
                onBlur={field.onBlur}
                value={userOptions.filter((option) => field?.value?.includes(option?.value))}
              />
            )}
          />
        )}
        {errors.enrollees && <CFormText className="text-danger">This field is required</CFormText>}
      </CInputGroup>
      <CInputGroup>
        <CFormLabel htmlFor="instructors">Instructors</CFormLabel>
        {fetchingUsers ? (
          <CSpinner color="primary" />
        ) : (
          <Controller
            name="instructors"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                id="instructors"
                isMulti
                options={userOptions.filter((user) => user.role === 'instructor')}
                onChange={(selectedOptions: MultiValue<UserOption>) => {
                  field.onChange(selectedOptions.map((option) => option.value))
                }}
                onBlur={field.onBlur}
                value={userOptions.filter((option) => field?.value?.includes(option?.value))}
              />
            )}
          />
        )}
        {errors.instructors && (
          <CFormText className="text-danger">This field is required</CFormText>
        )}
      </CInputGroup>
      <CButton type="submit" color="primary" disabled={creatingCourse}>
        {creatingCourse ? <CSpinner size="sm" /> : 'Create'}
      </CButton>
    </CForm>
  )
}

type UserOption = {
  value: string
  label: string
  role: 'user' | 'instructor' | 'admin'
}

type Inputs = {
  title: string
  description: string
  enrollees: string[]
  instructors: string[]
}
