'use client'

import { useState, useEffect, useCallback } from 'react'
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
import { CourseItem } from '@/types/courseItem'
import toast from '@/utils/toast'
import useGetUsers from '@/hooks/useGetUsers'
import { useGetCourse } from '@/hooks/useGetCourses'
import { Loading } from '@/components'
import { EditCourseItemsOrder } from '@/components'

type UserOption = {
  value: string
  label: string
  role: 'user' | 'instructor' | 'admin'
}

export default function EditCourse() {
  const router = useRouter()
  const params = useParams()
  const { courseId } = params as { courseId: string }

  const { course, fetchingCourse } = useGetCourse({ courseId })
  const { users, fetchingUsers } = useGetUsers()
  const [courseItems, setCourseItems] = useState<CourseItem[]>(course?.courseItems || [])
  const [updatingCourse, setUpdatingCourse] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<Inputs>()

  const onSubmit = useCallback(
    (data: Inputs) => {
      setUpdatingCourse(true)
      fetch(`/api/courses/${courseId}`, {
        method: 'PUT',
        body: JSON.stringify({ ...data, courseItems }),
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
    },
    [courseId, courseItems, router],
  )

  useEffect(() => {
    if (!fetchingCourse && course) {
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
      setCourseItems(course.courseItems)
    }
  }, [fetchingCourse, course, setValue])

  if (fetchingCourse) {
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
                    className="react-select-container"
                    classNamePrefix="react-select"
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
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                )}
              />
            )}
            {errors.instructors && (
              <CFormText className="text-danger">This field is required</CFormText>
            )}
          </CCol>
        </CRow>

        {course && (
          <CRow className="mt-4">
            <p className="mb-0 pb-0">Items</p>
            <p className="text-muted small text-sm mt-0 pt-0">
              Drag and drop items to change their order
            </p>
            <CCol className="d-flex gap-2">
              <div className="w-100">
                <EditCourseItemsOrder courseItems={courseItems} setCourseItems={setCourseItems} />
              </div>
            </CCol>
          </CRow>
        )}

        <CRow className="mt-4">
          <CCol className="d-flex gap-2">
            <CButton color="light" onClick={() => router.back()}>
              Cancel
            </CButton>
            <CButton type="submit" color="primary" className="text-white" disabled={updatingCourse}>
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
