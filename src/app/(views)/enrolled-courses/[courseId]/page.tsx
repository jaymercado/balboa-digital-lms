'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useGetCourse } from '@/hooks/useGetCourses'
import { CCard, CCardBody, CCardTitle, CCardText, CRow, CCol, CBadge } from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilPenAlt, cilPeople } from '@coreui/icons'
import { useGetUserCourseItemLogs } from '@/hooks/useGetUserCourseItemLogs'
import { areAllCourseItemsCompleted } from '@/utils/areAllCoursesCompleted'
import { Loading, CourseItemsTable, EnrolledCourseActionButton } from '@/components'
import CertificateGenerator from '@/components/CertificateGenerator'

export default function Course() {
  const params = useParams()
  const { courseId } = params as { courseId: string }
  const { course, fetchingCourse } = useGetCourse({ courseId })
  const { userCourseItemLogs, fetchingUserCourseItemLogs } = useGetUserCourseItemLogs({ courseId })

  if (fetchingCourse) {
    return <Loading />
  }

  // TODO: Add a 404 page
  if (!course) {
    return <div>Course not found</div>
  }

  const areAllModulesAndQuizzesCompleted = areAllCourseItemsCompleted(userCourseItemLogs)

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
                <CCardTitle className="fw-semibold fs-4">{course.title}</CCardTitle>
              </CCol>
              <CCol className="justify-content-end d-flex">
                <EnrolledCourseActionButton courseId={course.id} />
              </CCol>
            </CRow>
            <CCardText className="text-secondary">{course.description}</CCardText>
            <CCardText>
              <CIcon icon={cilPeople} size="sm" className="me-2" />
              <strong>Enrollees:</strong>{' '}
              {course.enrollees.map((enrollee, index) => (
                <span key={enrollee.id}>
                  {enrollee?.name} {index < course.enrollees.length - 1 ? ', ' : ''}
                </span>
              ))}
            </CCardText>
            <CCardText>
              <CIcon icon={cilPenAlt} size="sm" className="me-2" />
              <strong>Instructors:</strong>{' '}
              {course.instructors.map((instructor, index) => (
                <span key={instructor.id}>
                  {instructor?.name} {index < course.instructors.length - 1 ? ', ' : ''}
                </span>
              ))}
            </CCardText>

            {userCourseItemLogs?.length > 0 && (
              <CertificateGenerator
                name="Alexander Oxales"
                course={course.title}
                instructors={course.instructors}
                isDisabled={!areAllModulesAndQuizzesCompleted}
              />
            )}
          </CCardBody>
        </CCard>

        <CRow className="mb-3">
          <CCol>
            <CRow className="mb-3">
              <CCol>
                <div className="fs-4 fw-bold">Items</div>
                <Link
                  href={`/enrolled-courses/${course.id}/items`}
                  className="me-2 text-decoration-none"
                >
                  <small className="text-secondary d-none d-sm-inline">View All Items</small>
                  <small className="text-secondary d-inline d-sm-none">View All</small>
                  <i className="bi bi-chevron-right text-secondary"></i>
                </Link>
              </CCol>
            </CRow>
            <CourseItemsTable courseId={course.id} userIsStudent={true} />
          </CCol>
        </CRow>
      </CCol>
    </CRow>
  )
}
