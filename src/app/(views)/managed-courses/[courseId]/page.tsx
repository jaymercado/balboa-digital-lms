'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import useGetCourses from '@/hooks/useGetCourses'
import toast from '@/utils/toast'

export default function Course() {
  const router = useRouter()
  const params = useParams()
  const { courseId } = params as { courseId: string }
  const { courses, fetchingCourses } = useGetCourses({ courseId })
  const course = courses[0]
  const [deletingCourse, setDeletingCourse] = useState(false)

  function deleteCourse(courseId: string) {
    setDeletingCourse(true)
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
      .finally(() => setDeletingCourse(false))
  }

  if (fetchingCourses || !course) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Link href={`/managed-courses/${course._id}/edit`}>Edit</Link> /
      <button type="button" onClick={() => deleteCourse(course._id)} disabled={deletingCourse}>
        Delete
      </button>
      <p>Course ID: {courseId}</p>
      <p>Title: {course.title}</p>
      <p>Description: {course.description}</p>
      <p>
        Enrollees:
        {course.enrollees.map((enrollee) => (
          <span key={enrollee._id}>{enrollee?.name} </span>
        ))}
      </p>
      <p>
        Instructors:
        {course.instructors.map((instructor) => (
          <span key={instructor._id}>{instructor?.name} </span>
        ))}
      </p>
      <table>
        <thead>
          <tr>
            <th colSpan={3}>
              <Link href={`/managed-courses/${course._id}/modules/create`}>Create Module</Link>
            </th>
          </tr>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {course.modules.map((module) => (
            <tr key={module._id}>
              <td>
                <Link href={`/managed-courses/${course._id}/modules/${module._id}`}>
                  {module._id}
                </Link>
              </td>
              <td>{module.title}</td>
              <td>{module.type}</td>
              <td>
                <Link href={`/managed-courses/${course._id}/modules/${module._id}/edit`}>Edit</Link>
                <button type="button" onClick={() => {}}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
