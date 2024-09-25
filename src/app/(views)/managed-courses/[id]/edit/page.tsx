'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
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
import useGetCourses from '@/hooks/useGetCourses'
import toast from '@/utils/toast'

type UserOption = {
  value: string
  label: string
  role: 'user' | 'instructor' | 'admin'
}

export default function EditCourse() {
  const params = useParams()
  const courseId = params.id as string

  const { courses, fetchingCourses } = useGetCourses({ courseId })
  const { users, fetchingUsers } = useGetUsers()
  const [updatingCourse, setUpdatingCourse] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setUpdatingCourse(true)
    fetch(`/api/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
      .then((res) => {
        toast('success', 'Course updated successfully')
      })
      .catch((err) => {
        toast('error', 'Error updating course')
        console.error(err)
      })
      .finally(() => setUpdatingCourse(false))
  }

  useEffect(() => {
    if (!fetchingCourses && courses.length > 0) {
      const course = courses[0]
      setValue('title', course.title)
      setValue('description', course.description)
      setValue(
        'enrollees',
        course.enrollees.map((enrollee) => enrollee._id),
      )
      setValue(
        'instructors',
        course.instructors.map((instructor) => instructor._id),
      )
    }
  }, [fetchingCourses, courses, setValue])

  if (fetchingCourses) {
    return <div>Loading...</div>
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

      <CButton type="submit" color="primary" disabled={updatingCourse}>
        {updatingCourse ? <CSpinner size="sm" /> : 'Create'}
      </CButton>
    </CForm>
  )
}

type Inputs = {
  title: string
  description: string
  enrollees: string[]
  instructors: string[]
}
