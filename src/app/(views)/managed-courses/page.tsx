'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  CCard,
  CCardBody,
  CButton,
  CCardImage,
  CCardText,
  CCardTitle,
  CCol,
  CRow,
} from '@coreui/react-pro'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal'
import { Course } from '@/types/course'
import useGetCourses from '@/hooks/useGetCourses'
import toast from '@/utils/toast'
import { Loading } from '@/components'
import { cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

export default function ManagedCourses() {
  const [deletingCourse, setDeletingCourse] = useState(false)
  const { courses, setCourses, fetchingCourses } = useGetCourses({ type: 'managed' })
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)

  function deleteCourse(courseId: string) {
    setDeletingCourse(true)
    fetch(`/api/courses/${courseId}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((deletedCourse: Course) => {
        setCourses(courses.filter((course) => course?.id !== deletedCourse?.id))
        toast('success', 'Course deleted successfully')
      })
      .catch((err) => {
        console.error(err)
        toast('error', 'Error deleting course')
      })
      .finally(() => setDeletingCourse(false))
  }

  return (
    <CCard className="h-100 mb-4">
      <CCardBody>
        <CCardTitle className="d-flex justify-content-between align-items-center fw-bold mb-3">
          <span className="d-none d-sm-inline">Your Managed Courses ({courses.length})</span>
          <span className="d-inline d-sm-none">Courses ({courses.length})</span>
          <CButton
            color="primary"
            href="/managed-courses/create"
            disabled={courses.length <= 0}
            className="bg-primary-emphasis text-primary-emphasis fw-semibold"
          >
            <CIcon icon={cilPlus} className="me-2" />
            <span className="d-none d-sm-inline">Create Course</span>
            <span className="d-inline d-sm-none">Create</span>
          </CButton>
        </CCardTitle>
        {fetchingCourses ? (
          <Loading />
        ) : (
          <CRow xs={{ cols: 1 }} md={{ cols: 2 }} lg={{ cols: 4 }} className="g-3">
            {courses.length > 0 ? (
              courses.map((course) => (
                <div>
                  <CCol key={course.id}>
                    <CCard className="h-100">
                      <Link
                        href={`/managed-courses/${course.id}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <CCardImage orientation="top" src="/images/react.jpg" alt={course.title} />
                      </Link>
                      <CCardBody className="d-flex flex-column">
                        <Link
                          href={`/managed-courses/${course.id}`}
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          <CCardTitle
                            className="text-dark-emphasis text-truncate"
                            style={{ fontSize: '1rem' }}
                          >
                            {course.title}
                          </CCardTitle>
                          <CCardText
                            className="text-secondary text-truncate mb-2"
                            style={{ fontSize: '0.9rem' }}
                          >
                            {course.description}
                          </CCardText>
                        </Link>
                        <div className="d-flex justify-content-end mt-auto">
                          <Link
                            href={`/managed-courses/${course.id}`}
                            className="me-2 d-flex align-items-center gap-1"
                            style={{ textDecoration: 'none' }}
                          >
                            <small className="text-secondary d-none d-sm-inline">View Course</small>
                            <i className="bi bi-chevron-right text-secondary"></i>
                          </Link>
                        </div>
                      </CCardBody>
                    </CCard>
                  </CCol>
                  <ConfirmDeleteModal
                    visible={isDeleteModalVisible}
                    onClose={() => setIsDeleteModalVisible(false)}
                    onConfirm={() => [deleteCourse(course.id), setIsDeleteModalVisible(false)]}
                    disabled={deletingCourse}
                  />
                </div>
              ))
            ) : (
              <div className="text-center">No courses found</div>
            )}
          </CRow>
        )}
      </CCardBody>
    </CCard>
  )
}
