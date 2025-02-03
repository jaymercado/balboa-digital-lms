'use client'
import React from 'react'
import Link from 'next/link'
import CIcon from '@coreui/icons-react'
import { CRow, CCol, CCard, CCardBody, CCardTitle, CTable, CBadge } from '@coreui/react-pro'
import { cilEducation, cilBadge, cilBook } from '@coreui/icons'
import { useGetAllUserCourseItemLogs } from '@/hooks/useGetAllUserCourseItemLogs'
import Loading from './Loading'

export default function StudentDashboard() {
  const { coursesWithCompletionStatus, fetchingUserCourseItemLogs } = useGetAllUserCourseItemLogs()
  const completedCourses = coursesWithCompletionStatus.filter((course) => course.completed)
  const inProgressCourses = coursesWithCompletionStatus.filter(
    (course) => course.completed === false,
  )

  return (
    <div>
      <CRow>
        <CCol className="mb-3">
          <CCard className="p-3 bg-primary-subtle text-primary-emphasis d-flex justify-content-between flex-row">
            <div className="border-start border-start-4 border-start-primary py-1 px-3">
              <div className="text-secondary text-truncate small">Enrolled Courses</div>
              <div className="fs-4 fw-semibold">{coursesWithCompletionStatus?.length}</div>
            </div>
            <div className="bg-primary bg-opacity-25 rounded p-3 d-flex align-items-center">
              <CIcon icon={cilEducation} color="primary" size="xl" />
            </div>
          </CCard>
        </CCol>
        <CCol className="mb-3">
          <CCard className="p-3 bg-success-subtle text-success-emphasis d-flex justify-content-between flex-row">
            <div className="border-start border-start-4 border-start-success py-1 px-3">
              <div className="text-secondary text-truncate small">Completed Courses</div>
              <div className="fs-4 fw-semibold">{completedCourses?.length}</div>
            </div>
            <div className="bg-success bg-opacity-25 rounded p-3 d-flex align-items-center">
              <CIcon icon={cilBadge} color="success" size="xl" />
            </div>
          </CCard>
        </CCol>
        <CCol className="mb-3">
          <CCard className="p-3 bg-warning-subtle text-warning-emphasis d-flex justify-content-between flex-row">
            <div className="border-start border-start-4 border-start-warning py-1 px-3">
              <div className="text-secondary text-truncate small">Courses In Progress</div>
              <div className="fs-4 fw-semibold">{inProgressCourses?.length}</div>
            </div>
            <div className="bg-warning bg-opacity-25 rounded p-3 d-flex align-items-center">
              <CIcon icon={cilBook} color="warning" size="xl" />
            </div>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <CCard className="h-100">
            <CCardBody>
              <CCardTitle className="d-flex justify-content-between align-items-center mb-3">
                <span className="fw-bold">Courses</span>{' '}
                <Link href={`/enrolled-courses`} className="text-decoration-none">
                  <span className="fs-6 text-secondary">View All</span>
                </Link>
              </CCardTitle>
              {fetchingUserCourseItemLogs ? (
                <Loading />
              ) : (
                <CTable hover responsive>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Course Title</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coursesWithCompletionStatus.length > 0 ? (
                      coursesWithCompletionStatus.slice(0, 6).map((course) => (
                        <tr key={course.id}>
                          <td>
                            <Link
                              href={`/enrolled-courses/${course.id}`}
                              className="text-decoration-none"
                            >
                              {course.id}
                            </Link>
                          </td>
                          <td>
                            <Link
                              href={`/enrolled-courses/${course.id}`}
                              className="text-decoration-none"
                            >
                              {course.title}
                            </Link>
                          </td>
                          <td>
                            {course.completed ? (
                              <CBadge
                                color="success"
                                shape="rounded-pill"
                                className="text-success-emphasis bg-success-subtle"
                              >
                                Completed
                              </CBadge>
                            ) : (
                              <CBadge
                                shape="rounded-pill"
                                className="text-warning-emphasis bg-warning-subtle"
                              >
                                In Progress
                              </CBadge>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center fw-bold">
                          No courses found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}
