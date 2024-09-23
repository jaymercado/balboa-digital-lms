'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CCard, CCardHeader, CCardBody } from '@coreui/react-pro'
import { Course } from '@/types/courseType'
import { CreateLink } from '@/components'
import useGetCourses from '@/hooks/useGetCourses'
import toast from '@/utils/toast'

export default function ManagedCourses() {
  const [deletingCourse, setDeletingCourse] = useState('')
  const { courses, setCourses, fetchingCourses } = useGetCourses({ type: 'managed' })

  function deleteCourse(courseId: string) {
    setDeletingCourse(courseId)
    fetch(`/api/courses/${courseId}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((deletedCourse: Course) => {
        setCourses(courses.filter((course) => course?._id !== deletedCourse?._id))
        toast('success', 'Course deleted successfully')
      })
      .catch((err) => {
        console.error(err)
        toast('error', 'Error deleting course')
      })
      .finally(() => setDeletingCourse(''))
  }

  return (
    <CCard className="mb-4">
      <CCardHeader>
        Courses
        <CreateLink href="/managed-courses/create" text="Create" />
      </CCardHeader>
      <CCardBody>
        {fetchingCourses ? (
          <div>Loading...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.length === 0 && (
                <tr>
                  <td colSpan={3}>No courses found</td>
                </tr>
              )}
              {courses.map((course) => (
                <tr key={course._id}>
                  <td>
                    <Link href={`/managed-courses/${course._id}`}>{course._id}</Link>
                  </td>
                  <td>{course.title}</td>
                  <td>{course.description}</td>
                  <td>
                    <Link href={`/managed-courses/${course._id}/edit`}>Edit</Link> /
                    <button
                      type="button"
                      onClick={() => deleteCourse(course._id)}
                      disabled={deletingCourse === course._id}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CCardBody>
    </CCard>
  )
}
