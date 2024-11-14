'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import {
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
  CSpinner,
  CFormText,
  CCol,
  CFormTextarea,
  CRow,
  CCard,
} from '@coreui/react-pro'
import Select, { MultiValue } from 'react-select'
import useGetUsers from '@/hooks/useGetUsers'
import useGetCourses from '@/hooks/useGetCourses'
import toast from '@/utils/toast'
import { Loading } from '@/components'
type UserOption = {
  value: string
  label: string
  role: 'user' | 'instructor' | 'admin'
}

export default function EditCourse() {
  const router = useRouter()
  const params = useParams()
  const { courseId } = params as { courseId: string }

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

  function onSubmit(data: Inputs) {
    setUpdatingCourse(true)
    fetch(`/api/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
      .then(() => {
        setUpdatingCourse(false)
        toast('success', 'Course updated successfully')
        router.push(`/managed-courses/${courseId}`)
      })
      .catch((err) => {
        setUpdatingCourse(false)
        toast('error', 'Error updating course')
        console.error(err)
      })
  }

  useEffect(() => {
    if (!fetchingCourses && courses.length > 0) {
      const course = courses[0]
      setValue('title', course.title)
      setValue('description', course.description)
      setValue(
        'enrollees',
        course.enrollees.map((enrollee) => enrollee.id),
      )
      setValue(
        'instructors',
        course.instructors.map((instructor) => instructor.id),
      )
    }
  }, [fetchingCourses, courses, setValue])

  if (fetchingCourses) {
    return <Loading />
  }

  const userOptions: UserOption[] = users.map((user) => ({
    value: user.id,
    label: user.name,
    role: user.role,
  }))

  return (
    <CCard className="p-4">
      <CForm onSubmit={handleSubmit(onSubmit)}>
        <CRow>
          <CCol>
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
            <CFormLabel htmlFor="enrollees">Enrollees</CFormLabel>
            {fetchingUsers ? (
              <CRow className="d-flex justify-content-center align-items-center">
                <CSpinner color="primary" />
              </CRow>
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
            {errors.enrollees && (
              <CFormText className="text-danger">This field is required</CFormText>
            )}
          </CCol>
        </CRow>
        <CRow className="mt-3">
          <CCol>
            <CFormLabel htmlFor="instructors">Instructors</CFormLabel>
            {fetchingUsers ? (
              <CRow className="d-flex justify-content-center align-items-center">
                <CSpinner color="primary" />
              </CRow>
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
          </CCol>
        </CRow>

        <CRow className="mt-4">
          <CCol xs={12} sm={3} md={1}>
            <CButton
              type="submit"
              color="primary"
              className="w-100 text-white"
              disabled={updatingCourse}
            >
              {updatingCourse ? <CSpinner size="sm" /> : 'Save'}
            </CButton>
          </CCol>
        </CRow>
      </CForm>
    </CCard>
  )
}

type Inputs = {
  title: string
  description: string
  enrollees: string[]
  instructors: string[]
}
