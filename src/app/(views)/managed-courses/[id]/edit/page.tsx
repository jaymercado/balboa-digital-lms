'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import useGetUsers from '@/hooks/useGetUsers'
import useGetCourses from '@/hooks/useGetCourses'
import toast from '@/utils/toast'

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
      setValue('enrollees', course.enrollees)
      setValue('instructors', course.instructors)
    }
  }, [fetchingCourses, courses, setValue])

  if (fetchingCourses) {
    return <div>Loading...</div>
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="title">Title</label>
        <input id="title" {...register('title', { required: true })} />
        {errors.title && <span>This field is required</span>}
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <input id="description" {...register('description', { required: true })} />
        {errors.description && <span>This field is required</span>}
      </div>

      <div>
        <label htmlFor="enrollees">Enrollees</label>
        {fetchingUsers ? (
          <div>Loading users...</div>
        ) : (
          <select id="enrollees" multiple {...register('enrollees', { required: true })}>
            {users.map((user, index) => (
              <option key={`user-${index}`} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        )}
        {errors.enrollees && <span>This field is required</span>}
      </div>

      <div>
        <label htmlFor="instructors">Instructors</label>
        {fetchingUsers ? (
          <div>Loading users...</div>
        ) : (
          <select id="instructors" multiple {...register('instructors', { required: true })}>
            {users
              .filter((user) => user.role === 'instructor')
              .map((user, index) => (
                <option key={`user-${index}`} value={user._id}>
                  {user.name}
                </option>
              ))}
          </select>
        )}
        {errors.instructors && <span>This field is required</span>}
      </div>

      <button type="submit" disabled={updatingCourse}>
        submit
      </button>
    </form>
  )
}

type Inputs = {
  title: string
  description: string
  enrollees: string[]
  instructors: string[]
}
