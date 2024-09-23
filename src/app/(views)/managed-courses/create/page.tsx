'use client'

import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import useGetUsers from '@/hooks/useGetUsers'
import toast from '@/utils/toast'

export default function CreateCourse() {
  const { users, fetchingUsers } = useGetUsers()
  const [creatingCourse, setCreatingCourse] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setCreatingCourse(true)
    fetch('/api/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(() => {
        toast('success', 'Course created successfully')
      })
      .catch((err) => {
        toast('error', 'Error creating course')
        console.error(err)
      })
      .finally(() => setCreatingCourse(false))
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

      <button type="submit" disabled={creatingCourse}>
        Create
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