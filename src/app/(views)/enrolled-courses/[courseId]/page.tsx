'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useGetCourse } from '@/hooks/useGetCourses'
import { CCard, CCardBody, CCardTitle, CCardText, CRow, CCol, CBadge } from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilPenAlt, cilPeople } from '@coreui/icons'
import { Loading, CourseItemsTable, EnrolledCourseActionButton } from '@/components'

export default function Course() {
  const params = useParams()
  const router = useRouter()
  const { courseId } = params as { courseId: string }
  const { course, fetchingCourse, courseNotFound } = useGetCourse({ courseId })

  useEffect(() => {
    if (!fetchingCourse && courseNotFound) {
      router.replace('/404')
    }
  }, [fetchingCourse, courseNotFound, router])

  if (fetchingCourse) {
    return <Loading />
  }

  if (courseNotFound) {
    return null
  }

  return (
    <CRow>
      <CCol>
        <CCard className="mb-4">
          <CCardBody>
            <CRow>
              <CCol>
                <CBadge color="primary" shape="rounded-pill" className="text-normal mb-2">
                  Course ID: {courseId}
                </CBadge>
                <CCardTitle className="fw-semibold fs-4">{course?.title}</CCardTitle>
              </CCol>
              <CCol className="justify-content-end d-flex">
                <EnrolledCourseActionButton courseId={course?.id || ''} />
              </CCol>
            </CRow>
            <CCardText className="text-secondary">{course?.description}</CCardText>
            <CCardText>
              <CIcon icon={cilPeople} size="sm" className="me-2" />
              <strong>Enrollees:</strong>{' '}
              {course?.enrollees.map((enrollee, index) => (
                <span key={enrollee.id}>
                  {enrollee?.name} {index < course?.enrollees.length - 1 ? ', ' : ''}
                </span>
              ))}
            </CCardText>
            <CCardText>
              <CIcon icon={cilPenAlt} size="sm" className="me-2" />
              <strong>Instructors:</strong>{' '}
              {course?.instructors.map((instructor, index) => (
                <span key={instructor.id}>
                  {instructor?.name} {index < course?.instructors.length - 1 ? ', ' : ''}
                </span>
              ))}
            </CCardText>
          </CCardBody>
        </CCard>

        <CCard className="mb-3 p-3">
          <CCol>
            <CRow className="mb-3">
              <CCol>
                <div className="fs-4 fw-bold">Items</div>
                <Link
                  href={`/enrolled-courses/${course?.id}/items`}
                  className="me-2 text-decoration-none"
                >
                  <small className="text-secondary d-none d-sm-inline">View All Items</small>
                  <small className="text-secondary d-inline d-sm-none">View All</small>
                  <i className="bi bi-chevron-right text-secondary"></i>
                </Link>
              </CCol>
            </CRow>
            <CourseItemsTable courseId={course?.id || ''} />
          </CCol>
        </CCard>
      </CCol>
    </CRow>
  )
}
