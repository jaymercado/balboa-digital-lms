'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
} from '@coreui/react-pro'
import { Course } from '@/types/course'
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
        <CButton color="primary" variant="outline" size="sm" href="/managed-courses/create">
          Create
        </CButton>
      </CCardHeader>
      <CCardBody>
        {fetchingCourses ? (
          <div>Loading...</div>
        ) : (
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>ID</CTableHeaderCell>
                <CTableHeaderCell>Title</CTableHeaderCell>
                <CTableHeaderCell>Description</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {courses.length === 0 && (
                <CTableRow>
                  <CTableDataCell colSpan={4}>No courses found</CTableDataCell>
                </CTableRow>
              )}
              {courses.map((course) => (
                <CTableRow key={course._id}>
                  <CTableDataCell>
                    <Link href={`/managed-courses/${course._id}`}>{course._id}</Link>
                  </CTableDataCell>
                  <CTableDataCell>{course.title}</CTableDataCell>
                  <CTableDataCell>{course.description}</CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="primary"
                      variant="outline"
                      size="sm"
                      href={`/managed-courses/${course._id}/edit`}
                    >
                      Edit
                    </CButton>
                    <CButton
                      color="danger"
                      variant="outline"
                      size="sm"
                      onClick={() => deleteCourse(course._id)}
                      disabled={deletingCourse === course._id}
                    >
                      Delete
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}
      </CCardBody>
    </CCard>
  )
}
