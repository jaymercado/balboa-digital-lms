'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import useGetCourses from '@/hooks/useGetCourses'
import toast from '@/utils/toast'
import { Loading } from '@/components'

export default function Course() {
  const router = useRouter()
  const params = useParams()
  const { courseId } = params as { courseId: string }
  const { courses, setCourses, fetchingCourses } = useGetCourses({ courseId })
  const course = courses[0]
  const [deletingCourse, setDeletingCourse] = useState(false)
  const [deletingModule, setDeletingModule] = useState(false)

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

  function deleteModule(moduleId: string) {
    setDeletingModule(true)
    fetch(`/api/courses/${courseId}/modules/${moduleId}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(() => {
        setCourses((state) =>
          state.map((course) => ({
            ...course,
            modules: course.modules.filter((module) => module.id !== moduleId),
          })),
        )
        toast('success', 'Module deleted successfully')
        router.push(`/managed-courses/${courseId}`)
      })
      .catch((err) => {
        console.error(err)
        toast('error', 'Error deleting course')
      })
      .finally(() => setDeletingModule(false))
  }

  if (fetchingCourses || !course) {
    return <Loading />
  }

  return (
    <div>
      <Link href={`/managed-courses/${course.id}/edit`}>Edit</Link> /
      <button type="button" onClick={() => deleteCourse(course.id)} disabled={deletingCourse}>
        Delete
      </button>
      <p>Course ID: {courseId}</p>
      <p>Title: {course.title}</p>
      <p>Description: {course.description}</p>
      <p>
        Enrollees:
        {course.enrollees.map((enrollee, index) => (
          <span key={enrollee.id}>
            {enrollee?.name} {index < course.enrollees.length - 1 ? ', ' : ''}
          </span>
        ))}
      </p>
      <p>
        Instructors:
        {course.instructors.map((instructor, index) => (
          <span key={instructor.id}>
            {instructor?.name} {index < course.instructors.length - 1 ? ', ' : ''}
          </span>
        ))}
      </p>
      <table>
        <thead>
          <tr>
            <th colSpan={3}>
              <Link href={`/managed-courses/${course.id}/modules/create`}>Create Module</Link>
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
            <tr key={module.id}>
              <td>
                <Link href={`/managed-courses/${course.id}/modules/${module.id}`}>{module.id}</Link>
              </td>
              <td>{module.title}</td>
              <td>{module.type}</td>
              <td>
                <Link href={`/managed-courses/${course.id}/modules/${module.id}/edit`}>Edit</Link>
                <button
                  type="button"
                  onClick={() => deleteModule(module.id)}
                  disabled={deletingModule}
                >
                  {deletingModule ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
