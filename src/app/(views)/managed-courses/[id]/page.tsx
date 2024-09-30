'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import useGetCourses from '@/hooks/useGetCourses'
import toast from '@/utils/toast'

export default function EditCourse() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.id as string

  const { courses, fetchingCourses } = useGetCourses({ courseId })
  const [deletingCourse, setDeletingCourse] = useState('')

  function deleteCourse(courseId: string) {
    setDeletingCourse(courseId)
    fetch(`/api/courses/${courseId}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(() => {
        toast('success', 'Course deleted successfully')
        router.push('/managed-courses')
      })
      .catch((err) => {
        console.error(err)
        toast('error', 'Error deleting course')
      })
      .finally(() => setDeletingCourse(''))
  }

  if (fetchingCourses) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Link href={`/managed-courses/${courses[0]?._id}/edit`}>Edit</Link> /
      <button
        type="button"
        onClick={() => deleteCourse(courses[0]?._id)}
        disabled={deletingCourse === courses[0]?._id}
      >
        Delete
      </button>
      <p>Course ID: {courseId}</p>
      <p>Title: {courses[0]?.title}</p>
      <p>Description: {courses[0]?.description}</p>
      <p>
        Enrollees:
        {courses[0]?.enrollees.map((enrollee) => (
          <span key={enrollee._id}>{enrollee?.name} </span>
        ))}
      </p>
      <p>
        Instructors:
        {courses[0]?.instructors.map((instructor) => (
          <span key={instructor._id}>{instructor?.name} </span>
        ))}
      </p>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses[0]?.modules.map((module) => (
            <tr key={module._id}>
              <td>
                <Link href={`/managed-courses/${courses[0]?._id}/modules/${module._id}`}>
                  {module._id}
                </Link>
              </td>
              <td>{module.title}</td>
              <td>{module.type}</td>
              <td>
                <Link href={`/managed-courses/${courses[0]?._id}/modules/${module._id}/edit`}>
                  Edit
                </Link>
                <button type="button" onClick={() => {}}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

type Inputs = {
  title: string
  description: string
  enrollees: string[]
  instructors: string[]
}
